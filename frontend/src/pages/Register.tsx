import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin } from 'lucide-react'
import apiClient from '../utils/apiClient'

const API_BASE_URL = 'http://localhost:8000/api'

export default function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: '',
    role: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!formData.email || !formData.password || !formData.name || !formData.role) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      // Call backend register endpoint
      const response = await apiClient.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        password: formData.password,
        role: formData.role
      })

      if (response.data.success || response.status === 201 || response.status === 200) {
        // Registration successful, redirect to verification page
        navigate('/verify-account', { 
          state: { 
            email: formData.email,
            phone: formData.phone,
            method: formData.phone ? 'phone' : 'email'
          } 
        })
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Registration failed. Please try again.'
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
          <p className="text-primary-100">Create Your Account</p>
        </div>

        {/* Register Form Card */}
        <form
          onSubmit={handleRegister}
          className="bg-white rounded-2xl shadow-2xl p-8 space-y-5"
        >
          {/* Error Alert */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-neutral-400" size={20} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-neutral-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 text-neutral-400" size={20} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+254 7XX XXX XXX"
                className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Location Field */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 text-neutral-400" size={20} />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, County"
                className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Account Type <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select account type</option>
              <option value="attendant">Shop Attendant</option>
              <option value="vet">Veterinarian</option>
            </select>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-neutral-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
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

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-neutral-400" size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3.5 text-neutral-400 hover:text-neutral-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer with Login Link */}
        <p className="text-center text-primary-100 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold hover:text-white transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
