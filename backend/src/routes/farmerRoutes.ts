import { Router } from 'express'
import { farmerController } from '../controllers/farmerController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// All farmer routes require authentication
router.use(authenticate)

// Farmer routes
router.get('/', farmerController.getFarmers)
router.get('/:id', farmerController.getFarmerById)
router.post('/', farmerController.createFarmer)
router.put('/:id', farmerController.updateFarmer)

// Cow routes
router.get('/:farmerId/cows', farmerController.getFarmerCows)
router.post('/cows', farmerController.createCow)
router.put('/cows/:cowId', farmerController.updateCow)

export default router
