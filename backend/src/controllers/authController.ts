import { Request, Response } from 'express'
import { authService } from '../services/authService.js'
import { emailService } from '../utils/emailService.js'
import { query } from '../config/database.js'
import { logger } from '../middleware/logger.js'

export const authController = {
  async login(req: any, res: Response) {
    try {
      const { email, password } = req.body

      const user = await authService.getUserByEmail(email)
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      const isValid = await authService.comparePassword(password, user.password_hash)
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      const token = authService.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      logger.info(`User ${email} logged in`)
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.full_name,
          role: user.role,
        },
      })
    } catch (error) {
      logger.error('Login error:', error)
      res.status(500).json({ message: 'Login failed' })
    }
  },

  async register(req: any, res: Response) {
    try {
      const { email, name, phone, location, password, role } = req.body

      // Validate required fields
      if (!email || !password || !name) {
        return res.status(400).json({ message: 'Email, password, and name are required' })
      }

      const existingUser = await authService.getUserByEmail(email)
      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' })
      }

      const passwordHash = await authService.hashPassword(password)
      
      // Generate username from email if not provided
      const username = email.split('@')[0]
      
      const user = await authService.createUser({
        email,
        username,
        fullName: name,
        passwordHash,
        role: role || 'user',
      })

      // Generate and store verification code
      const code = authService.generateVerificationCode()
      await authService.storeVerificationCode(email, code)
      
      // Send verification code via email or SMS
      const method = phone ? 'phone' : 'email'
      await authService.sendVerificationCode(email, code, method)

      logger.info(`New user registered: ${email}, verification code sent`)
      const responsePayload: any = {
        success: true,
        message: 'Account created successfully. Verification code sent.',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.full_name,
          role: user.role,
        },
      }

      // For development/demo: include verification code in response when email is not configured
      if (process.env.NODE_ENV !== 'production') {
        try {
          const codeRes = await query('SELECT code FROM verification_codes WHERE email = $1 ORDER BY expires_at DESC LIMIT 1', [email])
          if (codeRes.rows[0]) responsePayload.devVerificationCode = codeRes.rows[0].code
        } catch (e) {
          // ignore
        }
      }

      res.status(201).json(responsePayload)
    } catch (error) {
      logger.error('Registration error:', error)
      res.status(500).json({ message: 'Registration failed' })
    }
  },

  async verifyCode(req: any, res: Response) {
    try {
      const { email, code } = req.body

      if (!email || !code) {
        return res.status(400).json({ message: 'Email and code are required' })
      }

      const isValid = await authService.verifyCode(email, code)
      
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid or expired verification code' })
      }

      logger.info(`User ${email} verified successfully`)
      res.json({
        success: true,
        message: 'Account verified successfully'
      })
    } catch (error) {
      logger.error('Verification error:', error)
      res.status(500).json({ message: 'Verification failed' })
    }
  },

  async resendCode(req: any, res: Response) {
    try {
      const { email, method } = req.body

      if (!email) {
        return res.status(400).json({ message: 'Email is required' })
      }

      const user = await authService.getUserByEmail(email)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Generate and store new verification code
      const code = authService.generateVerificationCode()
      await authService.storeVerificationCode(email, code)
      
      // Send verification code
      await authService.sendVerificationCode(email, code, method || 'email')

      logger.info(`Verification code resent to ${email}`)
      res.json({
        success: true,
        message: 'Verification code sent successfully'
      })
    } catch (error) {
      logger.error('Resend code error:', error)
      res.status(500).json({ message: 'Failed to resend code' })
    }
  },

  async getProfile(req: any, res: Response) {
    try {
      const { userId } = req.user
      const user = await authService.getUserById(userId)

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      res.json(user)
    } catch (error) {
      logger.error('Get profile error:', error)
      res.status(500).json({ message: 'Failed to get profile' })
    }
  },

  async updateProfile(req: any, res: Response) {
    try {
      const { userId } = req.user
      const user = await authService.updateUser(userId, req.body)

      logger.info(`User ${userId} updated profile`)
      res.json({
        message: 'Profile updated successfully',
        user,
      })
    } catch (error) {
      logger.error('Update profile error:', error)
      res.status(500).json({ message: 'Failed to update profile' })
    }
  },

  async getAllUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20

      const result = await authService.getAllUsers(page, limit)
      res.json(result)
    } catch (error) {
      logger.error('Get users error:', error)
      res.status(500).json({ message: 'Failed to get users' })
    }
  },

  // Test endpoint - GET verification code for development/testing
  async getTestVerificationCode(req: Request, res: Response) {
    try {
      // Only available in development mode
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ message: 'This endpoint is not available in production' })
      }

      const { email } = req.query
      if (!email) {
        return res.status(400).json({ message: 'Email query parameter is required' })
      }

      const code = (emailService as any).getVerificationCodeForTesting(email as string)
      if (!code) {
        return res.status(404).json({ message: 'No verification code found for this email' })
      }

      res.json({
        success: true,
        email,
        code,
        message: '⚠️ THIS IS A TEST ENDPOINT - Only use in development!',
      })
    } catch (error) {
      logger.error('Get test code error:', error)
      res.status(500).json({ message: 'Failed to retrieve test code' })
    }
  },

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body

      if (!email) {
        return res.status(400).json({ message: 'Email is required' })
      }

      const success = await authService.requestPasswordReset(email)

      if (!success) {
        // Don't reveal if email exists
        return res.json({
          success: true,
          message: 'If an account exists with this email, a password reset code has been sent',
        })
      }

      logger.info(`Password reset requested for ${email}`)
      res.json({
        success: true,
        message: 'Password reset code sent to your email',
      })
    } catch (error) {
      logger.error('Forgot password error:', error)
      res.status(500).json({ message: 'Failed to process password reset request' })
    }
  },

  async resetPassword(req: Request, res: Response) {
    try {
      const { email, code, newPassword } = req.body

      if (!email || !code || !newPassword) {
        return res.status(400).json({ message: 'Email, code, and new password are required' })
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' })
      }

      const success = await authService.resetPassword(email, code, newPassword)

      if (!success) {
        return res.status(400).json({ message: 'Invalid or expired reset code' })
      }

      logger.info(`Password reset successful for ${email}`)
      res.json({
        success: true,
        message: 'Password reset successfully. You can now login with your new password.',
      })
    } catch (error) {
      logger.error('Reset password error:', error)
      res.status(500).json({ message: 'Failed to reset password' })
    }
  },
}
