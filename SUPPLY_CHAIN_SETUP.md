# Smart Supply Chain Optimizer - Setup Guide

## Overview

This is a full-stack Smart Supply Chain Optimizer built with Next.js frontend and Express backend, integrated with Supabase for data persistence. The system provides real-time shipment tracking, AI-powered risk predictions, and route optimization.

## Architecture

```
/vercel/share/v0-project/
├── app/
│   └── supply-chain/
│       ├── page.tsx          # Dashboard with all shipments
│       └── [id]/page.tsx     # Shipment details & optimization
├── components/
│   ├── supply-chain-card.tsx # Shipment card component
│   └── route-visualization.tsx # Route comparison view
├── backend/
│   ├── server.js            # Express server with 3 REST routes
│   ├── package.json         # Backend dependencies
│   ├── .env.example         # Environment variables template
│   └── migrations/
│       └── 01_create_shipments.sql  # Supabase table & seed data
└── SUPPLY_CHAIN_SETUP.md    # This file
```

## Setup Instructions

### 1. Supabase Setup

1. **Create Supabase Project** at https://supabase.com
2. **Run Migration** - Execute the SQL from `backend/migrations/01_create_shipments.sql`:
   - Go to SQL Editor in Supabase dashboard
   - Paste the entire migration file content
   - Click "Run"
   - This creates the `shipments` table and seeds 5 sample shipments

3. **Get Credentials**:
   - Navigate to Settings → API
   - Copy your `SUPABASE_URL` and `SUPABASE_KEY` (service role key)

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
# or
pnpm add

# Create .env file
cp .env.example .env

# Add your Supabase credentials to .env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_service_role_key
PORT=3001
```

**Start Backend**:
```bash
npm run dev
# or
pnpm dev
```

Server will be available at `http://localhost:3001`

Test endpoints:
- `http://localhost:3001/health` - Health check
- `http://localhost:3001/shipments` - Get all shipments
- `http://localhost:3001/predict-risk/SHP-001` - Get risk prediction
- `http://localhost:3001/optimize-route/SHP-001` - Get route optimization

### 3. Frontend Setup

Add to your Next.js `.env.local`:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

The frontend uses the existing SmartLogistics theme and components. No additional setup needed.

## API Endpoints

### GET /shipments
Returns all shipments from Supabase.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "SHP-001",
      "origin": "New York",
      "destination": "Los Angeles",
      "status": "in-transit",
      "current_location": "Chicago",
      "eta": "2 days",
      "route": [...],
      "alternate_route": [...]
    }
  ]
}
```

### GET /predict-risk/:id
Predicts risk for a specific shipment using rule-based logic.

**Response**:
```json
{
  "success": true,
  "data": {
    "shipmentId": "SHP-001",
    "riskScore": 45,
    "riskLevel": "medium",
    "weatherImpact": 30,
    "trafficImpact": 20,
    "weatherCondition": "clear",
    "trafficType": "light"
  }
}
```

Risk Levels:
- **Low**: 0-30%
- **Medium**: 30-70%
- **High**: 70-100%

### GET /optimize-route/:id
Generates optimized route for a shipment.

**Response**:
```json
{
  "success": true,
  "data": {
    "shipmentId": "SHP-001",
    "originalRoute": [...],
    "alternateRoute": [...],
    "originalEta": "24 hours",
    "optimizedEta": "18 hours",
    "timeSaved": 6,
    "riskReduction": 35,
    "confidence": 87,
    "suggestions": [
      "Avoid highway 70 due to traffic",
      "Consider overnight delivery",
      "Weather window closes in 6 hours"
    ]
  }
}
```

## Frontend Pages

### Dashboard (/supply-chain)
- Lists all shipments with real-time risk predictions
- Displays metrics: Total Shipments, Average Risk, High Risk Count
- Filters by status (All, In-Transit, Delivered, Pending, Delayed)
- Color-coded risk badges:
  - Green (Emerald): Low risk
  - Yellow: Medium risk
  - Red/Error: High risk
- Click any shipment card to view detailed information

### Shipment Details (/supply-chain/[id])
- Full shipment information with risk alert banner
- Route visualization showing original vs optimized routes
- Risk factor breakdown (weather, traffic impacts)
- Optimization metrics (time saved, risk reduction, confidence)
- Actionable suggestions for route optimization
- "Apply Optimized Route" button

## Design System

Uses SmartLogistics theme with:
- **Colors**: Dark background (#141313), white text, emerald-400 (low), yellow-400 (medium), error (high)
- **Typography**: Space Grotesk headings, Inter body text
- **Components**: Glass panels with backdrop blur, proper contrast ratios
- **Spacing**: Using Tailwind tokens (lg, md, sm)
- **Animations**: Framer Motion for smooth transitions and staggered animations

## Data Flow

1. **Dashboard Load**:
   - Fetch all shipments from `/shipments`
   - For each shipment, call `/predict-risk/:id` in parallel
   - Display cards with risk badges and metrics
   - Animate in with staggered Framer Motion

2. **Shipment Details Load**:
   - Fetch shipment by ID
   - Fetch risk prediction in parallel
   - Fetch route optimization in parallel
   - Display all information with risk alerts
   - Show route comparison and suggestions

## Customization

### Adding New Risk Factors

Edit `backend/server.js` `predictRisk()` function:
```javascript
const weatherFactor = Math.random() * 40 // Weight weather more heavily
const customFactor = Math.random() * 20  // Add new factor
const totalRisk = Math.min(100, baseRisk + weatherFactor + customFactor)
```

### Modifying Shipment Data

Edit `backend/migrations/01_create_shipments.sql` to add/modify shipments:
- Add new INSERT statements with different routes
- Modify route JSON arrays with city sequences
- Update status values (in-transit, delivered, pending, delayed)

### Styling Updates

All styling uses Tailwind with SmartLogistics theme tokens. Modify:
- Risk colors in `components/supply-chain-card.tsx` `getRiskColor()` function
- Glass panel styling in existing `GlassPanel` component
- Typography classes (font-h1, font-body-md, etc.)

## Troubleshooting

**Backend connection fails**:
- Ensure backend is running: `npm run dev` in `/backend`
- Check NEXT_PUBLIC_BACKEND_URL in `.env.local`
- Verify CORS is enabled in Express (should be by default)

**Supabase connection fails**:
- Verify credentials in `backend/.env`
- Check table exists: Go to Supabase → Tables → Confirm `shipments` table
- Ensure migration SQL was executed successfully

**No shipments displayed**:
- Verify migration was run and 5 seed records were created
- Check browser network tab for 500 errors from backend
- Ensure backend health check passes: `curl http://localhost:3001/health`

**Risk predictions show 0%**:
- Backend is returning data but frontend not rendering correctly
- Check browser console for errors
- Verify risk data is being fetched in network tab

## Performance Notes

- Dashboard loads all shipments and risk predictions concurrently using `Promise.all()`
- Risk predictions are cached in component state (not persisted between pages)
- For production, consider adding:
  - Redis caching for risk predictions (10-minute TTL)
  - Pagination for shipment list (currently loads all)
  - WebSocket for real-time updates

## Next Steps

1. Connect to Supabase
2. Run backend server
3. Visit `/supply-chain` to see dashboard
4. Click any shipment to view details and optimization
5. Customize risk logic and styling as needed
