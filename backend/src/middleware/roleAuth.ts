import { Request, Response, NextFunction } from 'express'
import { logger } from './logger.js'

export interface AuthRequest extends Request {
  user?: {
    userId: string
    email: string
    role: string
  }
}

/**
 * Middleware to check if user has required role(s)
 * @param allowedRoles - Array of roles that are allowed to access the route
 */
export const authorizeRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role

      if (!userRole) {
        logger.warn('Missing user role in request')
        return res.status(401).json({ message: 'User role not found' })
      }

      if (!allowedRoles.includes(userRole)) {
        logger.warn(`Unauthorized access attempt by user with role: ${userRole}`)
        return res.status(403).json({ 
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}` 
        })
      }

      next()
    } catch (error) {
      logger.error('Role authorization error:', error)
      res.status(500).json({ message: 'Authorization check failed' })
    }
  }
}

/**
 * Middleware to block specific roles from accessing routes
 * @param blockedRoles - Array of roles that cannot access the route
 */
export const blockRole = (...blockedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role

      if (!userRole) {
        logger.warn('Missing user role in request')
        return res.status(401).json({ message: 'User role not found' })
      }

      if (blockedRoles.includes(userRole)) {
        logger.warn(`Blocked access attempt by user with role: ${userRole}`)
        return res.status(403).json({ 
          message: `Access denied for role: ${userRole}` 
        })
      }

      next()
    } catch (error) {
      logger.error('Role block error:', error)
      res.status(500).json({ message: 'Access control check failed' })
    }
  }
}
