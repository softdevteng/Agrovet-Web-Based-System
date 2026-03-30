import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'

// Pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Inventory = React.lazy(() => import('./pages/Inventory'))
const POS = React.lazy(() => import('./pages/POS'))
const SalesHistory = React.lazy(() => import('./pages/SalesHistory'))
const AIServices = React.lazy(() => import('./pages/AIServices'))
const Veterinary = React.lazy(() => import('./pages/Veterinary'))
const Reports = React.lazy(() => import('./pages/Reports'))
const Login = React.lazy(() => import('./pages/Login'))
const Register = React.lazy(() => import('./pages/Register'))
const VerifyAccount = React.lazy(() => import('./pages/VerifyAccount'))

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <React.Suspense
          fallback={
            <div className="flex items-center justify-center h-screen bg-neutral-50">
              <div className="text-center">
                <div className="inline-block">
                  <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
                </div>
                <p className="text-neutral-600">Loading SK AGROVET...</p>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-account" element={<VerifyAccount />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/sales-history" element={<SalesHistory />} />
            <Route path="/ai-services" element={<AIServices />} />
            <Route path="/veterinary" element={<Veterinary />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </React.Suspense>
      </Router>
    </Provider>
  )
}
