import React from 'react'
import { CheckCircle, X, Printer } from 'lucide-react'

interface Receipt {
  transactionId: string
  timestamp: string
  attendantId: string
  items: Array<{
    productName: string
    sku: string
    quantity: number
    unitPrice: number
  }>
  subtotal: number
  discount: number
  discountAmount: number
  tax: number
  total: number
  paymentMethod: string
  customerName?: string
  customerPhone?: string
  notes?: string
}

interface ReceiptModalProps {
  isOpen: boolean
  receipt: Receipt | null
  onClose: () => void
  onPrint: () => void
}

export default function ReceiptModal({ isOpen, receipt, onClose, onPrint }: ReceiptModalProps) {
  if (!isOpen || !receipt) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 bg-white border-b-2 border-primary-600 text-center space-y-2">
          <div className="text-3xl font-bold text-primary-600 mb-2">SK AGROVET</div>
          <p className="text-sm font-medium text-neutral-700">Ndunyu Njeru</p>
          <p className="text-xs text-neutral-600">Contact: 0724621145 / 0720438768</p>
          <div className="border-t border-neutral-200 pt-3 mt-3">
            <CheckCircle size={32} className="mx-auto text-green-600 mb-2" />
            <h2 className="text-lg font-bold text-neutral-900">Sale Completed!</h2>
            <p className="text-xs text-neutral-600">Transaction successful</p>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-6 font-mono text-sm">
          {/* Transaction Header */}
          <div className="border-b border-neutral-200 pb-4">
            <div className="flex justify-between text-neutral-600 text-xs">
              <span>Receipt ID:</span>
              <span className="font-bold text-neutral-900">{receipt.transactionId}</span>
            </div>
            <div className="flex justify-between text-neutral-600 text-xs mt-1">
              <span>Date:</span>
              <span className="font-bold text-neutral-900">{new Date(receipt.timestamp).toLocaleString('en-KE')}</span>
            </div>
          </div>

          {/* Customer Info */}
          {(receipt.customerName || receipt.customerPhone) && (
            <div className="border-b border-neutral-200 pb-4">
              {receipt.customerName && (
                <div className="flex justify-between text-neutral-600 text-xs">
                  <span>Customer:</span>
                  <span className="font-bold text-neutral-900">{receipt.customerName}</span>
                </div>
              )}
              {receipt.customerPhone && (
                <div className="flex justify-between text-neutral-600 text-xs mt-1">
                  <span>Phone:</span>
                  <span className="font-bold text-neutral-900">{receipt.customerPhone}</span>
                </div>
              )}
            </div>
          )}

          {/* Items */}
          <div className="border-b border-neutral-200 pb-4">
            <div className="mb-3 flex justify-between text-xs font-bold text-neutral-900 border-b border-dashed pb-2">
              <span>ITEM</span>
              <span>QTY × PRICE</span>
              <span>TOTAL</span>
            </div>
            {receipt.items.map((item, idx) => (
              <div key={idx} className="mb-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-neutral-900 max-w-xs">{item.productName}</span>
                  <span className="text-neutral-600">
                    {item.quantity}×{item.unitPrice.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-neutral-700">
                  <span className="text-neutral-500">{item.sku}</span>
                  <span className="font-bold">KES {(item.quantity * item.unitPrice).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-b border-dashed border-neutral-300 pb-4 space-y-1">
            <div className="flex justify-between text-neutral-700">
              <span>Subtotal:</span>
              <span className="font-bold">KES {receipt.subtotal.toFixed(2)}</span>
            </div>
            {receipt.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({receipt.discount}%):</span>
                <span className="font-bold">-KES {receipt.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-700">
              <span>Tax (16%):</span>
              <span className="font-bold">KES {receipt.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-neutral-900 mt-2 pt-2 border-t-2 border-neutral-300">
              <span>TOTAL:</span>
              <span className="text-primary-600">KES {receipt.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="border-b border-neutral-200 pb-4">
            <div className="flex justify-between text-neutral-600 text-xs">
              <span>Payment Method:</span>
              <span className="font-bold text-neutral-900 capitalize">{receipt.paymentMethod.replace(/_/g, ' ')}</span>
            </div>
          </div>

          {/* Notes */}
          {receipt.notes && (
            <div className="bg-yellow-50 p-3 rounded text-xs">
              <p className="font-bold text-neutral-900 mb-1">Notes:</p>
              <p className="text-neutral-700">{receipt.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-neutral-600 space-y-1 border-t border-dashed border-neutral-300 pt-3">
            <p className="font-semibold text-neutral-900">Thank you for your purchase!</p>
            <p>SK AGROVET</p>
            <p>Ndunyu Njeru</p>
            <p>Tel: 0724621145 / 0720438768</p>
            <p className="text-neutral-500 text-xs mt-2">Quality Agricultural Products & Services</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-neutral-200 flex gap-3 bg-neutral-50">
          <button
            onClick={onPrint}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            <Printer size={18} />
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
