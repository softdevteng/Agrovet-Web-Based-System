import { Router } from 'express'
import { posController } from '../controllers/posController.js'
import { authenticate } from '../middleware/auth.js'
import { authorizeRole } from '../middleware/roleAuth.js'

const router = Router()

// All POS routes require authentication and attendant/admin role
router.use(authenticate)
router.use(authorizeRole('attendant', 'admin'))

// Transaction routes
router.post('/transactions', posController.createTransaction)
router.get('/transactions', posController.getTransactions)
router.get('/transactions/:id', posController.getTransactionById)

// Reports
router.get('/reports/daily', posController.getDailyReport)
router.get('/reports/weekly', posController.getWeeklySales)

export default router
