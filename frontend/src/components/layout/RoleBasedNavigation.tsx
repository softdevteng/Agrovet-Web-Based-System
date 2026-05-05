import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  LogOut, Menu, X, Settings, HelpCircle, Bell, Search, 
  ChevronDown, Home, Package, ShoppingCart, TrendingUp, 
  Heart, FileText, Wallet, Clock, Shield, LogIn
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  role?: string[]
  icon?: React.ReactNode
}

interface UserStats {
  notifications: number
  pendingTasks: number
}

export default function RoleBasedNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userStats] = useState<UserStats>({ notifications: 3, pendingTasks: 2 })
  const searchRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  
  const userString = localStorage.getItem('user')
  const user = userString ? JSON.parse(userString) : null
  const userRole = user?.role || ''

  // Enhanced nav items with icons
  const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { href: '/inventory', label: 'Inventory', role: ['attendant', 'admin'], icon: <Package className="w-4 h-4" /> },
    { href: '/pos', label: 'POS', role: ['attendant', 'admin'], icon: <ShoppingCart className="w-4 h-4" /> },
    { href: '/sales-history', label: 'Sales', role: ['attendant', 'admin'], icon: <TrendingUp className="w-4 h-4" /> },
    { href: '/ai-services', label: 'Semen/AI', role: ['vet', 'admin'], icon: <Heart className="w-4 h-4" /> },
    { href: '/veterinary', label: 'Veterinary', role: ['vet', 'admin'], icon: <Shield className="w-4 h-4" /> },
    { href: '/reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
  ]

  // Additional menu items
  const additionalMenuItems: NavItem[] = [
    { href: '/credit', label: 'Credit Management', role: ['admin'], icon: <Wallet className="w-4 h-4" /> },
    { href: '/activity', label: 'Activity Log', role: ['admin'], icon: <Clock className="w-4 h-4" /> },
  ]

  const filteredNavItems = navItems.filter(item => 
    !item.role || item.role.includes(userRole)
  )

  const filteredAdditionalItems = additionalMenuItems.filter(item =>
    !item.role || item.role.includes(userRole)
  )

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsUserDropdownOpen(false)
    setIsMobileMenuOpen(false)
    navigate('/login')
  }

  const isActive = (href: string) => location.pathname === href

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleNavigation = (href: string) => {
    navigate(href)
    setIsMobileMenuOpen(false)
    setIsUserDropdownOpen(false)
  }

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-gradient-to-r from-green-50 to-green-50 shadow-lg border-b-2 border-green-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
              onClick={() => handleNavigation('/dashboard')}
            >
              <div className="relative">
                <span className="text-3xl">🌾</span>
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  SK AGROVET
                </span>
                <p className="text-xs text-gray-600 font-medium">Management System</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {filteredNavItems.map(item => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive(item.href)
                      ? 'bg-green-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-green-100'
                  }`}
                  title={item.label}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Right Section - Search, Notifications, User */}
            <div className="hidden md:flex items-center gap-4">
              {/* Search Box */}
              <div ref={searchRef} className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-gray-600 hover:bg-green-100 rounded-lg transition"
                  title="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
                {isSearchOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-3 animate-in fade-in-50">
                    <input
                      type="text"
                      placeholder="Search modules, features..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* Notifications */}
              <button
                className="relative p-2 text-gray-600 hover:bg-green-100 rounded-lg transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {userStats.notifications > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {userStats.notifications}
                  </span>
                )}
              </button>

              {/* User Dropdown */}
              <div ref={userDropdownRef} className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-100 transition"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold text-gray-800">{user?.fullName || 'User'}</p>
                    <p className="text-xs text-gray-600 capitalize">{userRole || 'Guest'}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-in fade-in-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="font-semibold text-gray-800">{user?.fullName}</p>
                      <p className="text-sm text-gray-600 capitalize">{userRole}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    {filteredAdditionalItems.map(item => (
                      <button
                        key={item.href}
                        onClick={() => handleNavigation(item.href)}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 transition flex items-center gap-2"
                      >
                        {item.icon}
                        <span className="text-sm">{item.label}</span>
                      </button>
                    ))}

                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <button
                        onClick={() => handleNavigation('/settings')}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 transition flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </button>
                      <button
                        onClick={() => handleNavigation('/help')}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 transition flex items-center gap-2"
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span className="text-sm">Help & Documentation</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:bg-green-100 rounded-lg transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden pb-4 space-y-2 border-t border-green-200 pt-4 animate-in slide-in-from-top-2">
              <div className="px-4 py-3 bg-white rounded-lg mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{user?.fullName}</p>
                    <p className="text-xs text-gray-600 capitalize">{userRole}</p>
                  </div>
                </div>
              </div>

              {/* Mobile Nav Items */}
              {filteredNavItems.map(item => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-2 ${
                    isActive(item.href)
                      ? 'bg-green-500 text-white font-medium'
                      : 'text-gray-700 hover:bg-green-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}

              {/* Mobile Additional Items */}
              {filteredAdditionalItems.length > 0 && (
                <div className="border-t border-gray-200 pt-2 mt-2">
                  {filteredAdditionalItems.map(item => (
                    <button
                      key={item.href}
                      onClick={() => handleNavigation(item.href)}
                      className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 transition flex items-center gap-2"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Mobile Quick Actions */}
              <div className="border-t border-gray-200 pt-2 mt-2 space-y-2">
                <button
                  onClick={() => handleNavigation('/settings')}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 transition flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={() => handleNavigation('/help')}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 transition flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  Help
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Breadcrumb Navigation */}
      <div className="hidden md:block bg-gray-50 border-b border-gray-200 py-2 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => handleNavigation('/dashboard')}
              className="text-gray-600 hover:text-green-600 transition"
            >
              Home
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">
              {filteredNavItems.find(item => isActive(item.href))?.label || 'Page'}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
