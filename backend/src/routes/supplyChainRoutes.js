import { Router } from 'express'
import {
  getOptimizedRoute,
  getRiskPrediction,
  getSupplyChainShipments,
  getAIRouteRecommendationHandler,
} from '../controllers/supplyChainController.js'

const router = Router()

router.get('/shipments', getSupplyChainShipments)
router.get('/predict-risk/:id', getRiskPrediction)
router.get('/optimize-route/:id', getOptimizedRoute)
router.get('/api/supply-chain/ai-route/:id', getAIRouteRecommendationHandler)

export default router
