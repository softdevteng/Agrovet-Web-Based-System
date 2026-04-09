import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, MessageSquare, CheckCircle } from 'lucide-react'
import apiClient from '../utils/apiClient'

const API_BASE_URL = 'http://localhost:8000/api'

export default function VerifyAccount() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [method, setMethod] = useState('email')
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (!location.state?.email) {
      navigate('/register')
      return
    }
    
    setEmail(location.state.email)
    setPhone(location.state.phone || '')
    setMethod(location.state.method || 'email')
  }, [location, navigate])

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!verificationCode || verificationCode.length < 4) {
      setError('Please enter a valid verification code')
      setLoading(false)
      return
    }

    try {
      const response = await apiClient.post('/auth/verify-code', {
        email,
        code: verificationCode
      })

      if (response.data.success || response.status === 200) {
        setVerified(true)
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login', {
            state: {
              message: 'Account verified successfully! Please log in.',
              email: email
            }
          })
        }, 2000)
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Verification failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setError('')
    setResending(true)

    try {
      const response = await apiClient.post('/auth/resend-code', {
        email,
        method
      })

      if (response.data.success || response.status === 200) {
        setCountdown(60) // 60 second countdown
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Failed to resend code. Please try again.'
      )
    } finally {
      setResending(false)
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
            {verified ? (
              <CheckCircle className="text-green-500" size={40} />
            ) : (
              <span className="text-4xl">✉️</span>
            )}
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">SK AGROVET</h1>
          <p className="text-primary-100">
            {verified ? 'Account Verified!' : 'Verify Your Account'}
          </p>
        </div>

        {/* Verification Card */}
        {!verified ? (
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <p className="text-sm text-primary-900">
                {method === 'phone' && phone ? (
                  <>
                    We've sent a verification code to your phone <strong>{phone}</strong>
                  </>
                ) : (
                  <>
                    We've sent a verification code to <strong>{email}</strong>
                  </>
                )}
              </p>
              {phone && (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod(method === 'email' ? 'phone' : 'email')}
                    className="flex-1 text-sm py-2 px-3 rounded border border-primary-300 text-primary-700 hover:bg-primary-100 transition-colors"
                  >
                    {method === 'email' ? 'Use Phone Instead' : 'Use Email Instead'}
                  </button>
                </div>
              )}
            </div>

            {/* Verification Code Form */}
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-center text-2xl tracking-widest font-mono"
                  required
                />
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || verificationCode.length < 4}
                className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify Account'
                )}
              </button>
            </form>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-sm text-neutral-600 mb-3">Didn't receive the code?</p>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resending || countdown > 0}
                className="text-sm text-primary-600 hover:text-primary-700 font-semibold disabled:text-neutral-400 disabled:cursor-not-allowed"
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center space-y-6">
            <div className="text-green-600">
              <p className="text-lg font-semibold mb-2">✓ Account Verified Successfully!</p>
              <p className="text-sm text-neutral-600">
                Redirecting to login page...
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-primary-100 text-sm mt-6">
          Version 1.0.0 • SK AGROVET System
        </p>
      </div>
    </div>
  )
}
