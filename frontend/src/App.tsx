import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { VetRoute, AttendantRoute, AnyAuthRoute } from './components/PrivateRoute'

// Pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Inventory = React.lazy(() => import('./pages/Inventory'))
const POS = React.lazy(() => import('./pages/POS'))
const Invoices = React.lazy(() => import('./pages/Invoices'))
const SalesHistory = React.lazy(() => import('./pages/SalesHistory'))
const AIServices = React.lazy(() => import('./pages/AIServices'))
const Veterinary = React.lazy(() => import('./pages/Veterinary'))
const Reports = React.lazy(() => import('./pages/Reports'))
const Login = React.lazy(() => import('./pages/Login'))
const Register = React.lazy(() => import('./pages/Register'))
const VerifyAccount = React.lazy(() => import('./pages/VerifyAccount'))
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'))
const Unauthorized = React.lazy(() => import('./pages/Unauthorized'))

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
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-account" element={<VerifyAccount />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Error Routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected Routes - Any authenticated user */}
            <Route 
              path="/dashboard" 
              element={
                <AnyAuthRoute>
                  <Dashboard />
                </AnyAuthRoute>
              } 
            />
            
            {/* Attendant Routes - Shop/POS related */}
            <Route 
              path="/inventory" 
              element={
                <AttendantRoute>
                  <Inventory />
                </AttendantRoute>
              } 
            />
            <Route 
              path="/pos" 
              element={
                <AttendantRoute>
                  <POS />
                </AttendantRoute>
              } 
            />
            <Route 
              path="/invoices" 
              element={
                <AttendantRoute>
                  <Invoices />
                </AttendantRoute>
              } 
            />
            <Route 
              path="/sales-history" 
              element={
                <AttendantRoute>
                  <SalesHistory />
                </AttendantRoute>
              } 
            />
            
            {/* Vet Routes - Veterinary/AI Services */}
            <Route 
              path="/ai-services" 
              element={
                <VetRoute>
                  <AIServices />
                </VetRoute>
              } 
            />
            <Route 
              path="/veterinary" 
              element={
                <VetRoute>
                  <Veterinary />
                </VetRoute>
              } 
            />
            
            {/* Reports - Any authenticated user can view */}
            <Route 
              path="/reports" 
              element={
                <AnyAuthRoute>
                  <Reports />
                </AnyAuthRoute>
              } 
            />
            
            {/* Default route */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </React.Suspense>
      </Router>
    </Provider>
  )
}
