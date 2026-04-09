import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'

export default function Unauthorized() {
  const navigate = useNavigate()
  const userString = localStorage.getItem('user')
  let userRole = 'unknown'
  
  if (userString) {
    try {
      const user = JSON.parse(userString)
      userRole = user.role
    } catch (e) {
      // Ignore
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-6">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-red-100 mb-8">
            You don't have permission to access this page. Your role is: <span className="font-bold capitalize">{userRole}</span>
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition duration-200"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                navigate('/login')
              }}
              className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
