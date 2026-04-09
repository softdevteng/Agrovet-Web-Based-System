import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Plus, Trash2, Printer, Download, Eye, MoreVertical } from 'lucide-react'
import axios from 'axios'

interface Product {
  id: string
  name: string
  sku: string
  price: number
  cost_price?: number
  quantity: number
  unit: string
}

interface InvoiceItem {
  productId: string
  productName: string
  sku: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

interface Invoice {
  id: string
  invoiceNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  customerAddress?: string
  items: InvoiceItem[]
  subtotal: number
  discount: number
  tax: number
  total: number
  notes?: string
  createdAt: string
  status: 'draft' | 'sent' | 'delivered' | 'paid'
}

const API_BASE = 'http://localhost:8000/api'

export default function Invoices() {
  const [products, setProducts] = useState<Product[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [notes, setNotes] = useState('')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [selectedQuantity, setSelectedQuantity] = useState(1)

  // Fetch products on mount
  useEffect(() => {
    fetchProducts()
    fetchInvoices()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Mock data for now
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Premium Animal Feed Bags',
          sku: 'AF-001',
          price: 500,
          cost_price: 300,
          quantity: 45,
          unit: 'bags',
        },
        {
          id: '2',
          name: 'Organic Fertilizer 50kg',
          sku: 'FER-002',
          price: 1200,
          cost_price: 800,
          quantity: 8,
          unit: 'bags',
        },
        {
          id: '3',
          name: 'Cattle Dewormer Tablets',
          sku: 'MED-003',
          price: 350,
          cost_price: 150,
          quantity: 120,
          unit: 'units',
        },
        {
          id: '4',
          name: 'Poultry Layer Feed',
          sku: 'AF-002',
          price: 2500,
          cost_price: 1800,
          quantity: 25,
          unit: 'bags',
        },
        {
          id: '5',
          name: 'NPK Fertilizer 25-5-5',
          sku: 'FER-001',
          price: 1500,
          cost_price: 1000,
          quantity: 12,
          unit: 'bags',
        },
      ]
      setProducts(mockProducts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchInvoices = async () => {
    try {
      // Mock invoices
      setInvoices([])
    } catch (err) {
      console.error('Error fetching invoices:', err)
    }
  }

  const handleAddItem = () => {
    if (!selectedProductId || selectedQuantity <= 0) {
      setError('Please select a product and quantity')
      return
    }

    const product = products.find((p) => p.id === selectedProductId)
    if (!product) {
      setError('Product not found')
      return
    }

    if (selectedQuantity > product.quantity) {
      setError(`Only ${product.quantity} units available`)
      return
    }

    // Check if item already in invoice
    const existingItem = invoiceItems.find((item) => item.productId === selectedProductId)
    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + selectedQuantity
      if (newQuantity > product.quantity) {
        setError(`Only ${product.quantity} units available`)
        return
      }
      setInvoiceItems(
        invoiceItems.map((item) =>
          item.productId === selectedProductId
            ? { ...item, quantity: newQuantity, lineTotal: newQuantity * item.unitPrice }
            : item
        )
      )
    } else {
      // Add new item
      const newItem: InvoiceItem = {
        productId: selectedProductId,
        productName: product.name,
        sku: product.sku,
        unitPrice: product.price,
        quantity: selectedQuantity,
        lineTotal: product.price * selectedQuantity,
      }
      setInvoiceItems([...invoiceItems, newItem])
    }

    setSelectedProductId('')
    setSelectedQuantity(1)
    setError(null)
  }

  const handleRemoveItem = (productId: string) => {
    setInvoiceItems(invoiceItems.filter((item) => item.productId !== productId))
  }

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId)
      return
    }

    const product = products.find((p) => p.id === productId)
    if (product && newQuantity > product.quantity) {
      setError(`Only ${product.quantity} units available`)
      return
    }

    setInvoiceItems(
      invoiceItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity, lineTotal: newQuantity * item.unitPrice }
          : item
      )
    )
  }

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.lineTotal, 0)
  const discountAmount = (subtotal * discount) / 100
  const tax = subtotal * 0.16
  const total = subtotal + tax - discountAmount

  const generateInvoicePDF = () => {
    // Generate professional invoice HTML
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 900px; margin: 0 auto; padding: 20px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 3px solid #2D5A27; padding-bottom: 20px; }
          .company-info { color: #2D5A27; }
          .company-name { font-size: 24px; font-weight: bold; }
          .company-details { font-size: 12px; margin-top: 5px; }
          .invoice-title-section { text-align: right; }
          .invoice-number { font-size: 16px; font-weight: bold; }
          .invoice-date { font-size: 12px; color: #666; }
          .customer-section { margin-bottom: 30px; }
          .section-title { font-weight: bold; margin-bottom: 10px; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          thead { background-color: #2D5A27; color: white; }
          th { padding: 12px; text-align: left; font-size: 12px; font-weight: bold; }
          td { padding: 10px 12px; border-bottom: 1px solid #ddd; font-size: 12px; }
          tbody tr:hover { background-color: #f9f9f9; }
          .totals { margin-left: auto; width: 300px; }
          .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; }
          .total-row.final { border-top: 2px solid #2D5A27; border-bottom: 2px solid #2D5A27; font-weight: bold; font-size: 16px; color: #2D5A27; margin-top: 10px; padding: 15px 0; }
          .notes { margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #2D5A27; }
          .footer { margin-top: 40px; text-align: center; color: #999; font-size: 10px; }
          .print-button { text-align: right; margin-bottom: 20px; }
          .print-button button { padding: 10px 20px; background-color: #2D5A27; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
          @media print { .print-button { display: none; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="company-info">
              <div class="company-name">SK AGROVET</div>
              <div class="company-details">
                <p>Professional Agricultural Solutions</p>
                <p>Ndunyu Njeru</p>
                <p>Tel: 0724621145 / 0720438768</p>
              </div>
            </div>
            <div class="invoice-title-section">
              <div class="invoice-number">INVOICE</div>
              <div class="invoice-date">${new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div class="customer-section">
            <div class="section-title">Bill To:</div>
            <p><strong>${customerName}</strong></p>
            ${customerPhone ? `<p>Phone: ${customerPhone}</p>` : ''}
            ${customerEmail ? `<p>Email: ${customerEmail}</p>` : ''}
            ${customerAddress ? `<p>Address: ${customerAddress}</p>` : ''}
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>SKU</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceItems
        .map(
          (item) => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.sku}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">KES ${item.unitPrice.toFixed(2)}</td>
                  <td style="text-align: right;">KES ${item.lineTotal.toFixed(2)}</td>
                </tr>
              `
        )
        .join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>KES ${subtotal.toFixed(2)}</span>
            </div>
            ${discount > 0 ? `
              <div class="total-row">
                <span>Discount (${discount}%):</span>
                <span>-KES ${discountAmount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="total-row">
              <span>Tax (16%):</span>
              <span>KES ${tax.toFixed(2)}</span>
            </div>
            <div class="total-row final">
              <span>TOTAL:</span>
              <span>KES ${total.toFixed(2)}</span>
            </div>
          </div>

          ${notes ? `
            <div class="notes">
              <strong>Notes:</strong>
              <p>${notes}</p>
            </div>
          ` : ''}

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </div>

        <script>
          window.print();
        </script>
      </body>
      </html>
    `

    const newWindow = window.open('', 'PRINT_INVOICE', 'width=900,height=600')
    if (newWindow) {
      newWindow.document.write(invoiceHTML)
      newWindow.document.close()
    }
  }

  const generateDeliveryNotePDF = () => {
    const deliveryHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Delivery Note</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 900px; margin: 0 auto; padding: 20px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 3px solid #2D5A27; padding-bottom: 20px; }
          .company-info { color: #2D5A27; }
          .company-name { font-size: 24px; font-weight: bold; }
          .delivery-title { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
          .info-box { }
          .info-label { font-weight: bold; margin-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          thead { background-color: #2D5A27; color: white; }
          th { padding: 12px; text-align: left; font-size: 12px; font-weight: bold; }
          td { padding: 10px 12px; border-bottom: 1px solid #ddd; font-size: 12px; }
          .signature-section { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
          .signature-box { }
          .signature-line { border-top: 1px solid #000; margin-top: 30px; padding-top: 5px; }
          .total-amount { font-size: 14px; font-weight: bold; margin: 20px 0; }
          @media print { .print-button { display: none; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="company-info">
              <div class="company-name">SK AGROVET</div>
              <p style="font-size: 12px; margin-top: 5px;">Ndunyu Njeru | Tel: 0724621145 / 0720438768</p>
            </div>
            <div>
              <div class="delivery-title">DELIVERY NOTE</div>
              <div style="font-size: 12px; color: #666;">${new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div class="info-grid">
            <div class="info-box">
              <div class="info-label">Deliver To:</div>
              <p><strong>${customerName}</strong></p>
              ${customerPhone ? `<p>Phone: ${customerPhone}</p>` : ''}
              ${customerAddress ? `<p>Address: ${customerAddress}</p>` : ''}
            </div>
            <div class="info-box">
              <div class="info-label">Delivery Details:</div>
              <p>Total Items: ${invoiceItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
              <p>Total Amount: <strong>KES ${total.toFixed(2)}</strong></p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>SKU</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: center;">Received</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceItems
        .map(
          (item) => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.sku}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: center;">☐</td>
                </tr>
              `
        )
        .join('')}
            </tbody>
          </table>

          <div class="signature-section">
            <div class="signature-box">
              <p><strong>Delivered By:</strong></p>
              <p style="margin-top: 10px; font-size: 11px;">Name: ____________________</p>
              <p style="margin: 10px 0; font-size: 11px;">Signature:</p>
              <div class="signature-line"></div>
              <p style="margin-top: 5px; font-size: 11px;">Date: ____________________</p>
            </div>
            <div class="signature-box">
              <p><strong>Received By:</strong></p>
              <p style="margin-top: 10px; font-size: 11px;">Name: ____________________</p>
              <p style="margin: 10px 0; font-size: 11px;">Signature:</p>
              <div class="signature-line"></div>
              <p style="margin-top: 5px; font-size: 11px;">Date: ____________________</p>
            </div>
          </div>

          <div style="margin-top: 40px; text-align: center; color: #999; font-size: 10px;">
            <p>Thank you for your business!</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </div>

        <script>
          window.print();
        </script>
      </body>
      </html>
    `

    const newWindow = window.open('', 'PRINT_DELIVERY', 'width=900,height=600')
    if (newWindow) {
      newWindow.document.write(deliveryHTML)
      newWindow.document.close()
    }
  }

  const handleCreateInvoice = async () => {
    if (!customerName.trim() || invoiceItems.length === 0) {
      setError('Please enter customer name and add items')
      return
    }

    try {
      // In real implementation, store invoice to backend
      // For now, just show the PDFs
      generateInvoicePDF()
      
      // Clear form
      setCustomerName('')
      setCustomerPhone('')
      setCustomerEmail('')
      setCustomerAddress('')
      setInvoiceItems([])
      setDiscount(0)
      setNotes('')
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice')
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title">Invoice Management</h1>
            <p className="text-sm-muted">Create professional invoices and delivery notes for customers</p>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            <Plus size={18} />
            {isCreating ? 'Cancel' : 'Create Invoice'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Create Invoice Form */}
        {isCreating && (
          <div className="bg-white rounded-lg border border-neutral-200 p-6 space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h2 className="font-semibold text-neutral-900">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Customer Name *"
                  className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
                <textarea
                  placeholder="Delivery Address"
                  className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 md:col-span-2"
                  rows={2}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                />
              </div>
            </div>

            {/* Add Items Section */}
            <div className="space-y-4">
              <h2 className="font-semibold text-neutral-900">Add Items to Invoice</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Product</label>
                  <select
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                  >
                    <option value="">Select Product...</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - KES {product.price} ({product.quantity} available)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>
                <button
                  onClick={handleAddItem}
                  className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                >
                  Add Item
                </button>
              </div>
            </div>

            {/* Invoice Items */}
            {invoiceItems.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-neutral-900">Invoice Items</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-neutral-700">Product</th>
                        <th className="px-4 py-2 text-left font-medium text-neutral-700">Price</th>
                        <th className="px-4 py-2 text-center font-medium text-neutral-700">Qty</th>
                        <th className="px-4 py-2 text-right font-medium text-neutral-700">Total</th>
                        <th className="px-4 py-2 text-center font-medium text-neutral-700">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {invoiceItems.map((item) => (
                        <tr key={item.productId}>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-neutral-900">{item.productName}</p>
                              <p className="text-xs text-neutral-600">{item.sku}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">KES {item.unitPrice.toFixed(2)}</td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="number"
                              min="1"
                              className="w-16 px-2 py-1 border border-neutral-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-primary-500"
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value) || 1)}
                            />
                          </td>
                          <td className="px-4 py-3 text-right font-medium">KES {item.lineTotal.toFixed(2)}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleRemoveItem(item.productId)}
                              className="text-red-600 hover:text-red-700 font-medium"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Discount and Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Notes</label>
                <textarea
                  placeholder="Special notes or terms..."
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Totals */}
            {invoiceItems.length > 0 && (
              <div className="bg-neutral-50 p-6 rounded-lg space-y-3">
                <div className="flex justify-between text-neutral-700">
                  <span>Subtotal:</span>
                  <span className="font-medium">KES {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%):</span>
                    <span className="font-medium">-KES {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-700">
                  <span>Tax (16%):</span>
                  <span className="font-medium">KES {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold bg-white px-4 py-3 rounded border border-primary-200">
                  <span>Total:</span>
                  <span className="text-primary-600">KES {total.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-neutral-200">
              <button
                onClick={handleCreateInvoice}
                disabled={invoiceItems.length === 0 || !customerName.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Printer size={18} />
                Generate Invoice & Print
              </button>
              {invoiceItems.length > 0 && (
                <button
                  onClick={generateDeliveryNotePDF}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  <Download size={18} />
                  Print Delivery Note
                </button>
              )}
            </div>
          </div>
        )}

        {/* Recent Invoices */}
        {!isCreating && (
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent Invoices</h2>
            {invoices.length === 0 ? (
              <p className="text-neutral-600 text-center py-8">No invoices created yet. Create your first invoice to get started.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-neutral-700">Invoice #</th>
                      <th className="px-4 py-2 text-left font-medium text-neutral-700">Customer</th>
                      <th className="px-4 py-2 text-left font-medium text-neutral-700">Amount</th>
                      <th className="px-4 py-2 text-left font-medium text-neutral-700">Date</th>
                      <th className="px-4 py-2 text-left font-medium text-neutral-700">Status</th>
                      <th className="px-4 py-2 text-center font-medium text-neutral-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="px-4 py-3 font-medium">{invoice.invoiceNumber}</td>
                        <td className="px-4 py-3">{invoice.customerName}</td>
                        <td className="px-4 py-3 font-medium">KES {invoice.total.toFixed(2)}</td>
                        <td className="px-4 py-3 text-neutral-600">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            invoice.status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : invoice.status === 'sent'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button className="text-blue-600 hover:text-blue-700">
                              <Eye size={16} />
                            </button>
                            <button className="text-primary-600 hover:text-primary-700">
                              <Printer size={16} />
                            </button>
                            <button className="text-gray-600 hover:text-gray-700">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
