import React from 'react'
import { X, Droplet } from 'lucide-react'

interface SemenDetailsModalProps {
  isOpen: boolean
  semen: {
    id: string
    breed: string
    bullId: string
    bullName: string
    origin: string
    quantity: number
    expiryDate: string
    tankId: string
    temperature?: number
    status: string
    createdAt: string
  } | null
  onClose: () => void
}

export default function SemenDetailsModal({ isOpen, semen, onClose }: SemenDetailsModalProps) {
  if (!isOpen || !semen) return null

  const isExpired = new Date(semen.expiryDate) < new Date()
  const daysToExpiry = Math.ceil(
    (new Date(semen.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Droplet size={32} />
            <div>
              <h2 className="text-2xl font-bold">{semen.bullName}</h2>
              <p className="text-blue-100">Semen Straw Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-lg border ${
              semen.status === 'available'
                ? 'bg-green-50 border-green-200'
                : semen.status === 'used'
                  ? 'bg-neutral-50 border-neutral-200'
                  : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`font-bold text-sm ${
                    semen.status === 'available'
                      ? 'text-green-900'
                      : semen.status === 'used'
                        ? 'text-neutral-900'
                        : 'text-red-900'
                  }`}
                >
                  Status: {semen.status.toUpperCase()}
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  {semen.status === 'available'
                    ? 'Ready for use'
                    : semen.status === 'used'
                      ? 'No longer available'
                      : 'No longer usable'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-600">{semen.quantity}</p>
                <p className="text-xs text-neutral-600">straws available</p>
              </div>
            </div>
          </div>

          {/* Bull Information Section */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-3">Bull Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-600 font-medium">Bull ID</p>
                <p className="text-neutral-900 font-mono">{semen.bullId}</p>
              </div>
              <div>
                <p className="text-neutral-600 font-medium">Bull Name</p>
                <p className="text-neutral-900">{semen.bullName}</p>
              </div>
              <div>
                <p className="text-neutral-600 font-medium">Breed</p>
                <p className="text-neutral-900">{semen.breed}</p>
              </div>
              <div>
                <p className="text-neutral-600 font-medium">Origin</p>
                <p className="text-neutral-900">{semen.origin}</p>
              </div>
            </div>
          </div>

          {/* Storage Information Section */}
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h3 className="font-bold text-amber-900 mb-3">Storage Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-600 font-medium">Tank ID</p>
                <p className="text-neutral-900 font-mono">{semen.tankId}</p>
              </div>
              {semen.temperature && (
                <div>
                  <p className="text-neutral-600 font-medium">Temperature</p>
                  <p className="text-neutral-900 font-mono">{semen.temperature}°C</p>
                </div>
              )}
              <div>
                <p className="text-neutral-600 font-medium">Date Added</p>
                <p className="text-neutral-900">{new Date(semen.createdAt).toLocaleDateString('en-KE')}</p>
              </div>
              {semen.temperature === undefined && (
                <div>
                  <p className="text-neutral-600 font-medium">Standard Storage</p>
                  <p className="text-neutral-900">-196°C (Liquid N₂)</p>
                </div>
              )}
            </div>
          </div>

          {/* Expiry Information */}
          <div
            className={`p-4 rounded-lg border ${
              isExpired
                ? 'bg-red-50 border-red-200'
                : daysToExpiry <= 30
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-green-50 border-green-200'
            }`}
          >
            <h3
              className={`font-bold mb-3 ${
                isExpired
                  ? 'text-red-900'
                  : daysToExpiry <= 30
                    ? 'text-yellow-900'
                    : 'text-green-900'
              }`}
            >
              Expiry Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className={`font-medium ${isExpired ? 'text-red-700' : daysToExpiry <= 30 ? 'text-yellow-700' : 'text-green-700'}`}>
                  Status
                </p>
                <p className="text-neutral-900">
                  {isExpired
                    ? 'EXPIRED'
                    : daysToExpiry <= 0
                      ? 'Expires Today'
                      : daysToExpiry === 1
                        ? 'Expires Tomorrow'
                        : `${daysToExpiry} days remaining`}
                </p>
              </div>
              <div>
                <p className="text-neutral-600 font-medium">Expiry Date</p>
                <p className="text-neutral-900 font-mono">{new Date(semen.expiryDate).toLocaleDateString('en-KE')}</p>
              </div>
            </div>
          </div>

          {/* Characteristics Table */}
          <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
            <h3 className="font-bold text-neutral-900 mb-3">Straw Characteristics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Straw Type</span>
                <span className="font-medium text-neutral-900">0.5 mL Plastic Straw</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-neutral-600">Concentration</span>
                <span className="font-medium text-neutral-900">50 × 10⁶ sperms/mL</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-neutral-600">Motility</span>
                <span className="font-medium text-neutral-900">&gt; 60% Progressive</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-neutral-600">Viability</span>
                <span className="font-medium text-neutral-900">&gt; 70%</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-neutral-600">Dilution Rate</span>
                <span className="font-medium text-neutral-900">1:1 (Semen:Extender)</span>
              </div>
              <div className="flex justify-between border-t pt-2"> 
                <span className="text-neutral-600">Freezing Point</span>
                <span className="font-medium text-neutral-900">-196°C</span>
              </div>
            </div>
          </div>

          {/* Handling Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-2">Handling Instructions</h3>
            <ul className="text-xs text-neutral-700 space-y-1 ml-4 list-disc">
              <li>Keep in liquid nitrogen tank at -196°C at all times</li>
              <li>Do not allow thawing during storage or transport</li>
              <li>Thaw at 37°C for 30 seconds before use</li>
              <li>Check straw integrity before use</li>
              <li>Use within 4 hours of thawing</li>
              <li>Maintain proper tank maintenance records</li>
            </ul>
          </div>
        </div>

        {/* Close Button */}
        <div className="p-4 border-t border-neutral-200 flex justify-end bg-neutral-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
