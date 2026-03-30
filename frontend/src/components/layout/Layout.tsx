import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface LayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
  showHeader?: boolean
}

export default function Layout({
  children,
  showSidebar = true,
  showHeader = true,
}: LayoutProps) {
  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      {showSidebar && <Sidebar />}

      {/* Main Content */}
      <div className={`flex flex-col flex-1 ${showSidebar ? 'md:ml-64' : ''}`}>
        {/* Header */}
        {showHeader && <Header />}

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
