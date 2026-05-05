import React, { useState, useEffect } from 'react'
import { X, AlertCircle, TrendingUp } from 'lucide-react'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProductFormData) => Promise<void>
  categories: string[]
  onAddCategory: (category: string) => Promise<void>
  isLoading?: boolean
}

export interface ProductFormData {
  name: string
  sku: string
  category: string
  price: number
  cost_price: number
  quantity: number
  unit: string
  reorderLevel: number
  description: string
}

const initialFormData: ProductFormData = {
  name: '',
  sku: '',
  category: '',
  price: 0,
  cost_price: 0,
  quantity: 0,
  unit: 'units',
  reorderLevel: 10,
  description: '',
}

const UNITS = [
  'Units',
  'Bags',
  'Kilograms',
  'Liters',
  'Bottles',
  'Boxes',
  'Crates',
  'Bundles',
]

export default function AddProductModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  onAddCategory,
  isLoading,
}: AddProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'inventory'>('basic')

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData)
      setErrors({})
      setShowNewCategory(false)
      setNewCategory('')
      setActiveTab('basic')
    }
  }, [isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Product name is required'
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0'
    if (formData.cost_price < 0) newErrors.cost_price = 'Buying price cannot be negative'
    if (formData.cost_price >= formData.price) newErrors.cost_price = 'Buying price must be less than selling price'
    if (formData.quantity < 0) newErrors.quantity = 'Quantity cannot be negative'
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setErrors({ ...errors, newCategory: 'Category name is required' })
      return
    }

    try {
      setAddingCategory(true)
      await onAddCategory(newCategory)
      setFormData({ ...formData, category: newCategory })
      setNewCategory('')
      setShowNewCategory(false)
      setErrors({ ...errors, newCategory: '' })
    } catch (error) {
      setErrors({ ...errors, newCategory: error instanceof Error ? error.message : 'Failed to add category' })
    } finally {
      setAddingCategory(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setSubmitting(true)
      await onSubmit(formData)
      setFormData(initialFormData)
      setErrors({})
      onClose()
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to add product' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'cost_price' || name === 'quantity' || name === 'reorderLevel' ? parseFloat(value) || 0 : value,
    }))
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const profit = formData.price - formData.cost_price
  const profitMargin = formData.cost_price > 0 ? ((profit / formData.cost_price) * 100).toFixed(1) : '0'

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
            <p className="text-sm text-gray-600 mt-1">Create a new product in your inventory</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            disabled={submitting || addingCategory}
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-6">
          {(['basic', 'pricing', 'inventory'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === tab
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Info
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle size={20} />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* BASIC INFO TAB */}
          {activeTab === 'basic' && (
            <div className="space-y-5">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Premium Animal Feed"
                  disabled={submitting || addingCategory}
                />
                {errors.name && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">⚠ {errors.name}</p>}
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">SKU (Stock Keeping Unit) *</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.sku ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., AF-2024-001"
                  disabled={submitting || addingCategory}
                />
                {errors.sku && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">⚠ {errors.sku}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Category *</label>
                {showNewCategory ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.newCategory ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter new category name"
                      disabled={addingCategory || submitting}
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
                      disabled={addingCategory || submitting}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCategory(false)
                        setNewCategory('')
                        setErrors({ ...errors, newCategory: '' })
                      }}
                      className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                      disabled={addingCategory || submitting}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      disabled={submitting || addingCategory}
                    >
                      <option value="">-- Select a category --</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowNewCategory(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 mt-2 font-semibold"
                      disabled={submitting || addingCategory}
                    >
                      + Create New Category
                    </button>
                  </div>
                )}
                {errors.category && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">⚠ {errors.category}</p>}
                {errors.newCategory && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">⚠ {errors.newCategory}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Product details, specifications, supplier info, etc."
                  rows={4}
                  disabled={submitting || addingCategory}
                />
              </div>
            </div>
          )}

          {/* PRICING TAB */}
          {activeTab === 'pricing' && (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-blue-900 font-medium">💡 Tip: Set competitive buying and selling prices to maximize profit margins</p>
              </div>

              {/* Buying Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Buying Price (Cost) - KES *</label>
                <input
                  type="number"
                  name="cost_price"
                  value={formData.cost_price || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.cost_price ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  disabled={submitting || addingCategory}
                />
                {errors.cost_price && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">⚠ {errors.cost_price}</p>}
              </div>

              {/* Selling Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Selling Price (Retail) - KES *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  disabled={submitting || addingCategory}
                />
                {errors.price && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">⚠ {errors.price}</p>}
              </div>

              {/* Profit Summary Card */}
              {formData.price > 0 && formData.cost_price > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-300 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="text-green-600" size={20} />
                    <h3 className="font-semibold text-gray-900">Profit Breakdown</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Profit/Unit</p>
                      <p className="text-lg font-bold text-green-600">KES {profit.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Margin %</p>
                      <p className="text-lg font-bold text-green-600">{profitMargin}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Category</p>
                      <p className="text-lg font-bold text-green-600">
                        {profitMargin > 30 ? '🔥 Excellent' : profitMargin > 20 ? '✓ Good' : '⚠ Low'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <p className="text-sm text-amber-900 font-medium">📦 Set accurate stock quantities and reorder levels</p>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Initial Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.quantity ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  min="0"
                  disabled={submitting || addingCategory}
                />
                {errors.quantity && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">⚠ {errors.quantity}</p>}
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Unit of Measure *</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.unit ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={submitting || addingCategory}
                >
                  {UNITS.map((unit) => (
                    <option key={unit} value={unit.toLowerCase()}>
                      {unit}
                    </option>
                  ))}
                </select>
                {errors.unit && <p className="text-red-600 text-sm mt-1 flex items-center gap-1">⚠ {errors.unit}</p>}
              </div>

              {/* Reorder Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Reorder Level (Minimum Stock) *</label>
                <input
                  type="number"
                  name="reorderLevel"
                  value={formData.reorderLevel || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Alert when stock falls below this level"
                  min="0"
                  disabled={submitting || addingCategory}
                />
                <p className="text-xs text-gray-600 mt-2">
                  🚨 You'll be alerted when stock reaches {formData.reorderLevel || '0'} {formData.unit || 'units'}
                </p>
              </div>
            </div>
          )}
        </form>

        {/* Footer Buttons */}
        <div className="flex gap-3 p-6 border-t-2 border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            disabled={submitting || addingCategory}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={submitting || addingCategory || isLoading}
          >
            {submitting ? '⏳ Adding...' : '✓ Add Product'}
          </button>
        </div>
      </div>
    </div>
  )
}

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData)
      setErrors({})
      setShowNewCategory(false)
      setNewCategory('')
    }
  }, [isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Product name is required'
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0'
    if (formData.cost_price < 0) newErrors.cost_price = 'Buying price cannot be negative'
    if (formData.cost_price >= formData.price) newErrors.cost_price = 'Buying price must be less than selling price'
    if (formData.quantity < 0) newErrors.quantity = 'Quantity cannot be negative'
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setErrors({ ...errors, newCategory: 'Category name is required' })
      return
    }

    try {
      setAddingCategory(true)
      await onAddCategory(newCategory)
      setFormData({ ...formData, category: newCategory })
      setNewCategory('')
      setShowNewCategory(false)
      setErrors({ ...errors, newCategory: '' })
    } catch (error) {
      setErrors({ ...errors, newCategory: error instanceof Error ? error.message : 'Failed to add category' })
    } finally {
      setAddingCategory(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setSubmitting(true)
      await onSubmit(formData)
      setFormData(initialFormData)
      setErrors({})
      onClose()
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to add product' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' || name === 'reorderLevel' ? parseFloat(value) || 0 : value,
    }))
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900">Add New Product</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 transition-colors"
            disabled={submitting || addingCategory}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{errors.submit}</div>}

          {/* Product Name & SKU */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.name ? 'border-red-500' : 'border-neutral-200'
                }`}
                placeholder="e.g., Animal Feed Bags"
                disabled={submitting || addingCategory}
              />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">SKU *</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.sku ? 'border-red-500' : 'border-neutral-200'
                }`}
                placeholder="e.g., AF-001"
                disabled={submitting || addingCategory}
              />
              {errors.sku && <p className="text-red-600 text-xs mt-1">{errors.sku}</p>}
            </div>
          </div>

          {/* Category & Selling Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Category *</label>
              {showNewCategory ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.newCategory ? 'border-red-500' : 'border-neutral-200'
                    }`}
                    placeholder="New category name"
                    disabled={addingCategory || submitting}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
                    disabled={addingCategory || submitting}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategory(false)
                      setNewCategory('')
                      setErrors({ ...errors, newCategory: '' })
                    }}
                    className="px-3 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors disabled:opacity-50"
                    disabled={addingCategory || submitting}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.category ? 'border-red-500' : 'border-neutral-200'
                    }`}
                    disabled={submitting || addingCategory}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(true)}
                    className="text-xs text-primary-600 hover:text-primary-700 mt-2 font-medium"
                    disabled={submitting || addingCategory}
                  >
                    + Add New Category
                  </button>
                </div>
              )}
              {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category}</p>}
              {errors.newCategory && <p className="text-red-600 text-xs mt-1">{errors.newCategory}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Selling Price (KES) *</label>
              <input
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.price ? 'border-red-500' : 'border-neutral-200'
                }`}
                placeholder="0.00"
                step="0.01"
                min="0"
                disabled={submitting || addingCategory}
              />
              {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
            </div>
          </div>

          {/* Buying Price & Profit Margin */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Buying Price (KES) *</label>
              <input
                type="number"
                name="cost_price"
                value={formData.cost_price || ''}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.cost_price ? 'border-red-500' : 'border-neutral-200'
                }`}
                placeholder="0.00"
                step="0.01"
                min="0"
                disabled={submitting || addingCategory}
              />
              {errors.cost_price && <p className="text-red-600 text-xs mt-1">{errors.cost_price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Profit Margin per Unit</label>
              <div className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg">
                <p className="text-lg font-semibold text-primary-600">
                  KES {formData.price && formData.cost_price ? (formData.price - formData.cost_price).toFixed(2) : '0.00'}
                </p>
                <p className="text-xs text-neutral-600">
                  {formData.price && formData.cost_price ? ((((formData.price - formData.cost_price) / formData.cost_price) * 100).toFixed(1)) : '0'}% margin
                </p>
              </div>
            </div>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity || ''}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.quantity ? 'border-red-500' : 'border-neutral-200'
                }`}
                placeholder="0"
                min="0"
                disabled={submitting || addingCategory}
              />
              {errors.quantity && <p className="text-red-600 text-xs mt-1">{errors.quantity}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Unit *</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.unit ? 'border-red-500' : 'border-neutral-200'
                }`}
                disabled={submitting || addingCategory}
              >
                <option value="units">Units</option>
                <option value="bags">Bags</option>
                <option value="kilograms">Kilograms</option>
                <option value="liters">Liters</option>
                <option value="bottles">Bottles</option>
                <option value="boxes">Boxes</option>
              </select>
              {errors.unit && <p className="text-red-600 text-xs mt-1">{errors.unit}</p>}
            </div>
          </div>

          {/* Reorder Level */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Reorder Level (units)</label>
            <input
              type="number"
              name="reorderLevel"
              value={formData.reorderLevel || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Minimum quantity before alerting"
              min="0"
              disabled={submitting || addingCategory}
            />
            <p className="text-xs text-neutral-500 mt-1">Alert when stock falls below this level</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Product details, specifications, etc."
              rows={3}
              disabled={submitting || addingCategory}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-neutral-200 text-neutral-700 font-medium rounded-lg hover:bg-neutral-300 transition-colors disabled:opacity-50"
              disabled={submitting || addingCategory}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
              disabled={submitting || addingCategory || isLoading}
            >
              {submitting ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
