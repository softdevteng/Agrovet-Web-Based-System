import React from 'react'
import { Trash2, Minus, Plus } from 'lucide-react'

export interface CartItem {
  productId: string
  productName: string
  sku: string
  unitPrice: number
  quantity: number
}

interface CartProps {
  items: CartItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
  discount: number
  onDiscountChange: (discount: number) => void
  paymentMethod: string
  onPaymentMethodChange: (method: string) => void
  customerName: string
  onCustomerNameChange: (name: string) => void
  customerPhone: string
  onCustomerPhoneChange: (phone: string) => void
  notes: string
  onNotesChange: (notes: string) => void
  onCheckout: () => void
  isProcessing?: boolean
}

export default function SalesCart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  discount,
  onDiscountChange,
  paymentMethod,
  onPaymentMethodChange,
  customerName,
  onCustomerNameChange,
  customerPhone,
  onCustomerPhoneChange,
  notes,
  onNotesChange,
  onCheckout,
  isProcessing,
}: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const tax = subtotal * 0.16 // 16% VAT
  const discountAmount = (subtotal * discount) / 100
  const total = subtotal + tax - discountAmount

  return (
    <div className="bg-white rounded-lg border border-neutral-200 flex flex-col h-full">
      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto border-b border-neutral-200">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-neutral-500">
            <p>No items added yet</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3 p-3 bg-neutral-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-neutral-900 truncate">{item.productName}</p>
                  <p className="text-xs text-neutral-600">{item.sku}</p>
                  <p className="text-sm font-semibold text-primary-600 mt-1">KES {item.unitPrice.toFixed(2)} each</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-lg">
                  <button
                    onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                    className="p-1 hover:bg-neutral-100 transition-colors"
                    disabled={isProcessing}
                  >
                    <Minus size={14} className="text-neutral-600" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                    className="p-1 hover:bg-neutral-100 transition-colors"
                    disabled={isProcessing}
                  >
                    <Plus size={14} className="text-neutral-600" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => onRemoveItem(item.productId)}
                  className="text-red-600 hover:text-red-700 p-1"
                  disabled={isProcessing}
                >
                  <Trash2 size={16} />
                </button>

                {/* Subtotal */}
                <div className="text-right min-w-max">
                  <p className="text-sm font-bold text-neutral-900">
                    KES {(item.unitPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="p-4 border-t border-neutral-200 space-y-4">
        {/* Customer Info */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Customer name (optional)"
            className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            disabled={isProcessing}
          />
          <input
            type="text"
            placeholder="Customer phone (optional)"
            className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={customerPhone}
            onChange={(e) => onCustomerPhoneChange(e.target.value)}
            disabled={isProcessing}
          />
        </div>

        {/* Discount Input */}
        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium text-neutral-700">Discount (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            className="w-20 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={discount}
            onChange={(e) => onDiscountChange(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
            disabled={isProcessing}
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="text-sm font-medium text-neutral-700 block mb-2">Payment Method</label>
          <select
            className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={paymentMethod}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            disabled={isProcessing}
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="mpesa">M-Pesa</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="credit">Credit</option>
          </select>
        </div>

        {/* Notes */}
        <textarea
          placeholder="Sale notes (optional)"
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={2}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          disabled={isProcessing}
        />

        {/* Calculations */}
        <div className="space-y-2 text-sm border-t border-neutral-200 pt-4">
          <div className="flex justify-between">
            <span className="text-neutral-700">Subtotal:</span>
            <span className="font-medium">KES {subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({discount}%):</span>
              <span className="font-medium">-KES {discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-neutral-700">Tax (16%):</span>
            <span className="font-medium">KES {tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold bg-primary-50 p-2 rounded border border-primary-200">
            <span>Total:</span>
            <span className="text-primary-600">KES {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={onCheckout}
          disabled={items.length === 0 || isProcessing}
          className="w-full py-3 bg-primary-500 text-white font-bold rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : `Complete Sale - KES ${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  )
}
