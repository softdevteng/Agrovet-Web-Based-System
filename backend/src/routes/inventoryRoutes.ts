import { Router } from 'express'
import { inventoryController } from '../controllers/inventoryController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// All inventory routes require authentication
router.use(authenticate)

// Product routes
router.get('/products', inventoryController.getProducts)
router.get('/products/:id', inventoryController.getProductById)
router.post('/products', inventoryController.createProduct)
router.put('/products/:id', inventoryController.updateProduct)
router.delete('/products/:id', inventoryController.deleteProduct)

// Low stock alerts
router.get('/products/low-stock/list', inventoryController.getLowStockProducts)

// Batch management
router.get('/batches/:productId', inventoryController.getProductBatches)
router.post('/batches', inventoryController.createBatch)
router.get('/batches/expiring/list', inventoryController.getExpiringBatches)

export default router
