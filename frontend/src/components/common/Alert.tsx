import React from 'react'
import { AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react'

interface AlertProps {
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  onClose?: () => void
}

const alertConfig = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-600',
    titleColor: 'text-green-900',
    messageColor: 'text-green-800',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-900',
    messageColor: 'text-yellow-800',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertCircle,
    iconColor: 'text-red-600',
    titleColor: 'text-red-900',
    messageColor: 'text-red-800',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Info,
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900',
    messageColor: 'text-blue-800',
  },
}

export default function Alert({ type, title, message, onClose }: AlertProps) {
  const config = alertConfig[type]
  const Icon = config.icon

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-4 flex gap-4`}>
      <Icon className={`${config.iconColor} flex-shrink-0`} size={20} />
      <div className="flex-1">
        <h3 className={`${config.titleColor} font-semibold text-sm`}>{title}</h3>
        <p className={`${config.messageColor} text-sm mt-1`}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-neutral-600 flex-shrink-0"
        >
          ✕
        </button>
      )}
    </div>
  )
}
