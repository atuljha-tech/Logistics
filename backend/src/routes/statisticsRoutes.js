import { Router } from 'express'
import { getShipmentStatistics } from '../controllers/statisticsController.js'

const router = Router()

router.get('/statistics', getShipmentStatistics)

export default router
