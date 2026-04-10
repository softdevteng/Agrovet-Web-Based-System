import { Router } from 'express'
import { authController } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// Public routes
router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/verify-code', authController.verifyCode)
router.post('/resend-code', authController.resendCode)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)

// Test endpoint - Development only
router.get('/test/verification-code', authController.getTestVerificationCode)

// Protected routes
router.get('/profile', authenticate, authController.getProfile)
router.put('/profile', authenticate, authController.updateProfile)
router.get('/users', authenticate, authController.getAllUsers)

export default router
