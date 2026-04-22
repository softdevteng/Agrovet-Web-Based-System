import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import ProductSelector from '@/components/pos/ProductSelector'
import SalesCart, { CartItem } from '@/components/pos/SalesCart'
import ReceiptModal from '@/components/pos/ReceiptModal'
import { AlertCircle, RotateCcw } from 'lucide-react'
import axios from '@/config/axios'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  quantity: number
  unit: string
  reorderLevel: number
  description: string
}

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
  paymentStatus: string
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  deliveryAddress?: string
  notes?: string
}

const API_BASE = 'http://localhost:8000/api'

export default function POS() {
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [showReceipt, setShowReceipt] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [transactionCounter, setTransactionCounter] = useState(1)
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [deliveryNumber, setDeliveryNumber] = useState('')

  // Get user from localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch {
      return {}
    }
  })()

  // Fetch products on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)

          // Fetch real products from API
          try {
            const res = await axios.get('/inventory/products')
            setProducts(Array.isArray(res.data) ? res.data : res.data.data || [])
          } catch (e) {
            console.error('Error fetching products for POS:', e)
            setError(e instanceof Error ? e.message : 'Failed to load products')
          }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
      console.error('Error fetching products:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectProduct = (product: Product) => {
    if (product.quantity === 0) {
      setError('This product is out of stock')
      setTimeout(() => setError(null), 3000)
      return
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === product.id)

      if (existingItem) {
        // Check if quantity exceeds available stock
        if (existingItem.quantity >= product.quantity) {
          setError(`Only ${product.quantity} units of ${product.name} available`)
          setTimeout(() => setError(null), 3000)
          return prevItems
        }
        return prevItems.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }

      return [
        ...prevItems,
        {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          unitPrice: product.price,
          quantity: 1,
        },
      ]
    })
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId)
    if (product && quantity > product.quantity) {
      setError(`Only ${product.quantity} units available`)
      setTimeout(() => setError(null), 3000)
      return
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    )
  }

  const handleRemoveItem = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError('Cart is empty')
      return
    }

    // Validate credit purchases require customer info
    if (paymentMethod === 'credit') {
      if (!customerName.trim() || !customerPhone.trim()) {
        setError('Customer name and phone are required for credit purchases')
        setTimeout(() => setError(null), 3000)
        return
      }
    }

    try {
      setIsProcessing(true)
      setError(null)

      const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
      const discountAmount = (subtotal * discount) / 100
      const tax = subtotal * 0.16
      const total = subtotal + tax - discountAmount

      // Prepare transaction data
      const transactionData = {
        attendantId: user.id || 'system',
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        subtotal,
        discount,
        tax,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === 'credit' ? 'pending' : 'completed',
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        customerEmail: customerEmail || undefined,
        deliveryAddress: deliveryAddress || undefined,
        notes: notes || undefined,
      }

      // For now, use mock response since backend might not be ready
      // Uncomment when backend is ready:
      // const response = await axios.post(`${API_BASE}/pos/transactions`, transactionData, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // })

      // Mock successful response with SK-#### format
      const mockTransactionId = `SK-${String(transactionCounter).padStart(4, '0')}`
      const mockInvoiceNumber = `INV-${String(transactionCounter).padStart(6, '0')}`
      const mockDeliveryNumber = `DN-${String(transactionCounter).padStart(6, '0')}`
      
      setInvoiceNumber(mockInvoiceNumber)
      setDeliveryNumber(mockDeliveryNumber)
      setTransactionCounter(transactionCounter + 1)

      const receiptData: Receipt = {
        transactionId: mockTransactionId,
        timestamp: new Date().toISOString(),
        attendantId: user.id || 'system',
        items: cartItems.map((item) => ({
          productName: item.productName,
          sku: item.sku,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        subtotal,
        discount,
        discountAmount,
        tax,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === 'credit' ? 'pending' : 'completed',
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        customerEmail: customerEmail || undefined,
        deliveryAddress: deliveryAddress || undefined,
        notes: notes || undefined,
      }

      setReceipt(receiptData)
      setShowReceipt(true)

      // Update local product quantities
      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          const soldItem = cartItems.find((item) => item.productId === product.id)
          if (soldItem) {
            return { ...product, quantity: product.quantity - soldItem.quantity }
          }
          return product
        })
      )

      // Clear cart
      setCartItems([])
      setDiscount(0)
      setCustomerName('')
      setCustomerPhone('')
      setCustomerEmail('')
      setDeliveryAddress('')
      setNotes('')
      setPaymentMethod('cash')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process sale')
      console.error('Checkout error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePrintReceipt = () => {
    // Print functionality
    window.print()
  }

  const handlePrintInvoice = () => {
    // Generate invoice print window
    const invoiceWindow = window.open('', 'PRINT_INVOICE', 'width=800,height=600')
    if (invoiceWindow && receipt) {
      invoiceWindow.document.write(generateInvoiceHTML(receipt, invoiceNumber))
      invoiceWindow.document.close()
      setTimeout(() => invoiceWindow.print(), 250)
    }
  }

  const handlePrintDeliveryNote = () => {
    // Generate delivery note print window
    const deliveryWindow = window.open('', 'PRINT_DELIVERY', 'width=800,height=600')
    if (deliveryWindow && receipt) {
      deliveryWindow.document.write(generateDeliveryNoteHTML(receipt, deliveryNumber))
      deliveryWindow.document.close()
      setTimeout(() => deliveryWindow.print(), 250)
    }
  }

  const generateInvoiceHTML = (receipt: Receipt, invoiceNum: string) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoiceNum}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .company-name { font-size: 24px; font-weight: bold; color: #2D5A27; }
          .invoice-title { font-size: 18px; font-weight: bold; margin: 20px 0; }
          .invoice-details { margin: 20px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background-color: #2D5A27; color: white; padding: 10px; text-align: left; }
          td { padding: 8px; border-bottom: 1px solid #ccc; }
          .totals { text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid #333; }
          .total-row { font-size: 18px; font-weight: bold; color: #2D5A27; margin: 10px 0; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">SK AGROVET</div>
          <p>Professional Agricultural Solutions</p>
        </div>
        
        <div class="invoice-title">INVOICE - ${invoiceNum}</div>
        
        <div class="invoice-details">
          <div>
            <strong>Bill To:</strong><br/>
            ${receipt.customerName || 'Walk-in Customer'}<br/>
            ${receipt.customerPhone || ''}<br/>
            ${receipt.customerEmail || ''}
          </div>
          <div>
            <strong>Transaction ID:</strong> ${receipt.transactionId}<br/>
            <strong>Date:</strong> ${new Date(receipt.timestamp).toLocaleDateString()}<br/>
            <strong>Status:</strong> <span style="color: ${receipt.paymentStatus === 'completed' ? 'green' : 'orange'}">${receipt.paymentStatus.toUpperCase()}</span>
          </div>
        </div>

        <table>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Amount</th>
          </tr>
          ${receipt.items.map(item => `
            <tr>
              <td>${item.productName} (${item.sku})</td>
              <td>${item.quantity}</td>
              <td>KES ${item.unitPrice.toFixed(2)}</td>
              <td>KES ${(item.unitPrice * item.quantity).toFixed(2)}</td>
            </tr>
          `).join('')}
        </table>

        <div class="totals">
          <div>Subtotal: <strong>KES ${receipt.subtotal.toFixed(2)}</strong></div>
          ${receipt.discountAmount > 0 ? `<div>Discount: <strong>-KES ${receipt.discountAmount.toFixed(2)}</strong></div>` : ''}
          <div>Tax (16%): <strong>KES ${receipt.tax.toFixed(2)}</strong></div>
          <div class="total-row">TOTAL: KES ${receipt.total.toFixed(2)}</div>
          <div style="margin-top: 10px; color: #666;">Payment Method: <strong>${receipt.paymentMethod.toUpperCase()}</strong></div>
        </div>

        <div class="footer">
          <p>Thank you for your business!</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `
  }

  const generateDeliveryNoteHTML = (receipt: Receipt, deliveryNum: string) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Delivery Note ${deliveryNum}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .company-name { font-size: 24px; font-weight: bold; color: #2D5A27; }
          .delivery-title { font-size: 18px; font-weight: bold; margin: 20px 0; }
          .delivery-details { margin: 20px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background-color: #2D5A27; color: white; padding: 10px; text-align: left; }
          td { padding: 8px; border-bottom: 1px solid #ccc; }
          .signature-area { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
          .signature-box { border-top: 1px solid #000; padding-top: 10px; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">SK AGROVET</div>
          <p>Professional Agricultural Solutions</p>
        </div>
        
        <div class="delivery-title">DELIVERY NOTE - ${deliveryNum}</div>
        
        <div class="delivery-details">
          <div>
            <strong>Deliver To:</strong><br/>
            ${receipt.customerName || 'Customer'}<br/>
            ${receipt.customerPhone || ''}<br/>
            ${receipt.deliveryAddress || 'Address not provided'}
          </div>
          <div>
            <strong>Transaction ID:</strong> ${receipt.transactionId}<br/>
            <strong>Date:</strong> ${new Date(receipt.timestamp).toLocaleDateString()}<br/>
            <strong>Total Items:</strong> ${receipt.items.reduce((sum, item) => sum + item.quantity, 0)}
          </div>
        </div>

        <table>
          <tr>
            <th>Item Description</th>
            <th>SKU</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Received</th>
          </tr>
          ${receipt.items.map(item => `
            <tr>
              <td>${item.productName}</td>
              <td>${item.sku}</td>
              <td>${item.quantity}</td>
              <td>units</td>
              <td>☐</td>
            </tr>
          `).join('')}
        </table>

        <div style="margin: 20px 0;">
          <strong>Total Amount: KES ${receipt.total.toFixed(2)}</strong><br/>
          <strong>Payment Status:</strong> <span style="color: ${receipt.paymentStatus === 'completed' ? 'green' : 'orange'}">${receipt.paymentStatus.toUpperCase()}</span>
        </div>

        <div class="signature-area">
          <div class="signature-box">
            <strong>Delivered by:</strong><br/>
            Signature: ________________<br/>
            Date: ________________
          </div>
          <div class="signature-box">
            <strong>Received by:</strong><br/>
            Signature: ________________<br/>
            Date: ________________
          </div>
        </div>

        <div class="footer">
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `
  }

  const handleClearCart = () => {
    if (window.confirm('Clear all items from cart?')) {
      setCartItems([])
      setDiscount(0)
      setCustomerName('')
      setCustomerPhone('')
      setCustomerEmail('')
      setDeliveryAddress('')
      setNotes('')
      setPaymentMethod('cash')
    }
  }

  return (
    <Layout>
      <div className="space-y-4">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title">Point of Sale</h1>
            <p className="text-sm-muted">Process customer transactions</p>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              <RotateCcw size={18} />
              Clear Cart
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-medium text-red-900">{error}</p>
            </div>
          </div>
        )}

        {/* Main Layout */}
        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Product Selector - 2 columns */}
          <div className="col-span-2">
            <ProductSelector products={products} onSelectProduct={handleSelectProduct} isLoading={isLoading} />
          </div>

          {/* Sales Cart - 1 column */}
          <div>
            <SalesCart
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              discount={discount}
              onDiscountChange={setDiscount}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              customerName={customerName}
              onCustomerNameChange={setCustomerName}
              customerPhone={customerPhone}
              onCustomerPhoneChange={setCustomerPhone}
              customerEmail={customerEmail}
              onCustomerEmailChange={setCustomerEmail}
              deliveryAddress={deliveryAddress}
              onDeliveryAddressChange={setDeliveryAddress}
              notes={notes}
              onNotesChange={setNotes}
              onCheckout={handleCheckout}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={showReceipt}
        receipt={receipt}
        onClose={() => setShowReceipt(false)}
        onPrint={handlePrintReceipt}
        onPrintInvoice={receipt?.paymentStatus === 'pending' ? handlePrintInvoice : undefined}
        onPrintDelivery={receipt?.paymentStatus === 'pending' ? handlePrintDeliveryNote : undefined}
      />
    </Layout>
  )
}
