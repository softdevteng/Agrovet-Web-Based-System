import React, { useState, useEffect } from 'react'
import { Search, Plus, Droplet, AlertCircle, Eye } from 'lucide-react'

export interface SemenStraw {
  id: string
  breed: string
  bullId: string
  bullName: string
  origin: string
  quantity: number
  expiryDate: string
  tankId: string
  temperature?: number
  status: 'available' | 'used' | 'expired'
  createdAt: string
}

interface SemenCatalogueProps {
  semenStraws: SemenStraw[]
  onAddSemen: () => void
  onSelectSemen: (semen: SemenStraw) => void
  onViewDetails: (semen: SemenStraw) => void
  isLoading?: boolean
}

export default function SemenCatalogue({
  semenStraws,
  onAddSemen,
  onSelectSemen,
  onViewDetails,
  isLoading,
}: SemenCatalogueProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterBreed, setFilterBreed] = useState('all')
  const [filteredSemen, setFilteredSemen] = useState<SemenStraw[]>(semenStraws)

  // Get unique breeds
  const breeds = ['all', ...new Set(semenStraws.map((s) => s.breed))]

  useEffect(() => {
    let filtered = semenStraws

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.bullName.toLowerCase().includes(term) ||
          s.bullId.toLowerCase().includes(term) ||
          s.breed.toLowerCase().includes(term)
      )
    }

    // Breed filter
    if (filterBreed !== 'all') {
      filtered = filtered.filter((s) => s.breed === filterBreed)
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((s) => s.status === filterStatus)
    }

    setFilteredSemen(filtered)
  }, [semenStraws, searchTerm, filterStatus, filterBreed])

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Semen Straw Inventory</h2>
          <p className="text-sm text-neutral-600">Manage bull semen straws in storage</p>
        </div>
        <button
          onClick={onAddSemen}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
        >
          <Plus size={18} />
          Add Semen Straw
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search by bull name, ID, or breed..."
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select
            className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filterBreed}
            onChange={(e) => setFilterBreed(e.target.value)}
          >
            {breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed === 'all' ? 'All Breeds' : breed}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="used">Used</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Semen Straws Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSemen.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <Droplet size={48} className="mx-auto text-neutral-300 mb-3" />
            <p className="text-neutral-500">No semen straws found</p>
          </div>
        ) : (
          filteredSemen.map((semen) => {
            const isExpired = new Date(semen.expiryDate) < new Date()
            const daysToExpiry = Math.ceil(
              (new Date(semen.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            )

            return (
              <div
                key={semen.id}
                className={`card p-4 border-l-4 transition-all hover:shadow-lg ${
                  semen.status === 'available'
                    ? 'border-l-green-500'
                    : semen.status === 'used'
                      ? 'border-l-neutral-400'
                      : 'border-l-red-500'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-neutral-900">{semen.bullName}</h3>
                    <p className="text-xs text-neutral-600">Bull ID: {semen.bullId}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      semen.status === 'available'
                        ? 'bg-green-100 text-green-700'
                        : semen.status === 'used'
                          ? 'bg-neutral-100 text-neutral-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {semen.status.charAt(0).toUpperCase() + semen.status.slice(1)}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Breed:</span>
                    <span className="font-medium text-neutral-900">{semen.breed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Origin:</span>
                    <span className="font-medium text-neutral-900">{semen.origin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Quantity:</span>
                    <span className="font-bold text-primary-600">{semen.quantity} straws</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Tank:</span>
                    <span className="font-medium text-neutral-900">{semen.tankId}</span>
                  </div>
                  {semen.temperature && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Temp:</span>
                      <span className="font-medium text-neutral-900">{semen.temperature}°C</span>
                    </div>
                  )}
                </div>

                {/* Expiry Info */}
                <div
                  className={`p-2 rounded text-xs mb-4 ${
                    isExpired
                      ? 'bg-red-50 border border-red-200'
                      : daysToExpiry <= 30
                        ? 'bg-yellow-50 border border-yellow-200'
                        : 'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle
                      size={16}
                      className={
                        isExpired ? 'text-red-600' : daysToExpiry <= 30 ? 'text-yellow-600' : 'text-blue-600'
                      }
                    />
                    <span
                      className={
                        isExpired ? 'text-red-700' : daysToExpiry <= 30 ? 'text-yellow-700' : 'text-blue-700'
                      }
                    >
                      {isExpired
                        ? 'EXPIRED'
                        : daysToExpiry <= 0
                          ? 'Expires Today'
                          : daysToExpiry === 1
                            ? 'Expires Tomorrow'
                            : `${daysToExpiry} days to expiry`}
                    </span>
                  </div>
                  <p className="text-xs mt-1">Expiry: {new Date(semen.expiryDate).toLocaleDateString('en-KE')}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewDetails(semen)}
                    className="flex-1 px-3 py-2 bg-neutral-100 text-neutral-700 rounded hover:bg-neutral-200 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Eye size={14} />
                    Details
                  </button>
                  <button
                    onClick={() => onSelectSemen(semen)}
                    disabled={semen.status !== 'available' || semen.quantity === 0}
                    className="flex-1 px-3 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Use Straw
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
