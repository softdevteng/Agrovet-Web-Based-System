import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import ProductSelector from '@/components/pos/ProductSelector'
import SalesCart, { CartItem } from '@/components/pos/SalesCart'
import ReceiptModal from '@/components/pos/ReceiptModal'
import { AlertCircle, RotateCcw } from 'lucide-react'
import axios from 'axios'

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
  customerName?: string
  customerPhone?: string
  notes?: string
}

const API_BASE = 'http://localhost:5000/api'

export default function POS() {
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [showReceipt, setShowReceipt] = useState(false)
  const [transactionCounter, setTransactionCounter] = useState(1)

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

      // Mock data for now - same as inventory
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Premium Animal Feed Bags',
          sku: 'AF-001',
          category: 'Animal Feed',
          price: 500,
          quantity: 45,
          unit: 'bags',
          reorderLevel: 10,
          description: 'High-quality animal feed suitable for cattle and goats',
        },
        {
          id: '2',
          name: 'Organic Fertilizer 50kg',
          sku: 'FER-002',
          category: 'Fertilizers',
          price: 1200,
          quantity: 8,
          unit: 'bags',
          reorderLevel: 15,
          description: 'Organic fertilizer for sustainable farming',
        },
        {
          id: '3',
          name: 'Cattle Dewormer Tablets',
          sku: 'MED-003',
          category: 'Medicines',
          price: 350,
          quantity: 120,
          unit: 'units',
          reorderLevel: 20,
          description: 'Effective dewormer for cattle',
        },
        {
          id: '4',
          name: 'Poultry Layer Feed',
          sku: 'AF-002',
          category: 'Animal Feed',
          price: 2500,
          quantity: 25,
          unit: 'bags',
          reorderLevel: 5,
          description: 'Specially formulated for laying hens',
        },
        {
          id: '5',
          name: 'NPK Fertilizer 25-5-5',
          sku: 'FER-001',
          category: 'Fertilizers',
          price: 1500,
          quantity: 12,
          unit: 'bags',
          reorderLevel: 10,
          description: 'Balanced NPK formula for general crops',
        },
        {
          id: '6',
          name: 'Antibiotic Injection',
          sku: 'MED-001',
          category: 'Medicines',
          price: 450,
          quantity: 60,
          unit: 'bottles',
          reorderLevel: 15,
          description: 'Injectable antibiotic for livestock',
        },
      ]
      setProducts(mockProducts)
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
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        notes: notes || undefined,
      }

      // For now, use mock response since backend might not be ready
      // Uncomment when backend is ready:
      // const response = await axios.post(`${API_BASE}/pos/transactions`, transactionData, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // })

      // Mock successful response with SK-#### format
      const mockTransactionId = `SK-${String(transactionCounter).padStart(4, '0')}`
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
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
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

  const handleClearCart = () => {
    if (window.confirm('Clear all items from cart?')) {
      setCartItems([])
      setDiscount(0)
      setCustomerName('')
      setCustomerPhone('')
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
      />
    </Layout>
  )
}
