# LogisTrack - Logistics & Shipment Tracking Platform

## 🚀 Project Overview

A full-stack logistics platform with Indian focus, featuring:
- **Admin Dashboard** — Create and manage shipments
- **Customer Tracking** — Track shipments by ID in real-time
- **Elegant UI** — Glassmorphism design with smooth animations
- **Live Location Updates** — Update shipment status and location
- **Status Timeline** — Complete tracking history with timestamps

---

## 📋 Setup Instructions

### 1. **Database Setup (Supabase)**

Run the SQL migration in your Supabase console:

```sql
-- Run the contents of /scripts/01_create_shipments_schema.sql
```

This creates:
- `shipments` table with tracking IDs (IND + timestamp format)
- `shipment_events` table for status history
- 5 sample Indian shipments with names & cities

**Seed Data Includes:**
- Indian names: Rahul Sharma, Priya Verma, Arjun Singh, Neha Gupta, Vikram Patel
- Indian cities: Mumbai, Delhi, Bangalore, Kolkata, Hyderabad, Chennai, Pune
- PIN codes: 400001, 110001, 560001, 700001, 500001, 600001, 411001

### 2. **Backend Setup (Express)**

Install and run the backend:

```bash
cd backend
npm install
npm start
```

**API Endpoints:**
- `GET /api/shipments` — List all shipments (admin)
- `POST /api/shipments` — Create shipment
- `GET /api/track/:trackingId` — Track shipment (public)
- `PUT /api/shipments/:id` — Update shipment
- `POST /api/shipments/:id/events` — Add tracking event
- `GET /api/shipments/:id/events` — Get timeline

### 3. **Frontend Pages**

All pages use **Glassmorphism** design with:
- **Borders**: 1-2px solid rgba(255, 255, 255, 0.05-0.3) with hover effects
- **Colors**: Emerald (Delivered), Blue (In Transit), Orange (Out for Delivery), Gray (Pending)
- **Typography**: Space Grotesk headings, Inter body text
- **Animations**: Framer Motion staggered reveals and transitions

#### Pages:
1. **Dashboard** (`/logistics`) — Overview with stats and search
2. **Create Shipment** (`/logistics/create`) — Multi-step form
3. **Track Shipment** (`/logistics/track`) — Public tracking by ID
4. **Shipment Details** (`/logistics/[id]`) — Full details with edit option

---

## 🎨 Design System

### Color Palette
- **Primary**: Cyan (#06b6d4)
- **Success**: Emerald (#10b981)
- **Warning**: Orange (#f59e0b)
- **Info**: Blue (#0ea5e9)
- **Error**: Red (#ef4444)
- **Background**: Dark (#141313)
- **Surface**: Dark Gray (#1f1f1f)
- **Text**: Off-White (#e5e2e1)

### Typography
- **Headings**: Space Grotesk, bold weights
- **Body**: Inter, regular and medium weights
- **Labels**: Font-label-caps for uppercase text
- **IDs/Code**: Font-mono for tracking IDs

### Components
- **Cards**: Glass-panel with 1-2px borders
- **Inputs**: Surface-container-low with focus ring
- **Buttons**: Gradient backgrounds with hover opacity
- **Badges**: Status-colored with semi-transparent backgrounds

---

## 🔌 Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

For backend, create `/backend/.env`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_key
PORT=3001
```

---

## 📱 Pages & Features

### Dashboard (`/logistics`)
- View all shipments with filters
- Search by tracking ID, sender, receiver
- Stats cards (Total, In Transit, Delivered, Pending)
- Quick status filters
- Click to view full details

### Create Shipment (`/logistics/create`)
- 3-section form: Sender, Receiver, Package Details
- Package types: Electronics, Documents, Clothing, Food Items, Books
- Validated date picker for estimated delivery
- Success redirect to dashboard

### Track Shipment (`/logistics/track`)
- Public tracking without login
- Search by tracking ID
- Full shipment details + timeline
- Status badges with visual indicators
- Comprehensive event history

### Shipment Details (`/logistics/[id]`)
- Admin view with edit capabilities
- Update status, location, coordinates
- Add tracking events manually
- Timeline visualization
- All shipment information

---

## 🎯 Key Features

### Elegant UI
- Glassmorphism cards with subtle borders
- Smooth Framer Motion animations
- Responsive grid layouts
- Dark theme optimized for readability
- Gradient status indicators

### Tracking
- Real-time location updates
- Historical timeline with timestamps
- Event descriptions
- Multi-status support (4 statuses)

### Indian Data
- Names in Hindi transliteration (Sharma, Verma, Singh, Patel)
- Major Indian cities
- Indian PIN code format
- +91 phone format support

---

## 🚢 Tracking ID Format

Tracking IDs auto-generated as:
`IND` + YYMMDDHHmmss + 4-digit random = `IND202401011234`

Example: `IND202401011234`

---

## 📊 Database Schema

### shipments table
- `id` — UUID primary key
- `tracking_id` — Unique identifier (IND format)
- `sender_name`, `sender_phone`, `sender_address`, `sender_pincode`
- `receiver_name`, `receiver_phone`, `receiver_address`, `receiver_pincode`
- `package_type` — Category (Electronics, Documents, etc.)
- `weight` — Decimal in kg
- `status` — Pending/In Transit/Out for Delivery/Delivered
- `current_lat`, `current_lng` — Live coordinates
- `estimated_delivery` — Date
- `created_at`, `updated_at` — Timestamps

### shipment_events table
- `id` — UUID primary key
- `shipment_id` — FK to shipments
- `status` — Event status
- `location` — Location name
- `latitude`, `longitude` — Coordinates
- `timestamp` — When event occurred
- `description` — Optional notes

---

## 🎬 Getting Started

1. Run database migration in Supabase
2. Set environment variables
3. Start backend: `cd backend && npm start`
4. Frontend runs automatically with Next.js
5. Visit `http://localhost:3000/logistics`

---

## 🔒 Security Notes

- Public tracking by ID only (no password required)
- Admin features require proper authentication setup
- RLS policies enabled on Supabase
- No sensitive data in frontend logs

---

## 📝 Example Tracking ID

`IND202501221234` — Track using this in the Track page

---

## 🎨 Customization

### Change Colors
Edit status color mapping in page.tsx:
```tsx
case 'Delivered':
  return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
```

### Change Cities
Update INDIAN_CITIES array in create/page.tsx

### Add More Package Types
Update select options in create/page.tsx form

---

Created with ❤️ for Indian logistics excellence.
