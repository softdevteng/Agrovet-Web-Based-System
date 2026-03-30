import { Router } from 'express'
import { veterinaryController } from '../controllers/veterinaryController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// All veterinary routes require authentication
router.use(authenticate)

// Consultation routes
router.get('/', veterinaryController.getConsultations)
router.get('/:id', veterinaryController.getConsultationById)
router.post('/', veterinaryController.recordConsultation)
router.put('/:id', veterinaryController.updateConsultation)

// Reports
router.get('/consultations/by-date', veterinaryController.getConsultationsByDate)
router.get('/follow-ups/pending', veterinaryController.getPendingFollowUps)

export default router
