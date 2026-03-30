import React from 'react'
import { ChevronRight } from 'lucide-react'

interface BadgeProps {
  label: string
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default'
  size?: 'sm' | 'md'
}

const variantClasses = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  default: 'bg-neutral-100 text-neutral-800',
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
}

export function Badge({ label, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {label}
    </span>
  )
}

export interface ListItemProps {
  title: string
  subtitle?: string
  value?: string | React.ReactNode
  icon?: React.ReactNode
  badge?: string
  badgeVariant?: 'success' | 'warning' | 'error' | 'info'
  onClick?: () => void
  clickable?: boolean
}

export function ListItem({
  title,
  subtitle,
  value,
  icon,
  badge,
  badgeVariant,
  onClick,
  clickable = true,
}: ListItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors ${
        clickable ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      <div className="flex items-center gap-4 flex-1 text-left">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div className="flex-1">
          <p className="font-medium text-neutral-900">{title}</p>
          {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 ml-4">
        {badge && <Badge label={badge} variant={badgeVariant} />}
        {value && <p className="font-semibold text-neutral-900 min-w-max">{value}</p>}
        {clickable && <ChevronRight size={20} className="text-neutral-400" />}
      </div>
    </button>
  )
}
