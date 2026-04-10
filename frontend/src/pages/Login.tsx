import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import apiClient from '../utils/apiClient'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Pre-fill email if coming from register
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email)    }
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
    }
  }, [location])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    setLoading(true)

    if (!email || !password) {
      setError('Please enter email and password')
      setLoading(false)
      return
    }

    try {
      // Call backend login endpoint
      const response = await apiClient.post('/auth/login', {
        email,
        password
      })

      // Store token and user info
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        // Redirect based on role
        const userRole = response.data.user.role
        if (userRole === 'vet') {
          navigate('/ai-services')
        } else if (userRole === 'attendant') {
          navigate('/inventory')
        } else {
          navigate('/dashboard')
        }
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Login failed. Please check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary-500 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-4xl">🌾</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">SK AGROVET</h1>
          <p className="text-primary-100">Agricultural Management System</p>
        </div>

        {/* Login Form Card */}
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-2xl p-8 space-y-6"
        >
          {/* Success Alert */}
          {successMessage && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-neutral-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-neutral-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-neutral-600">
              <input type="checkbox" className="w-4 h-4 rounded accent-primary-500" />
              Remember me
            </label>
            <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">Don't have an account?</span>
            </div>
          </div>

          {/* Register Button */}
          <Link
            to="/register"
            className="w-full px-4 py-3 border-2 border-primary-500 text-primary-600 rounded-lg text-sm font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center"
          >
            Create Account
          </Link>
        </form>

        {/* Footer */}
        <p className="text-center text-primary-100 text-sm mt-6">
          Version 1.0.0 • SK AGROVET System
        </p>
      </div>
    </div>
  )
}
