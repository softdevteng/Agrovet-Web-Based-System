import { Router } from 'express'
import { aiController } from '../controllers/aiController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// All AI routes require authentication
router.use(authenticate)

// Semen inventory
router.get('/semen', aiController.getSemenInventory)
router.post('/semen', aiController.addSemenStraw)

// AI services
router.post('/services', aiController.recordService)
router.get('/services', aiController.getServices)
router.put('/services/:id/status', aiController.updateServiceStatus)

// Follow-ups
router.get('/services/follow-ups/pending', aiController.getPendingPregnancyChecks)

export default router
