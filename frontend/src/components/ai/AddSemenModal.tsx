import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface AddSemenModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: SemenFormData) => Promise<void>
  isLoading?: boolean
}

export interface SemenFormData {
  breed: string
  bullId: string
  bullName: string
  origin: string
  quantity: number
  price?: number
  expiryDate: string
  tankId: string
  temperature?: number
}

const initialFormData: SemenFormData = {
  breed: '',
  bullId: '',
  bullName: '',
  origin: '',
  quantity: 0,
  price: 0,
  expiryDate: '',
  tankId: '',
  temperature: -196,
}

const breeds = [
  'Friesian',
  'Jersey',
  'Guernsey',
  'Ayrshire',
  'Holstein',
  'Simmental',
  'Angus',
  'Brahman',
  'Zebu',
  'Crossbreed',
]

const origins = ['Local', 'Imported - USA', 'Imported - Europe', 'Imported - Australia', 'Imported - Other']

export default function AddSemenModal({ isOpen, onClose, onSubmit, isLoading }: AddSemenModalProps) {
  const [formData, setFormData] = useState<SemenFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData)
      setErrors({})
    }
  }, [isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.breed.trim()) newErrors.breed = 'Breed is required'
    if (!formData.bullId.trim()) newErrors.bullId = 'Bull ID is required'
    if (!formData.bullName.trim()) newErrors.bullName = 'Bull name is required'
    if (!formData.origin.trim()) newErrors.origin = 'Origin is required'
    if (formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0'
    if ((formData.price || 0) <= 0) newErrors.price = 'Price must be greater than 0'
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required'
    if (!formData.tankId.trim()) newErrors.tankId = 'Tank ID is required'

    const expiryDate = new Date(formData.expiryDate)
    if (expiryDate < new Date()) {
      newErrors.expiryDate = 'Expiry date must be in the future'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to add semen straw' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'temperature' ? parseFloat(value) || 0 : value,
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
          <h2 className="text-xl font-bold text-neutral-900">Add Semen Straw</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 transition-colors"
            disabled={submitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{errors.submit}</div>}

          {/* Bull Information Section */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
            <h3 className="font-semibold text-blue-900 mb-3">Bull Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Bull ID *</label>
                <input
                  type="text"
                  name="bullId"
                  value={formData.bullId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.bullId ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  placeholder="e.g., BULL-001"
                  disabled={submitting || isLoading}
                />
                {errors.bullId && <p className="text-red-600 text-xs mt-1">{errors.bullId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Bull Name *</label>
                <input
                  type="text"
                  name="bullName"
                  value={formData.bullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.bullName ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  placeholder="e.g., Mzuri"
                  disabled={submitting || isLoading}
                />
                {errors.bullName && <p className="text-red-600 text-xs mt-1">{errors.bullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Breed *</label>
                <select
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.breed ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  disabled={submitting || isLoading}
                >
                  <option value="">Select breed</option>
                  {breeds.map((breed) => (
                    <option key={breed} value={breed}>
                      {breed}
                    </option>
                  ))}
                </select>
                {errors.breed && <p className="text-red-600 text-xs mt-1">{errors.breed}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Origin *</label>
                <select
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.origin ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  disabled={submitting || isLoading}
                >
                  <option value="">Select origin</option>
                  {origins.map((origin) => (
                    <option key={origin} value={origin}>
                      {origin}
                    </option>
                  ))}
                </select>
                {errors.origin && <p className="text-red-600 text-xs mt-1">{errors.origin}</p>}
              </div>
            </div>
          </div>

          {/* Storage Information Section */}
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
            <h3 className="font-semibold text-amber-900 mb-3">Storage Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Quantity (Straws) *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.quantity ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  placeholder="0"
                  min="1"
                  disabled={submitting || isLoading}
                />
                {errors.quantity && <p className="text-red-600 text-xs mt-1">{errors.quantity}</p>}
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
                  placeholder="0"
                  min="0"
                  step="0.01"
                  disabled={submitting || isLoading}
                />
                {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Tank ID *</label>
                <input
                  type="text"
                  name="tankId"
                  value={formData.tankId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.tankId ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  placeholder="e.g., TANK-A1"
                  disabled={submitting || isLoading}
                />
                {errors.tankId && <p className="text-red-600 text-xs mt-1">{errors.tankId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Temperature (°C)</label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="-196"
                  disabled={submitting || isLoading}
                />
                <p className="text-xs text-neutral-500 mt-1">Standard: -196°C (liquid nitrogen)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Expiry Date *</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.expiryDate ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  disabled={submitting || isLoading}
                />
                {errors.expiryDate && <p className="text-red-600 text-xs mt-1">{errors.expiryDate}</p>}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-neutral-200 text-neutral-700 font-medium rounded-lg hover:bg-neutral-300 transition-colors disabled:opacity-50"
              disabled={submitting || isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
              disabled={submitting || isLoading}
            >
              {submitting ? 'Adding...' : 'Add Semen Straw'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
