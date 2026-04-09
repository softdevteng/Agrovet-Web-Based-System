import React from 'react'
import { Edit, Trash2 } from 'lucide-react'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  cost_price?: number
  quantity: number
  reorderLevel: number
}

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  isLoading?: boolean
}

export default function ProductTable({ products, onEdit, onDelete, isLoading }: ProductTableProps) {
  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="card">
        <p className="text-neutral-500 text-center py-12">No products found. Add your first product to get started.</p>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Product Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              SKU
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Buying Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Selling Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Profit/Unit
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {products.map((product) => {
            const isLowStock = product.quantity <= product.reorderLevel
            return (
              <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium text-neutral-900">{product.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-neutral-600">{product.sku}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-neutral-600">KES {product.cost_price ? product.cost_price.toFixed(2) : '0.00'}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium text-neutral-900">KES {product.price.toFixed(2)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full mb-1">
                      KES {product.cost_price ? (product.price - product.cost_price).toFixed(2) : product.price.toFixed(2)}
                    </span>
                    <p className="text-xs text-neutral-500">
                      {product.cost_price ? ((((product.price - product.cost_price) / product.cost_price) * 100).toFixed(1)) : '100'}% margin
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
                    {product.quantity} units
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isLowStock ? (
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                      Low Stock
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                      In Stock
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit product"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${product.name}?`)) {
                          onDelete(product.id)
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
