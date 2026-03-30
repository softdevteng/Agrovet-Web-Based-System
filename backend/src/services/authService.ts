import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import { query } from '../config/database.js'
import { logger } from '../middleware/logger.js'

interface LoginPayload {
  userId: string
  email: string
  role: string
}

export const authService = {
  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
  },

  async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash)
  },

  generateToken(payload: LoginPayload) {
    const secret: string = process.env.JWT_SECRET || 'your_jwt_secret_key'
    const expiresIn: string = process.env.JWT_EXPIRE || '7d'
    return jwt.sign(payload, secret, { expiresIn } as any)
  },

  verifyToken(token: string) {
    try {
      const secret = process.env.JWT_SECRET || 'your_jwt_secret_key'
      return jwt.verify(token, secret) as LoginPayload
    } catch (error) {
      throw new Error('Invalid token')
    }
  },

  async getUserByEmail(email: string) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    return result.rows[0]
  },

  async createUser(data: {
    email: string
    username: string
    fullName: string
    passwordHash: string
    role: string
  }) {
    const result = await query(
      `INSERT INTO users (email, username, full_name, password_hash, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, username, full_name, role`,
      [data.email, data.username, data.fullName, data.passwordHash, data.role]
    )
    return result.rows[0]
  },

  async getUserById(userId: string) {
    const result = await query(
      'SELECT id, email, username, full_name, role, phone, avatar_url FROM users WHERE id = $1',
      [userId]
    )
    return result.rows[0]
  },

  async getAllUsers(page = 1, limit = 20) {
    const offset = (page - 1) * limit
    const result = await query(
      'SELECT id, email, username, full_name, role, is_active, last_login FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    )
    const countResult = await query('SELECT COUNT(*) FROM users')
    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
    }
  },

  async updateUser(userId: string, data: Partial<any>) {
    const fields: string[] = []
    const values: any[] = [userId]
    let paramCount = 2

    if (data.username) {
      fields.push(`username = $${paramCount}`)
      values.push(data.username)
      paramCount++
    }
    if (data.fullName) {
      fields.push(`full_name = $${paramCount}`)
      values.push(data.fullName)
      paramCount++
    }
    if (data.phone) {
      fields.push(`phone = $${paramCount}`)
      values.push(data.phone)
      paramCount++
    }
    if (data.role) {
      fields.push(`role = $${paramCount}`)
      values.push(data.role)
      paramCount++
    }

    if (fields.length === 0) return { id: userId }

    const result = await query(
      `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      values
    )
    return result.rows[0]
  },

  generateVerificationCode(): string {
    // Generate a 6-digit code
    return Math.floor(100000 + Math.random() * 900000).toString()
  },

  async storeVerificationCode(email: string, code: string) {
    // Store code with 10 minute expiration
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    
    await query(
      'DELETE FROM verification_codes WHERE email = $1',
      [email]
    )

    await query(
      `INSERT INTO verification_codes (email, code, expires_at) 
       VALUES ($1, $2, $3)`,
      [email, code, expiresAt]
    )
  },

  async verifyCode(email: string, code: string): Promise<boolean> {
    const result = await query(
      `SELECT * FROM verification_codes 
       WHERE email = $1 AND code = $2 AND expires_at > NOW()`,
      [email, code]
    )

    if (result.rows.length === 0) {
      return false
    }

    // Mark user as verified
    await query(
      'UPDATE users SET is_verified = true, updated_at = CURRENT_TIMESTAMP WHERE email = $1',
      [email]
    )

    // Delete used code
    await query(
      'DELETE FROM verification_codes WHERE email = $1',
      [email]
    )

    return true
  },

  async sendVerificationCode(email: string, code: string, method: string = 'email'): Promise<void> {
    if (method === 'email') {
      // send via nodemailer using Gmail
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        })

        const info = await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Your SK AGROVET Verification Code',
          text: `Your verification code is: ${code}`,
        })
        logger.info(`Verification email sent to ${email}: ${info.messageId}`)
      } catch (err) {
        logger.error('Email send error, falling back to console:', err)
        console.log(`Verification code for ${email}: ${code}`)
      }
    } else if (method === 'phone') {
      // TODO: Implement SMS sending using Twilio or similar service
      console.log(`SMS code for ${email}: ${code}`)
    }
  },
}
