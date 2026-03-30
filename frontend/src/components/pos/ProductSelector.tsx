import React, { useState, useEffect } from 'react'
import { Search, Plus } from 'lucide-react'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  quantity: number
}

interface ProductSelectorProps {
  products: Product[]
  onSelectProduct: (product: Product) => void
  isLoading?: boolean
}

export default function ProductSelector({ products, onSelectProduct, isLoading }: ProductSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)

  // Get unique categories
  const categories = ['all', ...new Set(products.map((p) => p.category))]

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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="w-6 h-6 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-neutral-200">
      {/* Search & Filter */}
      <div className="p-4 border-b border-neutral-200 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {cat === 'all' ? 'All Products' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => onSelectProduct(product)}
                disabled={product.quantity === 0}
                className={`p-3 text-left border rounded-lg transition-colors ${
                  product.quantity === 0
                    ? 'border-neutral-200 bg-neutral-50 cursor-not-allowed opacity-50'
                    : 'border-neutral-200 hover:border-primary-500 hover:bg-blue-50 cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-neutral-900 truncate">{product.name}</p>
                    <p className="text-xs text-neutral-500">{product.sku}</p>
                    <p className="text-xs text-neutral-600 mt-1">{product.category}</p>
                  </div>
                  <Plus size={16} className="text-primary-500 flex-shrink-0 mt-1" />
                </div>
                <div className="mt-2 flex items-end justify-between">
                  <span className="text-sm font-bold text-primary-600">KES {product.price.toFixed(2)}</span>
                  <span className={`text-xs font-medium ${product.quantity > 5 ? 'text-green-600' : 'text-amber-600'}`}>
                    {product.quantity} in stock
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
