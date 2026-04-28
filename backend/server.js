import app from './src/app.js'
import { PORT } from './src/config/env.js'

app.listen(PORT, () => {
  console.log(`Shipment Tracking API running on http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
})
