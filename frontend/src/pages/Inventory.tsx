import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import ProductTable from '@/components/inventory/ProductTable'
import AddProductModal, { ProductFormData } from '@/components/inventory/AddProductModal'
import EditProductModal from '@/components/inventory/EditProductModal'
import { Plus, Search, Filter, AlertCircle } from 'lucide-react'
import axios from 'axios'

interface Product extends ProductFormData {
  id: string
}

const API_BASE = 'http://localhost:5000/api'

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<(Product & { id: string }) | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Fetch products on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term))
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      // For now, return mock data since backend might not have real inventory data yet
      // Once backend is ready, uncomment the real API call:
      // const response = await axios.get(`${API_BASE}/inventory/products`, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // })
      // setProducts(response.data.data || response.data)

      // Mock data for development
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Premium Animal Feed Bags',
          sku: 'AF-001',
          category: 'Animal Feed',
          price: 500,
          cost_price: 300,
          quantity: 45,
          unit: 'bags',
          reorderLevel: 10,
          description: 'High-quality animal feed suitable for cattle and goats',
        },
        {
          id: '2',
          name: 'Organic Fertilizer 50kg',
          sku: 'FER-002',
          category: 'Fertilizers',
          price: 1200,
          cost_price: 800,
          quantity: 8,
          unit: 'bags',
          reorderLevel: 15,
          description: 'Organic fertilizer for sustainable farming',
        },
        {
          id: '3',
          name: 'Cattle Dewormer Tablets',
          sku: 'MED-003',
          category: 'Medicines',
          price: 350,
          cost_price: 150,
          quantity: 120,
          unit: 'units',
          reorderLevel: 20,
          description: 'Effective dewormer for cattle',
        },
      ]
      setProducts(mockProducts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
      console.error('Failed to fetch products:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProduct = async (data: ProductFormData) => {
    try {
      // Real API call (uncomment when backend is ready):
      // const response = await axios.post(`${API_BASE}/inventory/products`, data, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // })
      // const newProduct: Product = { id: response.data.id, ...data }

      // Mock implementation
      const newProduct: Product = {
        id: Date.now().toString(),
        ...data,
      }

      setProducts([...products, newProduct])
      setSuccessMessage('Product added successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
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
      // Real API call (uncomment when backend is ready):
      // await axios.put(`${API_BASE}/inventory/products/${id}`, data, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // })

      // Mock implementation
      setProducts(products.map((p) => (p.id === id ? { id, ...data } : p)))
      setSuccessMessage('Product updated successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update product')
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      // Real API call (uncomment when backend is ready):
      // await axios.delete(`${API_BASE}/inventory/products/${id}`, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // })

      // Mock implementation
      setProducts(products.filter((p) => p.id !== id))
      setSuccessMessage('Product deleted successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product')
    }
  }

  const handleAddCategory = async (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category])
    }
  }

  const lowStockCount = products.filter((p) => p.quantity <= p.reorderLevel).length

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title">Inventory Management</h1>
            <p className="text-sm-muted">Manage products, batches, and stock levels</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            <Plus size={20} />
            Add Product
          </button>
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

        {/* Filters */}
        <div className="card flex gap-4">
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card">
            <p className="text-neutral-600 text-sm font-medium mb-2">Total Products</p>
            <p className="text-3xl font-bold text-primary-600">{products.length}</p>
          </div>
          <div className="card">
            <p className="text-neutral-600 text-sm font-medium mb-2">Total Stock Value</p>
            <p className="text-3xl font-bold text-primary-600">
              KES{' '}
              {products
                .reduce((sum, p) => sum + p.price * p.quantity, 0)
                .toLocaleString('en-KE', { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="card">
            <p className="text-neutral-600 text-sm font-medium mb-2">Low Stock Items</p>
            <p className={`text-3xl font-bold ${lowStockCount > 0 ? 'text-red-600' : 'text-green-600'}`}>{lowStockCount}</p>
          </div>
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
