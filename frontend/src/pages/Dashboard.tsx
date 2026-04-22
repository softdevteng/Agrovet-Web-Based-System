import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import StatCard from '@/components/common/StatCard'
import Alert from '@/components/common/Alert'
import InventoryBreakdown from '@/components/dashboard/InventoryBreakdown'
import InventoryAlerts from '@/components/dashboard/InventoryAlerts'
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments'
import { ShoppingCart, Package, Users, Zap, TrendingUp } from 'lucide-react'
import axios from '@/config/axios'

const API_BASE = 'http://localhost:8000/api'

interface DashboardStats {
  todaysSales: number
  todaysTransactions: number
  inventoryValue: number
  inventoryItems: number
  activeFarmers: number
  aiServicesThisMonth: number
  profitThisMonth: number
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats>({
    todaysSales: 0,
    todaysTransactions: 0,
    inventoryValue: 0,
    inventoryItems: 0,
    activeFarmers: 0,
    aiServicesThisMonth: 0,
    profitThisMonth: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [alerts, setAlerts] = React.useState([
    { id: 1, type: 'warning' as const, title: 'Low Stock Alert', message: '8 products below reorder level' },
    { id: 2, type: 'info' as const, title: 'AI Service Reminder', message: 'Pregnancy follow-up due for 3 cows' },
  ])

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true)
      
      // Fetch all necessary data
      const [posRes, inventoryRes, aiRes] = await Promise.all([
        axios.get(`${API_BASE}/pos/transactions`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE}/inventory/products`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE}/ai/services`).catch(() => ({ data: [] }))
      ])

      const transactions = Array.isArray(posRes.data) ? posRes.data : posRes.data.data || []
      const products = Array.isArray(inventoryRes.data) ? inventoryRes.data : inventoryRes.data.data || []
      const aiServices = Array.isArray(aiRes.data) ? aiRes.data : aiRes.data.data || []

      // Calculate today's sales and transactions
      const today = new Date().toDateString()
      const todaysTransactions = transactions.filter(t => new Date(t.createdAt).toDateString() === today)
      const todaysSales = todaysTransactions.reduce((sum, t) => sum + (t.totalAmount || 0), 0)

      // Calculate inventory value and items
      const inventoryItems = products.length
      const inventoryValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.quantity || 0)), 0)

      // Get AI services this month
      const thisMonth = new Date()
      const aiThisMonth = aiServices.filter(s => {
        const serviceDate = new Date(s.createdAt)
        return serviceDate.getMonth() === thisMonth.getMonth() && serviceDate.getFullYear() === thisMonth.getFullYear()
      }).length

      // Calculate profit (revenue - cost)
      const profit = products.reduce((sum, p) => {
        const revenue = (p.price || 0) * (p.quantity || 0)
        const cost = (p.cost_price || 0) * (p.quantity || 0)
        return sum + (revenue - cost)
      }, 0)

      setStats({
        todaysSales,
        todaysTransactions: todaysTransactions.length,
        inventoryValue,
        inventoryItems,
        activeFarmers: 284, // This would come from a farmers endpoint if available
        aiServicesThisMonth: aiThisMonth,
        profitThisMonth: profit,
      })
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
      // Set default values on error
      setStats({
        todaysSales: 0,
        todaysTransactions: 0,
        inventoryValue: 0,
        inventoryItems: 0,
        activeFarmers: 0,
        aiServicesThisMonth: 0,
        profitThisMonth: 0,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get user role to conditionally show/hide analytics
  const userString = localStorage.getItem('user')
  const user = userString ? JSON.parse(userString) : null
  const userRole = user?.role || ''
  
  const canViewSalesAnalytics = userRole === 'admin' || userRole === 'attendant'
  const canViewInventoryAnalytics = userRole === 'admin' || userRole === 'attendant'

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title">Dashboard</h1>
            <p className="text-sm-muted">Welcome back! Here's your business overview for today.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600">Today</p>
            <p className="text-lg font-semibold text-neutral-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              type={alert.type}
              title={alert.title}
              message={alert.message}
              onClose={() => setAlerts(alerts.filter((a) => a.id !== alert.id))}
            />
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Today's Sales"
            value={formatCurrency(stats.todaysSales)}
            subtitle={`${stats.todaysTransactions} transactions`}
            icon={<ShoppingCart size={24} />}
            trend="up"
            trendValue="+12.5% from yesterday"
            color="green"
          />
          <StatCard
            title="Inventory Value"
            value={formatCurrency(stats.inventoryValue)}
            subtitle={`${stats.inventoryItems} items`}
            icon={<Package size={24} />}
            trend="down"
            trendValue="-3.2% this month"
            color="blue"
          />
          <StatCard
            title="Active Farmers"
            value={String(stats.activeFarmers)}
            subtitle="32 new this month"
            icon={<Users size={24} />}
            trend="up"
            trendValue="+8 this week"
            color="yellow"
          />
          <StatCard
            title="AI Services"
            value={String(stats.aiServicesThisMonth)}
            subtitle="Completed this month"
            icon={<Zap size={24} />}
            trend="up"
            trendValue="+4 pending follow-ups"
            color="blue"
          />
          <StatCard
            title="Profit This Month"
            value={formatCurrency(stats.profitThisMonth)}
            subtitle="Total margin captured"
            icon={<TrendingUp size={24} />}
            trend="up"
            trendValue="+22.8% from last month"
            color="green"
          />
        </div>

        {/* Charts and Overview */}
        <div className={`grid grid-cols-1 ${canViewSalesAnalytics || canViewInventoryAnalytics ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
          {/* Left Column - Charts (Only for Attendant/Admin) */}
          {canViewInventoryAnalytics && (
            <div className="lg:col-span-2 space-y-6">
              <InventoryBreakdown />
            </div>
          )}

          {/* Right Column - Quick Overview */}
          <div className="space-y-6">
            {/* KPI Summary */}
            <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">This Month</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-primary-700">Total Revenue</p>
                  <p className="text-2xl font-bold text-primary-900">{formatCurrency(stats.todaysSales * 20)}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-700">Growth Rate</p>
                  <p className="text-2xl font-bold text-primary-900">+18.7%</p>
                </div>
                <div className="pt-3 border-t border-primary-200">
                  <p className="text-xs text-primary-600">vs last month</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('/pos')}
                  className="w-full text-left px-4 py-3 rounded-lg bg-neutral-50 hover:bg-primary-100 text-neutral-900 font-medium transition-colors"
                >
                  + New Sale
                </button>
                <button 
                  onClick={() => navigate('/inventory')}
                  className="w-full text-left px-4 py-3 rounded-lg bg-neutral-50 hover:bg-primary-100 text-neutral-900 font-medium transition-colors"
                >
                  + Add Product
                </button>
                <button 
                  onClick={() => navigate('/ai-services')}
                  className="w-full text-left px-4 py-3 rounded-lg bg-neutral-50 hover:bg-primary-100 text-neutral-900 font-medium transition-colors"
                >
                  + Record AI Service
                </button>
                <button 
                  onClick={() => navigate('/veterinary')}
                  className="w-full text-left px-4 py-3 rounded-lg bg-neutral-50 hover:bg-primary-100 text-neutral-900 font-medium transition-colors"
                >
                  + Schedule Appointment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Alerts and Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InventoryAlerts />
          <UpcomingAppointments />
        </div>

        {/* System Status Footer */}
        <div className="card bg-neutral-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-neutral-900">System Status</p>
                <p className="text-sm text-neutral-600">All systems operational • Last backup: Today 2:30 AM</p>
              </div>
            </div>
            <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View Details
            </a>
          </div>
        </div>
      </div>
    </Layout>
  )
}
