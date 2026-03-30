import { Request, Response } from 'express'
import { creditService } from '../services/creditService.js'
import { logger } from '../middleware/logger.js'

export const creditController = {
  async getFarmerCreditLedger(req: Request, res: Response) {
    try {
      const { farmerId } = req.params
      const ledger = await creditService.getFarmerCreditLedger(farmerId)

      res.json(ledger)
    } catch (error) {
      logger.error('Get credit ledger error:', error)
      res.status(500).json({ message: 'Failed to get credit ledger' })
    }
  },

  async recordTransaction(req: Request, res: Response) {
    try {
      const transaction = await creditService.recordTransaction(req.body)
      logger.info(`Credit transaction recorded: ${transaction.id}`)

      res.status(201).json({
        message: 'Transaction recorded successfully',
        transaction,
      })
    } catch (error) {
      logger.error('Record transaction error:', error)
      res.status(500).json({ message: 'Failed to record transaction' })
    }
  },

  async recordPayment(req: Request, res: Response) {
    try {
      const { farmerId, amount, reference } = req.body
      const payment = await creditService.recordPayment(farmerId, amount, reference)

      logger.info(`Payment recorded for farmer: ${farmerId}`)
      res.status(201).json({
        message: 'Payment recorded successfully',
        payment,
      })
    } catch (error) {
      logger.error('Record payment error:', error)
      res.status(500).json({ message: 'Failed to record payment' })
    }
  },

  async getCreditReport(req: Request, res: Response) {
    try {
      const { startDate, endDate, status } = req.query
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date required' })
      }

      const report = await creditService.getCreditReport(
        startDate as string,
        endDate as string,
        status as string
      )
      res.json(report)
    } catch (error) {
      logger.error('Get credit report error:', error)
      res.status(500).json({ message: 'Failed to get credit report' })
    }
  },

  async getOverduePayments(req: Request, res: Response) {
    try {
      const overduePayments = await creditService.getOverduePayments()
      res.json(overduePayments)
    } catch (error) {
      logger.error('Get overdue payments error:', error)
      res.status(500).json({ message: 'Failed to get overdue payments' })
    }
  },
}
