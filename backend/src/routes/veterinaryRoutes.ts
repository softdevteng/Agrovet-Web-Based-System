import { Router } from 'express'
import { veterinaryController } from '../controllers/veterinaryController.js'
import { authenticate } from '../middleware/auth.js'
import { authorizeRole } from '../middleware/roleAuth.js'

const router = Router()

// All veterinary routes require authentication and vet/admin role
router.use(authenticate)
router.use(authorizeRole('vet', 'admin'))

// Consultation routes
router.get('/', veterinaryController.getConsultations)
router.get('/:id', veterinaryController.getConsultationById)
router.post('/', veterinaryController.recordConsultation)
router.put('/:id', veterinaryController.updateConsultation)

// Reports
router.get('/consultations/by-date', veterinaryController.getConsultationsByDate)
router.get('/follow-ups/pending', veterinaryController.getPendingFollowUps)

export default router
