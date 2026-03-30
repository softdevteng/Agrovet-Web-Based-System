import React from 'react'
import Layout from '@/components/layout/Layout'
import StatCard from '@/components/common/StatCard'
import Alert from '@/components/common/Alert'
import SalesChart from '@/components/dashboard/SalesChart'
import InventoryBreakdown from '@/components/dashboard/InventoryBreakdown'
import InventoryAlerts from '@/components/dashboard/InventoryAlerts'
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments'
import { ShoppingCart, Package, Users, Zap, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const [alerts, setAlerts] = React.useState([
    { id: 1, type: 'warning' as const, title: 'Low Stock Alert', message: '8 products below reorder level' },
    { id: 2, type: 'info' as const, title: 'AI Service Reminder', message: 'Pregnancy follow-up due for 3 cows' },
  ])

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
            value="KES 145,320"
            subtitle="12 transactions"
            icon={<ShoppingCart size={24} />}
            trend="up"
            trendValue="+12.5% from yesterday"
            color="green"
          />
          <StatCard
            title="Inventory Value"
            value="KES 2.4M"
            subtitle="1,247 items"
            icon={<Package size={24} />}
            trend="down"
            trendValue="-3.2% this month"
            color="blue"
          />
          <StatCard
            title="Active Farmers"
            value="284"
            subtitle="32 new this month"
            icon={<Users size={24} />}
            trend="up"
            trendValue="+8 this week"
            color="yellow"
          />
          <StatCard
            title="AI Services"
            value="18"
            subtitle="Completed this month"
            icon={<Zap size={24} />}
            trend="up"
            trendValue="+4 pending follow-ups"
            color="blue"
          />
        </div>

        {/* Charts and Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            <SalesChart />
            <InventoryBreakdown />
          </div>

          {/* Right Column - Quick Overview */}
          <div className="space-y-6">
            {/* KPI Summary */}
            <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">This Month</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-primary-700">Total Revenue</p>
                  <p className="text-2xl font-bold text-primary-900">KES 3.2M</p>
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
                <button className="w-full text-left px-4 py-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-900 font-medium transition-colors">
                  + New Sale
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-900 font-medium transition-colors">
                  + Add Product
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-900 font-medium transition-colors">
                  + Record AI Service
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-900 font-medium transition-colors">
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
