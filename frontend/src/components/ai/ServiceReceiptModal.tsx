import React from 'react'
import { CheckCircle, Printer } from 'lucide-react'

interface ServiceReceipt {
  receiptId: string
  timestamp: string
  bullName: string
  breed: string
  cowId: string
  cowName: string
  farmerId: string
  farmerName: string
  technicianId: string
  technicianName: string
  heatDate: string
  serviceDate: string
  observationIndex: number
  cost: number
  notes?: string
}

interface ServiceReceiptModalProps {
  isOpen: boolean
  receipt: ServiceReceipt | null
  onClose: () => void
  onPrint: () => void
}

const observationIndexLabels: Record<number, string> = {
  1: 'Excellent',
  2: 'Good',
  3: 'Fair',
  4: 'Poor',
  5: 'Very Poor',
}

export default function ServiceReceiptModal({ isOpen, receipt, onClose, onPrint }: ServiceReceiptModalProps) {
  if (!isOpen || !receipt) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="p-8 bg-white border-b-4 border-primary-600 text-center space-y-3">
          <div className="text-5xl font-bold text-primary-600 mb-3">SK AGROVET</div>
          <p className="text-lg font-medium text-neutral-700">Ndunyu Njeru</p>
          <p className="text-sm font-medium text-neutral-600">Contact: 0724621145 / 0720438768</p>
          <div className="border-t border-neutral-200 pt-4 mt-4">
            <CheckCircle size={48} className="mx-auto text-green-600 mb-3" />
            <h2 className="text-2xl font-bold text-neutral-900">AI Service Completed!</h2>
            <p className="text-sm text-neutral-600">Service recorded successfully</p>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-8 space-y-6 font-mono text-base">
          {/* Transaction Header */}
          <div className="border-b-2 border-neutral-300 pb-4">
            <div className="flex justify-between text-neutral-700 text-sm font-medium">
              <span>Receipt ID:</span>
              <span className="font-bold text-neutral-900 text-lg">{receipt.receiptId}</span>
            </div>
            <div className="flex justify-between text-neutral-700 text-sm font-medium mt-2">
              <span>Date:</span>
              <span className="font-bold text-neutral-900">{new Date(receipt.timestamp).toLocaleString('en-KE')}</span>
            </div>
          </div>

          {/* Service Details */}
          <div className="border-b-2 border-neutral-300 pb-4">
            <div className="text-sm font-bold text-neutral-900 mb-4 text-lg">SERVICE DETAILS</div>

            {/* Bull Info */}
            <div className="mb-4 pb-4 border-b border-dashed">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-neutral-600">Bull:</span>
                <span className="font-bold text-neutral-900">{receipt.bullName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-600">Breed:</span>
                <span className="font-bold text-neutral-900">{receipt.breed}</span>
              </div>
            </div>

            {/* Cow Info */}
            <div className="mb-4 pb-4 border-b border-dashed">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-neutral-600">Cow ID:</span>
                <span className="font-bold text-neutral-900">{receipt.cowId}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-neutral-600">Cow Name:</span>
                <span className="font-bold text-neutral-900">{receipt.cowName}</span>
              </div>
            </div>

            {/* Farmer Info */}
            <div className="mb-4 pb-4 border-b border-dashed">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-neutral-600">Farmer ID:</span>
                <span className="font-bold text-neutral-900">{receipt.farmerId}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-neutral-600">Farmer:</span>
                <span className="font-bold text-neutral-900">{receipt.farmerName}</span>
              </div>
            </div>

            {/* Heat & Service Dates */}
            <div className="mb-4 pb-4 border-b border-dashed">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-neutral-600">Heat Date:</span>
                <span className="font-bold text-neutral-900">
                  {new Date(receipt.heatDate).toLocaleDateString('en-KE')}
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-neutral-600">Service Date:</span>
                <span className="font-bold text-neutral-900">
                  {new Date(receipt.serviceDate).toLocaleDateString('en-KE')}
                </span>
              </div>
            </div>

            {/* Observation */}
            <div className="mb-4 pb-4 border-b border-dashed">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-neutral-600">Observation:</span>
                <span className="font-bold text-neutral-900">
                  {receipt.observationIndex} - {observationIndexLabels[receipt.observationIndex]}
                </span>
              </div>
            </div>

            {/* Technician Info */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-neutral-600">Technician ID:</span>
                <span className="font-bold text-neutral-900">{receipt.technicianId}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-neutral-600">Technician:</span>
                <span className="font-bold text-neutral-900">{receipt.technicianName}</span>
              </div>
            </div>
          </div>

          {/* Cost Section */}
          <div className="border-b-2 border-dashed border-neutral-400 pb-4">
            <div className="flex justify-between text-2xl font-bold text-neutral-900 p-3 bg-primary-50 rounded border-2 border-primary-300">
              <span>Service Cost:</span>
              <span className="text-primary-600">KES {receipt.cost.toFixed(2)}</span>
            </div>
          </div>

          {/* Notes */}
          {receipt.notes && (
            <div className="bg-yellow-50 p-4 rounded text-sm border-2 border-yellow-300">
              <p className="font-bold text-yellow-900 mb-2 text-base">Notes:</p>
              <p className="text-yellow-800 text-base">{receipt.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-neutral-700 space-y-2 border-t border-dashed border-neutral-400 pt-4">
            <p className="font-semibold text-neutral-900 text-lg">Thank you!</p>
            <p className="font-bold text-base">SK AGROVET</p>
            <p className="text-base">Ndunyu Njeru</p>
            <p className="font-medium">Tel: 0724621145 / 0720438768</p>
            <p className="text-neutral-600 text-sm mt-3">Quality AI Services for Livestock</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t-2 border-neutral-300 flex gap-4 bg-neutral-50">
          <button
            onClick={onPrint}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold text-lg"
          >
            <Printer size={22} />
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors font-semibold text-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
