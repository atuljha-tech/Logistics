# SmartLogistics - Testing Guide

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install

# Create .env file with your Supabase credentials
cp .env.example .env
# Edit .env and add:
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_KEY=your_service_role_key
# PORT=3001

# Start backend
npm run dev
```

Backend will run on `http://localhost:3001`

### 2. Frontend Setup
```bash
# From project root
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## Testing Checklist

### ✅ Backend API Tests

#### Health Check
```bash
curl http://localhost:3001/health
# Expected: {"success":true,"message":"Server is running"}
```

#### Get Statistics
```bash
curl http://localhost:3001/api/statistics
# Expected: JSON with total, pending, in_transit, delivered, etc.
```

#### Get Shipments (with pagination)
```bash
curl "http://localhost:3001/api/shipments?page=1&limit=10"
# Expected: JSON with data array and pagination object
```

#### Get Shipments (with status filter)
```bash
curl "http://localhost:3001/api/shipments?status=In%20Transit"
# Expected: Only In Transit shipments
```

#### Create Shipment
```bash
curl -X POST http://localhost:3001/api/shipments \
  -H "Content-Type: application/json" \
  -d '{
    "sender_name": "Test Sender",
    "sender_phone": "+91-9876543210",
    "sender_address": "123 Test St",
    "sender_city": "Mumbai",
    "sender_pincode": "400001",
    "receiver_name": "Test Receiver",
    "receiver_phone": "+91-9123456789",
    "receiver_address": "456 Test Ave",
    "receiver_city": "Delhi",
    "receiver_pincode": "110001",
    "package_type": "Electronics",
    "weight": 5,
    "estimated_delivery": "2026-05-01"
  }'
# Expected: JSON with success:true and created shipment data
# Note the tracking_id from response for next tests
```

#### Track Shipment
```bash
# Replace TRACKING_ID with actual tracking ID from create response
curl http://localhost:3001/api/track/TRACKING_ID
# Expected: Shipment data with events array
```

#### Update Shipment
```bash
# Replace SHIPMENT_ID with actual ID
curl -X PUT http://localhost:3001/api/shipments/SHIPMENT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Transit",
    "current_location": "Mumbai Transit Hub"
  }'
# Expected: Updated shipment data
```

#### Bulk Update Shipments
```bash
# Replace IDs with actual shipment IDs
curl -X POST http://localhost:3001/api/shipments/bulk-update \
  -H "Content-Type: application/json" \
  -d '{
    "ids": ["id1", "id2"],
    "status": "Delivered"
  }'
# Expected: JSON with updated count
```

#### Delete Shipment
```bash
# Replace SHIPMENT_ID with actual ID
curl -X DELETE http://localhost:3001/api/shipments/SHIPMENT_ID
# Expected: {"success":true,"message":"Shipment deleted successfully"}
```

---

### ✅ Frontend UI Tests

#### Admin Dashboard Tests

1. **Admin Home** (`/admin`)
   - [ ] Live stats cards show real numbers
   - [ ] Recent shipments table shows last 5 shipments
   - [ ] Loading spinner appears while fetching
   - [ ] Fallback to mock data if backend unavailable

2. **Admin Shipments** (`/admin/shipments`)
   - [ ] Table loads with real shipments
   - [ ] Pagination controls work (Prev/Next)
   - [ ] Status filter tabs work (All, Pending, In Transit, etc.)
   - [ ] Search box filters by tracking ID, sender, receiver, city
   - [ ] Checkbox selection works
   - [ ] "Mark Delivered" button updates selected shipments
   - [ ] Delete button (trash icon) deletes shipment with confirmation
   - [ ] "Export CSV" downloads CSV file
   - [ ] Refresh button reloads data
   - [ ] Expandable rows show full details
   - [ ] "View Full Details" link works

3. **Admin Analytics** (`/admin/analytics`)
   - [ ] Live stats cards show real numbers
   - [ ] Status distribution pie chart shows real data
   - [ ] Loading spinner appears while fetching
   - [ ] Mock trend charts display (Revenue, Volume, Efficiency)

#### User Dashboard Tests

4. **User Home** (`/user-dashboard`)
   - [ ] Greeting shows correct time of day
   - [ ] Live stats summary in subtitle
   - [ ] Flip cards show live shipment counts
   - [ ] Recent shipments (last 3) display
   - [ ] Quick actions buttons work
   - [ ] Performance metrics display

5. **My Shipments** (`/user-dashboard/my-shipments`)
   - [ ] Card grid loads with real shipments
   - [ ] Tab filtering works (All, Pending, In Transit, etc.)
   - [ ] Search box filters shipments
   - [ ] Pagination works
   - [ ] "New Shipment" button links to create page
   - [ ] Refresh button reloads data
   - [ ] Cards link to shipment details

6. **Track Package** (`/user-dashboard/track`)
   - [ ] Search by tracking ID works
   - [ ] URL parameter `?id=TRACKING_ID` auto-loads shipment
   - [ ] Shipment details display correctly
   - [ ] Event timeline shows all events
   - [ ] "Copy Tracking Link" button copies URL
   - [ ] Error message for not found
   - [ ] Empty state shows when no search

7. **Delivery History** (`/user-dashboard/history`)
   - [ ] Shows only delivered shipments
   - [ ] Pagination works
   - [ ] "Export CSV" downloads history
   - [ ] "View" button links to shipment details
   - [ ] Empty state shows if no history

#### Operator Dashboard Tests

8. **Dashboard Home** (`/dashboard`)
   - [ ] Live stat cards show real numbers
   - [ ] Quick access buttons work
   - [ ] Status breakdown bars animate
   - [ ] Error message if backend unavailable

#### Logistics Tests (Already Working)

9. **Logistics List** (`/logistics`)
   - [ ] Loads shipments from API
   - [ ] Search and filter work
   - [ ] Stats cards show live data

10. **Create Shipment** (`/logistics/create`)
    - [ ] Form validation works
    - [ ] Submission creates shipment
    - [ ] Success message shows
    - [ ] Redirects to logistics list

11. **Track Shipment** (`/logistics/track`)
    - [ ] Public tracking works (no auth)
    - [ ] Timeline displays events

12. **Shipment Details** (`/logistics/[id]`)
    - [ ] Details load correctly
    - [ ] Edit mode works
    - [ ] Update saves changes

13. **Supply Chain** (`/supply-chain`)
    - [ ] Risk scores display
    - [ ] Route optimization works

---

### ✅ Error Handling Tests

1. **Backend Down**
   - [ ] Stop backend server
   - [ ] Visit `/admin` - should show error message
   - [ ] Visit `/dashboard` - should show error message
   - [ ] Visit `/user-dashboard` - should show loading then error

2. **Invalid Tracking ID**
   - [ ] Search for "INVALID123" in track page
   - [ ] Should show "Shipment not found" error

3. **Network Error**
   - [ ] Disconnect internet
   - [ ] Try to load any page
   - [ ] Should show network error message

---

### ✅ CSV Export Tests

1. **Admin Shipments Export**
   - [ ] Go to `/admin/shipments`
   - [ ] Click "Export CSV"
   - [ ] File downloads with name `shipments-YYYY-MM-DD.csv`
   - [ ] Open file - should have headers and data

2. **User History Export**
   - [ ] Go to `/user-dashboard/history`
   - [ ] Click "Export CSV"
   - [ ] File downloads with name `delivery-history-YYYY-MM-DD.csv`
   - [ ] Open file - should have delivered shipments only

---

### ✅ Pagination Tests

1. **Admin Shipments Pagination**
   - [ ] Create 25+ shipments (or use existing data)
   - [ ] Go to `/admin/shipments`
   - [ ] Should show "Page 1 of 2" (or more)
   - [ ] Click "Next" - should load page 2
   - [ ] Click numbered page button - should jump to that page
   - [ ] Click "Prev" - should go back

2. **User Shipments Pagination**
   - [ ] Go to `/user-dashboard/my-shipments`
   - [ ] If 12+ shipments exist, pagination should appear
   - [ ] Test Prev/Next buttons

---

### ✅ Bulk Operations Tests

1. **Bulk Mark as Delivered**
   - [ ] Go to `/admin/shipments`
   - [ ] Select 2-3 shipments using checkboxes
   - [ ] Click "Mark Delivered (X)" button
   - [ ] Shipments should update to Delivered status
   - [ ] Selection should clear

2. **Select All**
   - [ ] Click checkbox in table header
   - [ ] All visible shipments should be selected
   - [ ] Click again - all should deselect

---

### ✅ Delete Tests

1. **Single Delete**
   - [ ] Go to `/admin/shipments`
   - [ ] Click trash icon on a shipment
   - [ ] Confirmation dialog appears
   - [ ] Click OK - shipment disappears from list
   - [ ] Verify it's gone from database

---

### ✅ Search & Filter Tests

1. **Status Filter**
   - [ ] Go to `/admin/shipments`
   - [ ] Click "In Transit" tab
   - [ ] Only In Transit shipments show
   - [ ] Click "All" - all shipments show again

2. **Search**
   - [ ] Type tracking ID in search box
   - [ ] Results filter in real-time
   - [ ] Type sender name - results filter
   - [ ] Clear search - all results return

---

### ✅ Loading States Tests

1. **Spinners**
   - [ ] Refresh any page with live data
   - [ ] Loading spinner should appear briefly
   - [ ] Data should load and spinner disappear

2. **Skeleton States**
   - [ ] Check admin analytics page
   - [ ] Stat cards should show spinner while loading

---

### ✅ Responsive Design Tests

1. **Mobile View**
   - [ ] Resize browser to mobile width (< 768px)
   - [ ] Sidebar should collapse
   - [ ] Tables should scroll horizontally
   - [ ] Cards should stack vertically
   - [ ] All buttons should be tappable

2. **Tablet View**
   - [ ] Resize to tablet width (768px - 1024px)
   - [ ] Layout should adapt
   - [ ] Grid columns should adjust

---

## Common Issues & Solutions

### Backend won't start
- Check `.env` file exists and has valid Supabase credentials
- Verify Supabase project is active
- Check port 3001 is not in use: `lsof -i :3001`

### Frontend shows "Cannot reach backend"
- Verify backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in frontend (defaults to localhost:3001)
- Check browser console for CORS errors

### No shipments showing
- Run the SQL schema in Supabase SQL Editor (`backend/sql/logistics-schema.sql`)
- Create a test shipment via `/logistics/create`
- Check backend logs for errors

### Pagination not working
- Need 20+ shipments for admin pagination
- Need 12+ shipments for user pagination
- Create more test shipments if needed

### CSV export empty
- Make sure shipments exist in database
- Check browser downloads folder
- Check browser console for errors

---

## Performance Benchmarks

Expected load times (with 100 shipments in DB):
- Admin dashboard: < 500ms
- Admin shipments list: < 800ms
- User dashboard: < 500ms
- Track page: < 300ms
- Create shipment: < 400ms

If slower, check:
- Database indexes are created
- Backend is not in debug mode
- Network latency to Supabase

---

## Browser Compatibility

Tested on:
- ✅ Chrome 120+
- ✅ Firefox 120+
- ✅ Safari 17+
- ✅ Edge 120+

---

## Accessibility

- [ ] All buttons have proper labels
- [ ] Form inputs have labels
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Screen reader friendly (test with VoiceOver/NVDA)

---

**Last Updated:** April 28, 2026
