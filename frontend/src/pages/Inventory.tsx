import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import ProductTable from '@/components/inventory/ProductTable'
import AddProductModal, { ProductFormData } from '@/components/inventory/AddProductModal'
import EditProductModal from '@/components/inventory/EditProductModal'
import { 
  Plus, Search, Filter, AlertCircle, Download, TrendingUp, Box, 
  BarChart3, Eye, EyeOff, DollarSign, Warehouse
} from 'lucide-react'
import axios from '@/config/axios'

interface Product extends ProductFormData {
  id: string
}

const API_BASE = 'http://localhost:8000/api'

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([
    'Seeds',
    'Fertilizers',
    'Animal Feed',
    'Medicines',
    'Pesticides',
    'Equipment',
    'Supplements',
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price' | 'value'>('name')
  const [filterLowStock, setFilterLowStock] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<(Product & { id: string }) | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Fetch products on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  // Filter and sort products
  useEffect(() => {
    let filtered = products

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term))
    }

    if (filterLowStock) {
      filtered = filtered.filter((p) => p.quantity <= p.reorderLevel)
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'stock':
          return a.quantity - b.quantity
        case 'price':
          return a.price - b.price
        case 'value':
          return (a.price * a.quantity) - (b.price * b.quantity)
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, sortBy, filterLowStock])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await axios.get(`${API_BASE}/inventory/products`)
      setProducts(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
      console.error('Failed to fetch products:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProduct = async (data: ProductFormData) => {
    try {
      const response = await axios.post(`${API_BASE}/inventory/products`, data)
      setProducts([...products, response.data])
      setSuccessMessage('Product added successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
      await fetchProducts() // Refresh list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add product')
    }
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  const handleUpdateProduct = async (id: string, data: ProductFormData) => {
    try {
      await axios.put(`${API_BASE}/inventory/products/${id}`, data)
      setProducts(products.map((p) => (p.id === id ? { id, ...data } : p)))
      setSuccessMessage('Product updated successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
      await fetchProducts() // Refresh list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update product')
    }
  }
  const totalStockValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0)
  const totalCost = products.reduce((sum, p) => sum + (p.cost_price || 0) * p.quantity, 0)
  const totalProfit = totalStockValue - totalCost
  const lowStockCount = products.filter((p) => p.quantity <= p.reorderLevel).length

  const handleDeleteProduct = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/inventory/products/${id}`)
      setProducts(products.filter((p) => p.id !== id))
      setSuccessMessage('Product deleted successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product')
    }
  }

  const handleAddCategory = (newCategory: string) => {
    if (!categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
    }
  }

  const handleExportCSV = () => {
    const csv = [
      ['Product Name', 'SKU', 'Category', 'Quantity', 'Buying Price', 'Selling Price', 'Stock Value'],
      ...filteredProducts.map(p => [
        p.name,
        p.sku,
        p.category,
        p.quantity,
        p.cost_price || 0,
        p.price,
        (p.price * p.quantity).toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inventory_${new Date().getTime()}.csv`
    a.click()
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title">Inventory Management</h1>
            <p className="text-sm-muted">Track products, stock levels, and inventory value</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              <Download size={20} />
              Export
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockCount > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
            <div>
              <p className="font-medium text-amber-900">{lowStockCount} product(s) below reorder level</p>
              <p className="text-sm text-amber-800">Consider adding stock to prevent shortages</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium">{successMessage}</div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">
            {error}
            <button onClick={() => setError(null)} className="ml-4 underline text-sm">
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 card border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-700 text-sm font-medium">Total Products</p>
              <Box className="text-blue-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-blue-600">{products.length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 card border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-700 text-sm font-medium">Stock Value</p>
              <DollarSign className="text-purple-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-purple-600">
              KES {(totalStockValue / 1000).toFixed(1)}K
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 card border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-red-700 text-sm font-medium">Low Stock</p>
              <AlertCircle className="text-red-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-red-600">{lowStockCount}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 card border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-700 text-sm font-medium">Potential Profit</p>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-green-600">
              KES {(totalProfit / 1000).toFixed(1)}K
            </p>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="space-y-3">
          <div className="card flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-neutral-400" size={20} />
              <input
                type="text"
                placeholder="Search by product name or SKU..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="input w-48"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Filter size={18} />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="card bg-gray-50 border-l-4 border-blue-500 grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="input w-full"
                >
                  <option value="name">Product Name</option>
                  <option value="stock">Stock Quantity</option>
                  <option value="price">Price</option>
                  <option value="value">Stock Value</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterLowStock}
                    onChange={(e) => setFilterLowStock(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">Show only low stock</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Products Table */}
        <ProductTable
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          isLoading={isLoading}
        />
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProduct}
        categories={categories}
        onAddCategory={handleAddCategory}
      />

      {/* Edit Product Modal */}
      {selectedProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedProduct(null)
          }}
          onSubmit={handleUpdateProduct}
          product={selectedProduct}
          categories={categories}
          onAddCategory={handleAddCategory}
        />
      )}
    </Layout>
  )
}
