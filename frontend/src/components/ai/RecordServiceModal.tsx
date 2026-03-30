import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface RecordServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ServiceFormData) => Promise<void>
  selectedSemen?: {
    id: string
    bullName: string
    breed: string
  } | null
  isLoading?: boolean
}

export interface ServiceFormData {
  cowId: string
  cowName: string
  farmerId: string
  farmerName: string
  semenStrawId: string
  bullName: string
  breed: string
  heatDate: string
  serviceDate: string
  technicianId: string
  technicianName: string
  observationIndex: number
  cost: number
  notes?: string
}

const initialFormData: ServiceFormData = {
  cowId: '',
  cowName: '',
  farmerId: '',
  farmerName: '',
  semenStrawId: '',
  bullName: '',
  breed: '',
  heatDate: '',
  serviceDate: '',
  technicianId: '',
  technicianName: '',
  observationIndex: 1,
  cost: 500,
  notes: '',
}

export default function RecordServiceModal({
  isOpen,
  onClose,
  onSubmit,
  selectedSemen,
  isLoading,
}: RecordServiceModalProps) {
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen && selectedSemen) {
      setFormData((prev) => ({
        ...prev,
        semenStrawId: selectedSemen.id,
        bullName: selectedSemen.bullName,
        breed: selectedSemen.breed,
        serviceDate: new Date().toISOString().split('T')[0],
      }))
    } else if (!isOpen) {
      setFormData(initialFormData)
      setErrors({})
    }
  }, [isOpen, selectedSemen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.cowId.trim()) newErrors.cowId = 'Cow ID is required'
    if (!formData.cowName.trim()) newErrors.cowName = 'Cow name is required'
    if (!formData.farmerId.trim()) newErrors.farmerId = 'Farmer ID is required'
    if (!formData.farmerName.trim()) newErrors.farmerName = 'Farmer name is required'
    if (!formData.heatDate) newErrors.heatDate = 'Heat date is required'
    if (!formData.serviceDate) newErrors.serviceDate = 'Service date is required'
    if (!formData.technicianId.trim()) newErrors.technicianId = 'Technician ID is required'
    if (!formData.technicianName.trim()) newErrors.technicianName = 'Technician name is required'
    if (formData.observationIndex < 1 || formData.observationIndex > 5)
      newErrors.observationIndex = 'Observation index must be between 1 and 5'
    if (formData.cost < 0) newErrors.cost = 'Cost cannot be negative'

    const heatDate = new Date(formData.heatDate)
    const serviceDate = new Date(formData.serviceDate)

    if (heatDate > serviceDate) {
      newErrors.serviceDate = 'Service date must be after heat date'
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
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to record service' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'observationIndex' || name === 'cost' ? parseFloat(value) || 0 : value,
    }))
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900">Record AI Service</h2>
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

          {/* Semen Information (Read-only) */}
          {formData.semenStrawId && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Semen Details</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-neutral-600">Bull Name</p>
                  <p className="font-medium text-neutral-900">{formData.bullName}</p>
                </div>
                <div>
                  <p className="text-neutral-600">Breed</p>
                  <p className="font-medium text-neutral-900">{formData.breed}</p>
                </div>
                <div>
                  <p className="text-neutral-600">Straw ID</p>
                  <p className="font-medium text-neutral-900">{formData.semenStrawId}</p>
                </div>
              </div>
            </div>
          )}

          {/* Cow Information */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-3">Cow Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Cow ID *</label>
                <input
                  type="text"
                  name="cowId"
                  value={formData.cowId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.cowId ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  placeholder="e.g., COW-001"
                  disabled={submitting || isLoading}
                />
                {errors.cowId && <p className="text-red-600 text-xs mt-1">{errors.cowId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Cow Name *</label>
                <input
                  type="text"
                  name="cowName"
                  value={formData.cowName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.cowName ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  placeholder="e.g., Daisy"
                  disabled={submitting || isLoading}
                />
                {errors.cowName && <p className="text-red-600 text-xs mt-1">{errors.cowName}</p>}
              </div>
            </div>
          </div>

          {/* Farmer Information */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-900 mb-3">Farmer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Farmer ID *</label>
                <input
                  type="text"
                  name="farmerId"
                  value={formData.farmerId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.farmerId ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  placeholder="e.g., FARM-001"
                  disabled={submitting || isLoading}
                />
                {errors.farmerId && <p className="text-red-600 text-xs mt-1">{errors.farmerId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Farmer Name *</label>
                <input
                  type="text"
                  name="farmerName"
                  value={formData.farmerName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.farmerName ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  placeholder="e.g., John Kimani"
                  disabled={submitting || isLoading}
                />
                {errors.farmerName && <p className="text-red-600 text-xs mt-1">{errors.farmerName}</p>}
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-3">Service Information</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Heat Date *</label>
                <input
                  type="date"
                  name="heatDate"
                  value={formData.heatDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.heatDate ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  disabled={submitting || isLoading}
                />
                {errors.heatDate && <p className="text-red-600 text-xs mt-1">{errors.heatDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Service Date *</label>
                <input
                  type="date"
                  name="serviceDate"
                  value={formData.serviceDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.serviceDate ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  disabled={submitting || isLoading}
                />
                {errors.serviceDate && <p className="text-red-600 text-xs mt-1">{errors.serviceDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Observation Index (1-5) *</label>
                <select
                  name="observationIndex"
                  value={formData.observationIndex}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.observationIndex ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  disabled={submitting || isLoading}
                >
                  <option value="1">1 - Excellent</option>
                  <option value="2">2 - Good</option>
                  <option value="3">3 - Fair</option>
                  <option value="4">4 - Poor</option>
                  <option value="5">5 - Very Poor</option>
                </select>
                {errors.observationIndex && <p className="text-red-600 text-xs mt-1">{errors.observationIndex}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Service Cost (KES) *</label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.cost ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  placeholder="500"
                  min="0"
                  step="50"
                  disabled={submitting || isLoading}
                />
                {errors.cost && <p className="text-red-600 text-xs mt-1">{errors.cost}</p>}
              </div>
            </div>
          </div>

          {/* Technician Information */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-900 mb-3">Technician Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Technician ID *</label>
                <input
                  type="text"
                  name="technicianId"
                  value={formData.technicianId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.technicianId ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  placeholder="e.g., TECH-001"
                  disabled={submitting || isLoading}
                />
                {errors.technicianId && <p className="text-red-600 text-xs mt-1">{errors.technicianId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Technician Name *</label>
                <input
                  type="text"
                  name="technicianName"
                  value={formData.technicianName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.technicianName ? 'border-red-500' : 'border-neutral-200'
                  }`}
                  placeholder="e.g., Dr. Mwangi"
                  disabled={submitting || isLoading}
                />
                {errors.technicianName && <p className="text-red-600 text-xs mt-1">{errors.technicianName}</p>}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Service Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Any observations or notes about the service..."
              rows={3}
              disabled={submitting || isLoading}
            />
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
              {submitting ? 'Recording...' : 'Record Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
