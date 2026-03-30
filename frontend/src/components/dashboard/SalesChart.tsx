import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Mon', sales: 4000, revenue: 12000 },
  { name: 'Tue', sales: 3000, revenue: 9000 },
  { name: 'Wed', sales: 5200, revenue: 15600 },
  { name: 'Thu', sales: 4780, revenue: 14340 },
  { name: 'Fri', sales: 5890, revenue: 17670 },
  { name: 'Sat', sales: 6390, revenue: 19170 },
  { name: 'Sun', sales: 3590, revenue: 10770 },
]

export default function SalesChart() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-neutral-900 mb-6">Weekly Sales Overview</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="sales" fill="#2D5A27" name="Units Sold" />
          <Bar dataKey="revenue" fill="#D4AF37" name="Revenue (KES)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
