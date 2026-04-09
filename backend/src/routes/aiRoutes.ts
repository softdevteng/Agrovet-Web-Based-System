import { Router } from 'express'
import { aiController } from '../controllers/aiController.js'
import { authenticate } from '../middleware/auth.js'
import { authorizeRole } from '../middleware/roleAuth.js'

const router = Router()

// All AI routes require authentication and vet/admin role
router.use(authenticate)
router.use(authorizeRole('vet', 'admin'))

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
