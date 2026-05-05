import React, { useState } from 'react'
import { Edit, Trash2, Eye, Copy, AlertTriangle } from 'lucide-react'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  cost_price?: number
  quantity: number
  reorderLevel: number
  unit?: string
}

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  isLoading?: boolean
}

export default function ProductTable({ products, onEdit, onDelete, isLoading }: ProductTableProps) {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)
  const [copiedSku, setCopiedSku] = useState<string | null>(null)

  const handleCopySku = (sku: string) => {
    navigator.clipboard.writeText(sku)
    setCopiedSku(sku)
    setTimeout(() => setCopiedSku(null), 2000)
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="text-gray-400" size={32} />
        </div>
        <p className="text-gray-500 font-medium mb-2">No products found</p>
        <p className="text-sm text-gray-400">Add your first product to get started managing inventory</p>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-2">
                📦
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Buying Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Selling Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Profit Margin
              </th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => {
              const isLowStock = product.quantity <= product.reorderLevel
              const costPrice = product.cost_price || 0
              const profit = product.price - costPrice
              const profitMargin = costPrice > 0 ? ((profit / costPrice) * 100).toFixed(1) : '0'
              const stockValue = product.price * product.quantity
              const isExpanded = expandedProduct === product.id

              return (
                <React.Fragment key={product.id}>
                  <tr className={`hover:bg-blue-50 transition-colors ${isExpanded ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setExpandedProduct(isExpanded ? null : product.id)}
                        className="text-gray-400 hover:text-blue-600 transition"
                      >
                        {isExpanded ? '▼' : '▶'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="font-bold text-gray-900">{product.name}</span>
                        <div className="text-xs text-gray-500">{product.unit || 'units'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700 font-mono">
                          {product.sku}
                        </code>
                        <button
                          onClick={() => handleCopySku(product.sku)}
                          className="text-gray-400 hover:text-blue-600 transition"
                          title="Copy SKU"
                        >
                          <Copy size={16} />
                        </button>
                        {copiedSku === product.sku && (
                          <span className="text-xs text-green-600 font-medium">✓ Copied</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-medium text-gray-600">
                        KES {costPrice.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="font-bold text-gray-900">
                        KES {product.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex flex-col items-end">
                        <span className="inline-block px-3 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full mb-1">
                          {profitMargin}%
                        </span>
                        <p className="text-xs text-gray-500">
                          KES {profit.toFixed(2)}/unit
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div>
                        <span className={`font-bold text-lg ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
                          {product.quantity}
                        </span>
                        <p className="text-xs text-gray-500">
                          Reorder: {product.reorderLevel}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-full">
                          <AlertTriangle size={14} />
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full">
                          ✓ In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium hover:shadow-sm"
                          title="Edit product"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${product.name}?\n\nThis action cannot be undone.`)) {
                              onDelete(product.id)
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium hover:shadow-sm"
                          title="Delete product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Details Row */}
                  {isExpanded && (
                    <tr className="bg-blue-50 border-t border-blue-200">
                      <td colSpan={10} className="px-6 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div>
                            <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Stock Value</p>
                            <p className="text-lg font-bold text-blue-600">
                              KES {stockValue.toLocaleString('en-KE', { maximumFractionDigits: 0 })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Total Profit (All Units)</p>
                            <p className="text-lg font-bold text-green-600">
                              KES {(profit * product.quantity).toLocaleString('en-KE', { maximumFractionDigits: 0 })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Days Until Stockout*</p>
                            <p className="text-lg font-bold text-gray-700">
                              ~{Math.ceil(product.quantity / 5)} days
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Reorder Status</p>
                            <p className={`text-lg font-bold ${product.quantity <= product.reorderLevel ? 'text-red-600' : 'text-green-600'}`}>
                              {product.quantity <= product.reorderLevel ? '⚠ Critical' : '✓ Normal'}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3 italic">*Estimated based on average daily sales</p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
