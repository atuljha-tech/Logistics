import { Router } from 'express'
import { addEventToShipment, getEventsByShipmentId } from '../controllers/eventController.js'

const router = Router()

router.get('/shipments/:shipmentId/events', getEventsByShipmentId)
router.post('/shipments/:shipmentId/events', addEventToShipment)

export default router
