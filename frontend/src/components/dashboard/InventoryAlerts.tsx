import React from 'react'
import { TrendingDown, Package, AlertTriangle, Clock } from 'lucide-react'
import { ListItem, Badge } from '../common/Badge'

export default function InventoryAlerts() {
  const alerts = [
    {
      title: 'Friesian Bull Semen - Expired',
      subtitle: 'Bull ID: FB-2024-001',
      badge: 'Critical',
      badgeVariant: 'error' as const,
      icon: <Package className="text-red-600" size={20} />,
      value: '5 straws',
    },
    {
      title: 'Compound Fertilizer 25KG',
      subtitle: 'Batch: FERT-2026-02-001',
      badge: 'Low Stock',
      badgeVariant: 'warning' as const,
      icon: <TrendingDown className="text-yellow-600" size={20} />,
      value: '8 bags',
    },
    {
      title: 'Ayrshire Semen - Expiring Soon',
      subtitle: 'Expiry: March 15, 2026',
      badge: 'Warning',
      badgeVariant: 'warning' as const,
      icon: <Clock className="text-yellow-600" size={20} />,
      value: '12 straws',
    },
    {
      title: 'Dewormer Paste 500ml',
      subtitle: 'Product ID: DW-500-001',
      badge: 'Low Stock',
      badgeVariant: 'warning' as const,
      icon: <AlertTriangle className="text-yellow-600" size={20} />,
      value: '3 bottles',
    },
  ]

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">Inventory Alerts</h3>
        <a href="#" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
          View All
        </a>
      </div>

      <div className="divide-y divide-neutral-100">
        {alerts.map((alert, i) => (
          <ListItem
            key={i}
            title={alert.title}
            subtitle={alert.subtitle}
            badge={alert.badge}
            badgeVariant={alert.badgeVariant}
            icon={alert.icon}
            value={alert.value}
            clickable={true}
          />
        ))}
      </div>
    </div>
  )
}
