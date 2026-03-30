import { Router } from 'express'
import { posController } from '../controllers/posController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// All POS routes require authentication
router.use(authenticate)

// Transaction routes
router.post('/transactions', posController.createTransaction)
router.get('/transactions', posController.getTransactions)
router.get('/transactions/:id', posController.getTransactionById)

// Reports
router.get('/reports/daily', posController.getDailyReport)
router.get('/reports/weekly', posController.getWeeklySales)

export default router
