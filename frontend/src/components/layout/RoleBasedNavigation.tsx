import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  role?: string[]
}

export default function RoleBasedNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const userString = localStorage.getItem('user')
  const user = userString ? JSON.parse(userString) : null
  const userRole = user?.role || ''

  const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/inventory', label: 'Inventory', role: ['attendant', 'admin'] },
    { href: '/pos', label: 'POS', role: ['attendant', 'admin'] },
    { href: '/sales-history', label: 'Sales', role: ['attendant', 'admin'] },
    { href: '/ai-services', label: 'Semen/AI', role: ['vet', 'admin'] },
    { href: '/veterinary', label: 'Veterinary', role: ['vet', 'admin'] },
    { href: '/reports', label: 'Reports' },
  ]

  const filteredNavItems = navItems.filter(item => 
    !item.role || item.role.includes(userRole)
  )

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const isActive = (href: string) => location.pathname === href

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <span className="font-bold text-primary-600">SK AGROVET</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {filteredNavItems.map(item => (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={`px-4 py-2 rounded-lg transition ${
                  isActive(item.href)
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* User Info and Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary-600">
                  {user?.fullName?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-semibold">{user?.fullName}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {filteredNavItems.map(item => (
              <button
                key={item.href}
                onClick={() => {
                  navigate(item.href)
                  setIsMobileMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  isActive(item.href)
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
