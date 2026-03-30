import React, { useEffect, useState } from 'react'
import { Bell, User, Search } from 'lucide-react'

interface UserInfo {
  fullName: string
  role: string
}

export default function Header() {
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('user')
    if (raw) {
      try {
        setUser(JSON.parse(raw))
      } catch {
        // ignore parse errors
      }
    }
  }, [])

  const initials = user
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'JD'

  const displayRole = user
    ? user.role === 'attendant'
      ? 'Shop Attendant'
      : user.role === 'vet'
      ? 'Veterinarian'
      : user.role
    : ''

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-neutral-200 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left: Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-neutral-400" size={20} />
            <input
              type="text"
              placeholder="Search products, farmers..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Right: User Actions */}
        <div className="flex items-center gap-4 ml-6">
          {/* Notifications */}
          <button className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <button className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-100 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {initials}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-neutral-900">{user?.fullName || 'John Doe'}</p>
              <p className="text-xs text-neutral-500">{displayRole || 'User'}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
