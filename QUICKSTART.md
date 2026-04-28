# Quick Start Guide - Production Shipment Tracking System

Get the system running in 5 minutes.

## Prerequisites
- Node.js 16+
- Supabase account (free tier works)
- pnpm or npm

## 1. Database Setup (2 min)

1. Create a Supabase project at https://supabase.com
2. In Supabase console, go to SQL Editor
3. Copy entire content from `/scripts/01_shipments_schema.sql`
4. Paste into SQL editor and click "Run"
5. Wait for tables to create successfully

**Verify**: Check "Tables" in left sidebar - you should see `shipments` and `shipment_events`

## 2. Backend Setup (2 min)

```bash
cd backend
npm install
```

Create `.env` file with your Supabase credentials:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIs... (service role key from Supabase)
PORT=3001
```

Get credentials from Supabase:
- Settings → API → Project URL (copy this to SUPABASE_URL)
- Settings → API → Service Role Secret (copy this to SUPABASE_KEY)

Start backend:
```bash
npm start
```

Should show: "Shipment Tracking API running on http://localhost:3001"

## 3. Frontend Setup (1 min)

Create `.env.local` in project root:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Backend is already installed. Just run:
```bash
pnpm dev
```

Frontend runs on `http://localhost:3000`

## 4. Test It (works!)

1. Open http://localhost:3000/logistics
2. Click "Create Shipment"
3. Fill form (use any Indian city from dropdown)
4. Click "Create Shipment"
5. You should be redirected to dashboard with your new shipment
6. Click "View" to see full details
7. Try `/logistics/track` - track by your generated tracking ID

## Common Issues

**"Backend connection refused"**
- Make sure backend is running: `npm start` in `/backend`
- Check `NEXT_PUBLIC_API_URL` is correct
- Make sure port 3001 is free

**"Table shipments doesn't exist"**
- Run SQL migration again in Supabase
- Check Supabase console shows tables created

**"Can't create shipment"**
- Check backend console for errors
- Verify SUPABASE_URL and SUPABASE_KEY in backend `.env`
- Make sure Supabase tables exist

**"Blank page"**
- Check browser console for errors (F12)
- Make sure frontend is running: `pnpm dev`
- Try hard refresh: Ctrl+Shift+R

## API Endpoints to Test

Once backend is running, test these:

```bash
# Health check
curl http://localhost:3001/health

# List shipments
curl http://localhost:3001/api/shipments

# Track a shipment (use tracking ID from dashboard)
curl http://localhost:3001/api/track/IND20250126145230[ID]

# Get statistics
curl http://localhost:3001/api/statistics
```

## What You Can Do

- **Create** shipments with sender/receiver details
- **Track** shipments publicly by tracking ID
- **Update** status, location, and agent assignment
- **View** complete tracking timeline
- **Filter** shipments by status in dashboard
- **Search** shipments by ID or names

## Next Steps

1. Add authentication (Auth.js recommended)
2. Add email notifications on status change
3. Integrate maps for route visualization
4. Add SMS updates
5. Deploy to production

## Production Deployment

When ready to deploy:

1. **Backend**: Deploy to Vercel, Railway, or similar
   - Add production Supabase credentials to environment
   - Copy backend URL to frontend NEXT_PUBLIC_API_URL

2. **Frontend**: Deploy to Vercel
   - Set NEXT_PUBLIC_API_URL to production backend

3. **Database**: Use Supabase's managed PostgreSQL

See REFACTOR_COMPLETE.md for detailed deployment notes.

---

**System is live!** You're now running a production-grade shipment tracking system with real backend integration and database.
