import { Request, Response } from 'express'
import { inventoryService } from '../services/inventoryService.js'
import { logger } from '../middleware/logger.js'

export const inventoryController = {
  async getProducts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const search = req.query.search as string
      const category = req.query.category as string

      const result = await inventoryService.getProducts(page, limit, search, category)
      res.json(result)
    } catch (error) {
      logger.error('Get products error:', error)
      res.status(500).json({ message: 'Failed to get products' })
    }
  },

  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const product = await inventoryService.getProductById(id)

      if (!product) {
        return res.status(404).json({ message: 'Product not found' })
      }

      res.json(product)
    } catch (error) {
      logger.error('Get product error:', error)
      res.status(500).json({ message: 'Failed to get product' })
    }
  },

  async createProduct(req: Request, res: Response) {
    try {
      const product = await inventoryService.createProduct(req.body)
      logger.info(`Product created: ${product.id}`)

      res.status(201).json({
        message: 'Product created successfully',
        product,
      })
    } catch (error) {
      logger.error('Create product error:', error)
      res.status(500).json({ message: 'Failed to create product' })
    }
  },

  async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params
      const product = await inventoryService.updateProduct(id, req.body)

      logger.info(`Product updated: ${id}`)
      res.json({
        message: 'Product updated successfully',
        product,
      })
    } catch (error) {
      logger.error('Update product error:', error)
      res.status(500).json({ message: 'Failed to update product' })
    }
  },

  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params
      await inventoryService.deleteProduct(id)

      logger.info(`Product deleted: ${id}`)
      res.json({ message: 'Product deleted successfully' })
    } catch (error) {
      logger.error('Delete product error:', error)
      res.status(500).json({ message: 'Failed to delete product' })
    }
  },

  async getLowStockProducts(req: Request, res: Response) {
    try {
      const products = await inventoryService.getLowStockProducts()
      res.json(products)
    } catch (error) {
      logger.error('Get low stock error:', error)
      res.status(500).json({ message: 'Failed to get low stock products' })
    }
  },

  async getProductBatches(req: Request, res: Response) {
    try {
      const { productId } = req.params
      const batches = await inventoryService.getProductBatches(productId)

      res.json(batches)
    } catch (error) {
      logger.error('Get batches error:', error)
      res.status(500).json({ message: 'Failed to get batches' })
    }
  },

  async createBatch(req: Request, res: Response) {
    try {
      const batch = await inventoryService.createBatch(req.body)
      logger.info(`Batch created: ${batch.id}`)

      res.status(201).json({
        message: 'Batch created successfully',
        batch,
      })
    } catch (error) {
      logger.error('Create batch error:', error)
      res.status(500).json({ message: 'Failed to create batch' })
    }
  },

  async getExpiringBatches(req: Request, res: Response) {
    try {
      const daysUntilExpiry = parseInt(req.query.days as string) || 30
      const batches = await inventoryService.getExpiringBatches(daysUntilExpiry)

      res.json(batches)
    } catch (error) {
      logger.error('Get expiring batches error:', error)
      res.status(500).json({ message: 'Failed to get expiring batches' })
    }
  },
}
