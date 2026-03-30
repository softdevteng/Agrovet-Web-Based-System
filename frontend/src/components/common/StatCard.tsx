import React from 'react'
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down'
  trendValue?: string
  color?: 'green' | 'blue' | 'yellow' | 'red'
}

const colorClasses = {
  green: 'bg-green-50 border-green-200',
  blue: 'bg-blue-50 border-blue-200',
  yellow: 'bg-yellow-50 border-yellow-200',
  red: 'bg-red-50 border-red-200',
}

const iconColorClasses = {
  green: 'text-green-600',
  blue: 'text-blue-600',
  yellow: 'text-yellow-600',
  red: 'text-red-600',
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = 'blue',
}: StatCardProps) {
  return (
    <div className={`card border ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-neutral-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-neutral-900 mt-2">{value}</p>
          {subtitle && <p className="text-xs text-neutral-500 mt-2">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg bg-white flex items-center justify-center ${iconColorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2">
          {trend === 'up' ? (
            <ArrowUpRight size={16} className="text-green-600" />
          ) : (
            <ArrowDownRight size={16} className="text-red-600" />
          )}
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  )
}
