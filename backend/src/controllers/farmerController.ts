import { Request, Response } from 'express'
import { farmerService } from '../services/farmerService.js'
import { logger } from '../middleware/logger.js'

export const farmerController = {
  async getFarmers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const search = req.query.search as string
      const region = req.query.region as string

      const result = await farmerService.getFarmers(page, limit, search, region)
      res.json(result)
    } catch (error) {
      logger.error('Get farmers error:', error)
      res.status(500).json({ message: 'Failed to get farmers' })
    }
  },

  async getFarmerById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const farmer = await farmerService.getFarmerById(id)

      if (!farmer) {
        return res.status(404).json({ message: 'Farmer not found' })
      }

      res.json(farmer)
    } catch (error) {
      logger.error('Get farmer error:', error)
      res.status(500).json({ message: 'Failed to get farmer' })
    }
  },

  async createFarmer(req: Request, res: Response) {
    try {
      const farmer = await farmerService.createFarmer(req.body)
      logger.info(`Farmer created: ${farmer.id}`)

      res.status(201).json({
        message: 'Farmer created successfully',
        farmer,
      })
    } catch (error) {
      logger.error('Create farmer error:', error)
      res.status(500).json({ message: 'Failed to create farmer' })
    }
  },

  async updateFarmer(req: Request, res: Response) {
    try {
      const { id } = req.params
      const farmer = await farmerService.updateFarmer(id, req.body)

      logger.info(`Farmer updated: ${id}`)
      res.json({
        message: 'Farmer updated successfully',
        farmer,
      })
    } catch (error) {
      logger.error('Update farmer error:', error)
      res.status(500).json({ message: 'Failed to update farmer' })
    }
  },

  async getFarmerCows(req: Request, res: Response) {
    try {
      const { farmerId } = req.params
      const cows = await farmerService.getFarmerCows(farmerId)

      res.json(cows)
    } catch (error) {
      logger.error('Get farmer cows error:', error)
      res.status(500).json({ message: 'Failed to get cows' })
    }
  },

  async createCow(req: Request, res: Response) {
    try {
      const cow = await farmerService.createCow(req.body)
      logger.info(`Cow created: ${cow.id}`)

      res.status(201).json({
        message: 'Cow created successfully',
        cow,
      })
    } catch (error) {
      logger.error('Create cow error:', error)
      res.status(500).json({ message: 'Failed to create cow' })
    }
  },

  async updateCow(req: Request, res: Response) {
    try {
      const { cowId } = req.params
      const cow = await farmerService.updateCow(cowId, req.body)

      logger.info(`Cow updated: ${cowId}`)
      res.json({
        message: 'Cow updated successfully',
        cow,
      })
    } catch (error) {
      logger.error('Update cow error:', error)
      res.status(500).json({ message: 'Failed to update cow' })
    }
  },
}
