import { Request, Response } from 'express'
import { authService } from '../services/authService.js'
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
      res.status(201).json({
        success: true,
        message: 'Account created successfully. Verification code sent.',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.full_name,
          role: user.role,
        },
      })
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
}
