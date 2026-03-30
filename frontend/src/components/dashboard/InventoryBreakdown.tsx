import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = ['#2D5A27', '#D4AF37', '#8B6914', '#0066CC', '#52B788']

const data = [
  { name: 'Seeds', value: 2500 },
  { name: 'Fertilizers', value: 3200 },
  { name: 'Animal Feeds', value: 2800 },
  { name: 'Medicines', value: 1900 },
  { name: 'Pesticides', value: 1500 },
]

export default function InventoryBreakdown() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-neutral-900 mb-6">Inventory by Category</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
