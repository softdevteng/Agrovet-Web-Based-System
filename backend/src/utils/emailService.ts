import nodemailer from 'nodemailer'
import { logger } from '../middleware/logger.js'
import * as fs from 'fs'
import * as path from 'path'

interface VerificationData {
  email: string
  code: string
  timestamp: string
}

// Store verification codes for development/testing
const verificationCodesFile = path.join(process.cwd(), 'verification_codes.json')

// Helper function to send email via Gmail
async function sendEmailViaGmail(email: string, code: string): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Your SK AGROVET Verification Code',
      html: `
        <h2>SK AGROVET Account Verification</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing: 5px; font-family: monospace;">${code}</h1>
        <p>This code expires in 10 minutes.</p>
      `,
      text: `Your SK AGROVET verification code is: ${code}. It expires in 10 minutes.`,
    })
    logger.info(`✅ Verification email sent to ${email}: ${info.messageId}`)
  } catch (err) {
    logger.error('❌ Email send error:', err)
    throw err
  }
}

export const emailService = {
  saveVerificationCodeForTesting(email: string, code: string): void {
    try {
      let codes: VerificationData[] = []
      if (fs.existsSync(verificationCodesFile)) {
        const data = fs.readFileSync(verificationCodesFile, 'utf-8')
        codes = JSON.parse(data)
      }

      codes = codes.filter(c => c.email !== email)

      codes.push({
        email,
        code,
        timestamp: new Date().toISOString(),
      })

      fs.writeFileSync(verificationCodesFile, JSON.stringify(codes, null, 2))
      logger.info(`✅ Code saved: ${email} -> ${code}`)
    } catch (error) {
      logger.error('Error saving verification code:', error)
    }
  },

  getVerificationCodeForTesting(email: string): string | null {
    try {
      if (!fs.existsSync(verificationCodesFile)) {
        return null
      }
      const data = fs.readFileSync(verificationCodesFile, 'utf-8')
      const codes: VerificationData[] = JSON.parse(data)
      const found = codes.find(c => c.email === email)
      return found ? found.code : null
    } catch (error) {
      logger.error('Error reading verification code:', error)
      return null
    }
  },

  async sendVerificationCode(
    email: string,
    code: string,
    method: string = 'email'
  ): Promise<void> {
    this.saveVerificationCodeForTesting(email, code)

    if (method === 'email') {
      if (process.env.NODE_ENV === 'production' && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await sendEmailViaGmail(email, code)
      } else {
        logger.info(`📧 [DEV] Code for ${email}: ${code}`)
        console.log(`\n${'='.repeat(50)}`)
        console.log(`📧 Verification Code (Development Mode)`)
        console.log(`Email: ${email}`)
        console.log(`Code: ${code}`)
        console.log(`${'='.repeat(50)}\n`)
      }
    } else if (method === 'phone') {
      logger.info(`📱 [DEV] SMS code for ${email}: ${code}`)
      console.log(`\n${'='.repeat(50)}`)
      console.log(`📱 SMS Code (Development Mode)`)
      console.log(`Phone: ${email}`)
      console.log(`Code: ${code}`)
      console.log(`${'='.repeat(50)}\n`)
    }
  },
}
