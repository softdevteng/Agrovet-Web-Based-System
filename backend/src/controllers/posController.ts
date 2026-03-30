import { Request, Response } from 'express'
import { posService } from '../services/posService.js'
import { logger } from '../middleware/logger.js'

export const posController = {
  async createTransaction(req: any, res: Response) {
    try {
      const { userId } = req.user
      const transaction = await posService.createTransaction({
        ...req.body,
        attendantId: userId,
      })

      logger.info(`Transaction created: ${transaction.id}`)
      res.status(201).json({
        message: 'Transaction completed successfully',
        transaction,
      })
    } catch (error) {
      logger.error('Create transaction error:', error)
      res.status(500).json({ message: 'Failed to create transaction' })
    }
  },

  async getTransactions(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const startDate = req.query.startDate as string
      const endDate = req.query.endDate as string

      const result = await posService.getTransactions(page, limit, startDate, endDate)
      res.json(result)
    } catch (error) {
      logger.error('Get transactions error:', error)
      res.status(500).json({ message: 'Failed to get transactions' })
    }
  },

  async getTransactionById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const transaction = await posService.getTransactionById(id)

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' })
      }

      res.json(transaction)
    } catch (error) {
      logger.error('Get transaction error:', error)
      res.status(500).json({ message: 'Failed to get transaction' })
    }
  },

  async getDailyReport(req: Request, res: Response) {
    try {
      const { date } = req.query
      if (!date) {
        return res.status(400).json({ message: 'Date parameter required' })
      }

      const report = await posService.getDailyReport(date as string)
      res.json(report)
    } catch (error) {
      logger.error('Get daily report error:', error)
      res.status(500).json({ message: 'Failed to get daily report' })
    }
  },

  async getWeeklySales(req: Request, res: Response) {
    try {
      const sales = await posService.getWeeklySales()
      res.json(sales)
    } catch (error) {
      logger.error('Get weekly sales error:', error)
      res.status(500).json({ message: 'Failed to get weekly sales' })
    }
  },
}
