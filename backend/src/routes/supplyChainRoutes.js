import { Router } from 'express'
import {
  getOptimizedRoute,
  getRiskPrediction,
  getSupplyChainShipments,
} from '../controllers/supplyChainController.js'

const router = Router()

router.get('/shipments', getSupplyChainShipments)
router.get('/predict-risk/:id', getRiskPrediction)
router.get('/optimize-route/:id', getOptimizedRoute)

export default router
