import { Request, Response, NextFunction } from 'express'
import { logger } from './logger.js'

export interface AuthRequest extends Request {
  user?: {
    userId: string
    email: string
    role: string
  }
}

export const authenticate = (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    // Token verification happens in utils - this is a placeholder
    // In production, verify with JWT and attach user to request
    const mockUser = {
      userId: 'test-user-id',
      email: 'test@example.com',
      role: 'admin',
    }

    req.user = mockUser
    next()
  } catch (error) {
    logger.error('Authentication error:', error)
    res.status(401).json({ message: 'Invalid token' })
  }
}

export const authorize = (allowedRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by ${req.user.email}`)
      return res.status(403).json({ message: 'Forbidden' })
    }

    next()
  }
}
