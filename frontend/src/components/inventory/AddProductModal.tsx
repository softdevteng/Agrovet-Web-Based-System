import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

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
  quantity: 0,
  unit: 'units',
  reorderLevel: 10,
  description: '',
}

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

          {/* Category & Price */}
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
              <label className="block text-sm font-medium text-neutral-700 mb-1">Price (KES) *</label>
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
