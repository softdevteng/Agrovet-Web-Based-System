import React from 'react'
import { Calendar, MapPin, Zap } from 'lucide-react'
import { ListItem } from '../common/Badge'

export default function UpcomingAppointments() {
  const appointments = [
    {
      title: 'Friesian Cow - Heat Detection',
      subtitle: 'Farmer: James Kipchoge',
      badge: 'Today',
      badgeVariant: 'info' as const,
      icon: <Zap className="text-blue-600" size={20} />,
      value: '2:00 PM',
    },
    {
      title: 'AI Service - Ayrshire Cow',
      subtitle: 'Farmer: Mary Kamau',
      badge: 'Tomorrow',
      badgeVariant: 'info' as const,
      icon: <Calendar className="text-blue-600" size={20} />,
      value: '10:00 AM',
    },
    {
      title: 'Pregnancy Check - Jersey Cow',
      subtitle: 'Farmer: Peter Mwangi',
      badge: 'In 2 Days',
      badgeVariant: 'default' as const,
      icon: <MapPin className="text-neutral-600" size={20} />,
      value: '9:00 AM',
    },
  ]

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">Upcoming Appointments</h3>
        <a href="#" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
          Schedule
        </a>
      </div>

      <div className="divide-y divide-neutral-100">
        {appointments.map((apt, i) => (
          <ListItem
            key={i}
            title={apt.title}
            subtitle={apt.subtitle}
            badge={apt.badge}
            badgeVariant={apt.badgeVariant}
            icon={apt.icon}
            value={apt.value}
            clickable={false}
          />
        ))}
      </div>
    </div>
  )
}
