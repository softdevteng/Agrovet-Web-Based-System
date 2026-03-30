import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Home, Package, ShoppingCart, Leaf, Stethoscope, LogOut, BarChart3, History } from 'lucide-react'

export default function Sidebar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = React.useState(true)

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/inventory', icon: Package, label: 'Inventory' },
    { path: '/pos', icon: ShoppingCart, label: 'POS' },
    { path: '/sales-history', icon: History, label: 'Sales History' },
    { path: '/ai-services', icon: Leaf, label: 'AI Services' },
    { path: '/veterinary', icon: Stethoscope, label: 'Veterinary' },
    { path: '/reports', icon: BarChart3, label: 'Reports' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:hidden fixed top-4 left-4 z-50 p-2 bg-primary-500 text-white rounded-lg"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-primary-500 text-white transition-all duration-300 md:translate-x-0 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-primary-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center font-bold text-primary-500">
              🌾
            </div>
            <div>
              <h1 className="font-bold text-lg">SK AGROVET</h1>
              <p className="text-primary-200 text-xs">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-secondary-500 text-primary-900 font-semibold'
                      : 'text-primary-100 hover:bg-primary-600'
                  }`}
                  onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
