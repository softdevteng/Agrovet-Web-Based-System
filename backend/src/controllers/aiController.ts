import { Request, Response } from 'express'
import { aiService } from '../services/aiService.js'
import { logger } from '../middleware/logger.js'

export const aiController = {
  async getSemenInventory(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const breed = req.query.breed as string
      const status = req.query.status as string

      const result = await aiService.getSemenInventory(breed, status, page, limit)
      res.json(result)
    } catch (error) {
      logger.error('Get semen inventory error:', error)
      res.status(500).json({ message: 'Failed to get semen inventory' })
    }
  },

  async addSemenStraw(req: Request, res: Response) {
    try {
      const straw = await aiService.addSemenStraw(req.body)
      logger.info(`Semen straw added: ${straw.id}`)

      res.status(201).json({
        message: 'Semen straw added successfully',
        straw,
      })
    } catch (error) {
      logger.error('Add semen straw error:', error)
      res.status(500).json({ message: 'Failed to add semen straw' })
    }
  },

  async recordService(req: any, res: Response) {
    try {
      const { userId } = req.user
      const service = await aiService.recordService({
        ...req.body,
        technicianId: userId,
      })

      logger.info(`AI service recorded: ${service.id}`)
      res.status(201).json({
        message: 'AI service recorded successfully',
        service,
      })
    } catch (error) {
      logger.error('Record service error:', error)
      res.status(500).json({ message: 'Failed to record service' })
    }
  },

  async getServices(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const farmerId = req.query.farmerId as string
      const status = req.query.status as string

      const result = await aiService.getServices(page, limit, farmerId, status)
      res.json(result)
    } catch (error) {
      logger.error('Get services error:', error)
      res.status(500).json({ message: 'Failed to get services' })
    }
  },

  async updateServiceStatus(req: Request, res: Response) {
    try {
      const { id } = req.params
      const service = await aiService.updateServiceStatus(id, req.body)

      logger.info(`Service status updated: ${id}`)
      res.json({
        message: 'Service status updated successfully',
        service,
      })
    } catch (error) {
      logger.error('Update service status error:', error)
      res.status(500).json({ message: 'Failed to update service status' })
    }
  },

  async getPendingPregnancyChecks(req: Request, res: Response) {
    try {
      const checks = await aiService.getPendingPregnancyChecks()
      res.json(checks)
    } catch (error) {
      logger.error('Get pending checks error:', error)
      res.status(500).json({ message: 'Failed to get pending checks' })
    }
  },
}
