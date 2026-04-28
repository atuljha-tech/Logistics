import { Router } from 'express'
import {
  createShipment,
  getShipmentById,
  getShipments,
  trackShipmentByTrackingId,
  updateShipment,
  deleteShipment,
  bulkUpdateShipments,
} from '../controllers/shipmentController.js'

const router = Router()

// Order matters: specific routes before parameterized ones
router.post('/shipments/bulk-update', bulkUpdateShipments)
router.get('/shipments', getShipments)
router.post('/shipments', createShipment)
router.get('/shipments/:id', getShipmentById)
router.put('/shipments/:id', updateShipment)
router.delete('/shipments/:id', deleteShipment)
router.get('/track/:trackingId', trackShipmentByTrackingId)

export default router
