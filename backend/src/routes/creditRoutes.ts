import { Router } from 'express'
import { creditController } from '../controllers/creditController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// All credit routes require authentication (attendant and admin can manage credits)
router.use(authenticate)

// Ledger routes
router.get('/:farmerId/ledger', creditController.getFarmerCreditLedger)

// Transaction routes
router.post('/transactions', creditController.recordTransaction)
router.post('/payments', creditController.recordPayment)

// Reports
router.get('/reports/credit', creditController.getCreditReport)
router.get('/reports/overdue', creditController.getOverduePayments)

export default router
