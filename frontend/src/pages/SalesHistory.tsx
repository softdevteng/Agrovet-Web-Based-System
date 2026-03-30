import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Search, Filter, Download, Eye } from 'lucide-react'
import axios from 'axios'

interface Transaction {
  id: string
  attendant_id: string
  customer_name?: string
  customer_phone?: string
  subtotal: number
  discount: number
  tax: number
  total: number
  payment_method: string
  notes?: string
  created_at: string
}

const API_BASE = 'http://localhost:5000/api'

export default function SalesHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Mock data - replace with real API call when backend is ready
      const mockTransactions: Transaction[] = [
        {
          id: 'TXN-001',
          attendant_id: 'ATT-001',
          customer_name: 'John Kimani',
          customer_phone: '0712345678',
          subtotal: 5500,
          discount: 10,
          tax: 880,
          total: 6270,
          payment_method: 'cash',
          notes: 'Bulk purchase for farm',
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'TXN-002',
          attendant_id: 'ATT-002',
          customer_name: 'Mary Njeri',
          customer_phone: '0723456789',
          subtotal: 3200,
          discount: 0,
          tax: 512,
          total: 3712,
          payment_method: 'mpesa',
          notes: '',
          created_at: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: 'TXN-003',
          attendant_id: 'ATT-001',
          subtotal: 1800,
          discount: 5,
          tax: 288,
          total: 2016,
          payment_method: 'card',
          notes: 'Regular customer',
          created_at: new Date(Date.now() - 10800000).toISOString(),
        },
        {
          id: 'TXN-004',
          attendant_id: 'ATT-003',
          customer_name: 'Peter Mwangi',
          customer_phone: '0734567890',
          subtotal: 8900,
          discount: 15,
          tax: 1424,
          total: 10189,
          payment_method: 'bank_transfer',
          notes: 'Veterinary supplies order',
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'TXN-005',
          attendant_id: 'ATT-002',
          customer_name: 'Grace Okafor',
          subtotal: 2400,
          discount: 0,
          tax: 384,
          total: 2784,
          payment_method: 'cash',
          notes: '',
          created_at: new Date(Date.now() - 172800000).toISOString(),
        },
      ]

      setTransactions(mockTransactions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions')
      console.error('Error fetching transactions:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let filtered = transactions

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.id.toLowerCase().includes(term) ||
          (t.customer_name && t.customer_name.toLowerCase().includes(term)) ||
          (t.customer_phone && t.customer_phone.includes(term))
      )
    }

    // Payment method filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter((t) => t.payment_method === paymentFilter)
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter((t) => new Date(t.created_at) >= new Date(dateFrom))
    }
    if (dateTo) {
      const endDate = new Date(dateTo)
      endDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter((t) => new Date(t.created_at) <= endDate)
    }

    setFilteredTransactions(filtered)
  }, [transactions, searchTerm, dateFrom, dateTo, paymentFilter])

  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0)
  const totalDiscount = filteredTransactions.reduce((sum, t) => sum + (t.subtotal * t.discount) / 100, 0)
  const totalTax = filteredTransactions.reduce((sum, t) => sum + t.tax, 0)
  const transactionCount = filteredTransactions.length

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'mpesa', label: 'M-Pesa' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'credit', label: 'Credit' },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title">Sales History</h1>
            <p className="text-sm-muted">Track and analyze completed transactions</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium">
            <Download size={18} />
            Export Report
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="card">
            <p className="text-neutral-600 text-sm font-medium mb-2">Total Transactions</p>
            <p className="text-3xl font-bold text-primary-600">{transactionCount}</p>
          </div>
          <div className="card">
            <p className="text-neutral-600 text-sm font-medium mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">KES {totalRevenue.toLocaleString('en-KE', { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="card">
            <p className="text-neutral-600 text-sm font-medium mb-2">Discounts Given</p>
            <p className="text-3xl font-bold text-amber-600">KES {totalDiscount.toLocaleString('en-KE', { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="card">
            <p className="text-neutral-600 text-sm font-medium mb-2">Tax Collected</p>
            <p className="text-3xl font-bold text-blue-600">KES {totalTax.toLocaleString('en-KE', { maximumFractionDigits: 0 })}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {/* Search */}
            <div className="col-span-2 relative">
              <Search className="absolute left-3 top-3 text-neutral-400" size={18} />
              <input
                type="text"
                placeholder="Search by transaction ID, customer name, or phone..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Payment Method */}
            <select
              className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="all">All Payment Methods</option>
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">From Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">To Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Transactions Table */}
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <p>No transactions found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-neutral-900">{transaction.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-neutral-600">
                        {new Date(transaction.created_at).toLocaleString('en-KE')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <p className="font-medium text-neutral-900">
                          {transaction.customer_name || 'Walk-in Customer'}
                        </p>
                        {transaction.customer_phone && (
                          <p className="text-neutral-600">{transaction.customer_phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-neutral-900">KES {transaction.total.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full capitalize">
                        {transaction.payment_method.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.discount > 0 ? (
                        <span className="text-sm font-medium text-green-600">
                          {transaction.discount}% OFF
                        </span>
                      ) : (
                        <span className="text-sm text-neutral-500">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction)
                          setShowDetails(true)
                        }}
                        className="text-primary-600 hover:text-primary-700 p-2"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Transaction Details Modal */}
      {showDetails && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Transaction Details</h2>
              <p className="text-sm text-neutral-600">{selectedTransaction.id}</p>
            </div>

            <div className="space-y-2 text-sm border-t border-neutral-200 pt-4">
              <div className="flex justify-between">
                <span className="text-neutral-600">Date:</span>
                <span className="font-medium">
                  {new Date(selectedTransaction.created_at).toLocaleString('en-KE')}
                </span>
              </div>
              {selectedTransaction.customer_name && (
                <div className="flex justify-between">
                  <span className="text-neutral-600">Customer:</span>
                  <span className="font-medium">{selectedTransaction.customer_name}</span>
                </div>
              )}
              {selectedTransaction.customer_phone && (
                <div className="flex justify-between">
                  <span className="text-neutral-600">Phone:</span>
                  <span className="font-medium">{selectedTransaction.customer_phone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-600">Payment:</span>
                <span className="font-medium capitalize">{selectedTransaction.payment_method.replace(/_/g, ' ')}</span>
              </div>
              <div className="border-t border-neutral-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal:</span>
                  <span className="font-medium">KES {selectedTransaction.subtotal.toFixed(2)}</span>
                </div>
                {selectedTransaction.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({selectedTransaction.discount}%):</span>
                    <span className="font-medium">
                      -KES{' '}
                      {(
                        (selectedTransaction.subtotal * selectedTransaction.discount) /
                        100
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-600">Tax:</span>
                  <span className="font-medium">KES {selectedTransaction.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary-600 border-t border-neutral-200 pt-2 mt-2">
                  <span>Total:</span>
                  <span>KES {selectedTransaction.total.toFixed(2)}</span>
                </div>
              </div>
              {selectedTransaction.notes && (
                <div className="border-t border-neutral-200 pt-2 mt-2">
                  <p className="text-neutral-600 text-xs mb-1">Notes:</p>
                  <p className="text-neutral-900">{selectedTransaction.notes}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowDetails(false)}
              className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}
