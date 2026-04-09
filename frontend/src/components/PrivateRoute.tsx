import React from 'react'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const token = localStorage.getItem('token')
  const userString = localStorage.getItem('user')
  
  if (!token || !userString) {
    return <Navigate to="/login" replace />
  }

  try {
    const user = JSON.parse(userString)
    
    // Check if user has required role
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />
    }

    return <>{children}</>
  } catch (error) {
    return <Navigate to="/login" replace />
  }
}

export function VetRoute({ children }: { children: React.ReactNode }) {
  return <PrivateRoute allowedRoles={['vet', 'admin']}>{children}</PrivateRoute>
}

export function AttendantRoute({ children }: { children: React.ReactNode }) {
  return <PrivateRoute allowedRoles={['attendant', 'admin']}>{children}</PrivateRoute>
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return <PrivateRoute allowedRoles={['admin']}>{children}</PrivateRoute>
}

export function AnyAuthRoute({ children }: { children: React.ReactNode }) {
  return <PrivateRoute>{children}</PrivateRoute>
}
