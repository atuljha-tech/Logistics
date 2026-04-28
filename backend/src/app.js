import express from 'express'
import cors from 'cors'

import healthRoutes from './routes/healthRoutes.js'
import shipmentRoutes from './routes/shipmentRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import statisticsRoutes from './routes/statisticsRoutes.js'
import supplyChainRoutes from './routes/supplyChainRoutes.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandlers.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use(healthRoutes)
app.use('/api', shipmentRoutes)
app.use('/api', eventRoutes)
app.use('/api', statisticsRoutes)
app.use(supplyChainRoutes)

app.use(errorHandler)
app.use(notFoundHandler)

export default app
