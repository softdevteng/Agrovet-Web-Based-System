import { Request, Response } from 'express'
import { veterinaryService } from '../services/veterinaryService.js'
import { logger } from '../middleware/logger.js'

export const veterinaryController = {
  async getConsultations(req: any, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const farmerId = req.query.farmerId as string
      const status = req.query.status as string

      const result = await veterinaryService.getConsultations(page, limit, farmerId, status)
      res.json(result)
    } catch (error) {
      logger.error('Get consultations error:', error)
      res.status(500).json({ message: 'Failed to get consultations' })
    }
  },

  async getConsultationById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const consultation = await veterinaryService.getConsultationById(id)

      if (!consultation) {
        return res.status(404).json({ message: 'Consultation not found' })
      }

      res.json(consultation)
    } catch (error) {
      logger.error('Get consultation error:', error)
      res.status(500).json({ message: 'Failed to get consultation' })
    }
  },

  async recordConsultation(req: any, res: Response) {
    try {
      const { userId } = req.user
      const consultation = await veterinaryService.recordConsultation({
        ...req.body,
        vetId: userId,
      })

      logger.info(`Consultation recorded: ${consultation.id}`)
      res.status(201).json({
        message: 'Consultation recorded successfully',
        consultation,
      })
    } catch (error) {
      logger.error('Record consultation error:', error)
      res.status(500).json({ message: 'Failed to record consultation' })
    }
  },

  async updateConsultation(req: Request, res: Response) {
    try {
      const { id } = req.params
      const consultation = await veterinaryService.updateConsultation(id, req.body)

      logger.info(`Consultation updated: ${id}`)
      res.json({
        message: 'Consultation updated successfully',
        consultation,
      })
    } catch (error) {
      logger.error('Update consultation error:', error)
      res.status(500).json({ message: 'Failed to update consultation' })
    }
  },

  async getConsultationsByDate(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date required' })
      }

      const consultations = await veterinaryService.getConsultationsByDate(
        startDate as string,
        endDate as string
      )
      res.json(consultations)
    } catch (error) {
      logger.error('Get consultations by date error:', error)
      res.status(500).json({ message: 'Failed to get consultations' })
    }
  },

  async getPendingFollowUps(req: Request, res: Response) {
    try {
      const followUps = await veterinaryService.getPendingFollowUps()
      res.json(followUps)
    } catch (error) {
      logger.error('Get pending follow ups error:', error)
      res.status(500).json({ message: 'Failed to get pending follow ups' })
    }
  },
}
