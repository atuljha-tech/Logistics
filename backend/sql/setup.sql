-- ============================================================
-- SmartLogistics — Full Database Setup
-- Run this in Supabase SQL Editor
-- ============================================================

-- ─── Drop existing tables (clean slate) ──────────────────────
DROP TABLE IF EXISTS shipment_events CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;

-- ─── shipments table ─────────────────────────────────────────
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id VARCHAR(30) UNIQUE NOT NULL,

  -- Sender
  sender_name VARCHAR(255) NOT NULL,
  sender_phone VARCHAR(20) NOT NULL,
  sender_address TEXT NOT NULL,
  sender_city VARCHAR(100),
  sender_pincode VARCHAR(10) NOT NULL,

  -- Receiver
  receiver_name VARCHAR(255) NOT NULL,
  receiver_phone VARCHAR(20) NOT NULL,
  receiver_address TEXT NOT NULL,
  receiver_city VARCHAR(100),
  receiver_pincode VARCHAR(10) NOT NULL,

  -- Package
  package_type VARCHAR(100) NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  value DECIMAL(12,2),
  description TEXT,

  -- Status & location
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  current_location VARCHAR(255),
  current_lat DECIMAL(10,8),
  current_lng DECIMAL(11,8),

  -- Agent & vehicle
  assigned_agent VARCHAR(255),
  vehicle_number VARCHAR(50),
  vehicle_type VARCHAR(50),

  -- Dates
  estimated_delivery TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_delivery TIMESTAMP WITH TIME ZONE,
  pickup_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── shipment_events table ────────────────────────────────────
CREATE TABLE shipment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  event_type VARCHAR(100),
  description TEXT,
  agent_name VARCHAR(255),
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── Indexes ──────────────────────────────────────────────────
CREATE INDEX idx_shipments_tracking_id ON shipments(tracking_id);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_created_at ON shipments(created_at DESC);
CREATE INDEX idx_shipments_sender_city ON shipments(sender_city);
CREATE INDEX idx_shipments_receiver_city ON shipments(receiver_city);
CREATE INDEX idx_events_shipment_id ON shipment_events(shipment_id);
CREATE INDEX idx_events_occurred_at ON shipment_events(occurred_at DESC);

-- ─── RLS ──────────────────────────────────────────────────────
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_events ENABLE ROW LEVEL SECURITY;

-- Allow all operations (anon key — dev mode)
CREATE POLICY "public_select_shipments" ON shipments FOR SELECT USING (true);
CREATE POLICY "public_insert_shipments" ON shipments FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_shipments" ON shipments FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_shipments" ON shipments FOR DELETE USING (true);

CREATE POLICY "public_select_events" ON shipment_events FOR SELECT USING (true);
CREATE POLICY "public_insert_events" ON shipment_events FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_events" ON shipment_events FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_events" ON shipment_events FOR DELETE USING (true);

-- ─── Seed Data — 10 realistic Indian shipments ───────────────
INSERT INTO shipments (
  tracking_id, sender_name, sender_phone, sender_address, sender_city, sender_pincode,
  receiver_name, receiver_phone, receiver_address, receiver_city, receiver_pincode,
  package_type, weight, value, description, status, current_location,
  current_lat, current_lng, assigned_agent, vehicle_number, vehicle_type,
  estimated_delivery, created_at, updated_at
) VALUES
(
  'IND202604280001', 'Rajesh Kumar', '+91-9876543210',
  '123 MG Road, Bandra', 'Mumbai', '400050',
  'Priya Sharma', '+91-9123456789', '456 Connaught Place', 'Delhi', '110001',
  'Electronics', 2.5, 45000, 'Laptop - Dell XPS 15',
  'In Transit', 'Jaipur Transit Hub', 26.9124, 75.7873,
  'Amit Singh', 'MH-01-AB-1234', 'Truck',
  NOW() + INTERVAL '2 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'
),
(
  'IND202604280002', 'Amit Patel', '+91-8765432109',
  '789 Bandra Kurla Complex', 'Mumbai', '400051',
  'Neha Singh', '+91-9012345678', '321 Hitech City', 'Hyderabad', '500081',
  'Documents', 0.5, 500, 'Legal Documents Bundle',
  'Pending', 'Mumbai Pickup Hub', 19.0760, 72.8777,
  NULL, NULL, NULL,
  NOW() + INTERVAL '4 days', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
),
(
  'IND202604280003', 'Vijay Reddy', '+91-7654321098',
  '654 Hitech City', 'Hyderabad', '500081',
  'Sarah Khan', '+91-8901234567', '789 Koramangala', 'Bangalore', '560034',
  'Clothing', 1.2, 3500, 'Fashion Items - Summer Collection',
  'Delivered', 'Bangalore Delivery Hub', 12.9716, 77.5946,
  'Ravi Kumar', 'KA-01-CD-5678', 'Bike',
  NOW() - INTERVAL '2 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '2 days'
),
(
  'IND202604280004', 'Anita Gupta', '+91-6543210987',
  '101 Sector 18', 'Noida', '201301',
  'Suresh Mehta', '+91-7890123456', '202 Salt Lake', 'Kolkata', '700091',
  'Food Items', 3.0, 1200, 'Organic Spices and Dry Fruits',
  'Out for Delivery', 'Kolkata Outskirts', 22.5726, 88.3639,
  'Deepak Roy', 'WB-01-EF-9012', 'Van',
  NOW() + INTERVAL '4 hours', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 hour'
),
(
  'IND202604280005', 'Kavya Nair', '+91-9988776655',
  '55 Marine Drive', 'Kochi', '682001',
  'Arjun Pillai', '+91-8877665544', '77 Anna Nagar', 'Chennai', '600040',
  'Books & Media', 4.0, 2800, 'Engineering Textbooks - 8 volumes',
  'In Transit', 'Coimbatore Transit Hub', 11.0168, 76.9558,
  'Murugan S', 'TN-01-GH-3456', 'Truck',
  NOW() + INTERVAL '1 day', NOW() - INTERVAL '4 days', NOW() - INTERVAL '12 hours'
),
(
  'IND202604280006', 'Rohit Joshi', '+91-7766554433',
  '33 FC Road', 'Pune', '411004',
  'Meera Desai', '+91-6655443322', '44 CG Road', 'Ahmedabad', '380009',
  'Electronics', 5.5, 85000, 'Camera Equipment - DSLR Kit',
  'Delivered', 'Ahmedabad Delivery Hub', 23.0225, 72.5714,
  'Kiran Patel', 'GJ-01-IJ-7890', 'Van',
  NOW() - INTERVAL '1 day', NOW() - INTERVAL '6 days', NOW() - INTERVAL '1 day'
),
(
  'IND202604280007', 'Sanjay Verma', '+91-5544332211',
  '88 Civil Lines', 'Jaipur', '302006',
  'Pooja Agarwal', '+91-4433221100', '99 Hazratganj', 'Lucknow', '226001',
  'Clothing', 2.0, 6500, 'Wedding Attire - Sarees and Lehengas',
  'Pending', 'Jaipur Pickup Hub', 26.9124, 75.7873,
  NULL, NULL, NULL,
  NOW() + INTERVAL '3 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'
),
(
  'IND202604280008', 'Divya Krishnan', '+91-3322110099',
  '11 Adyar', 'Chennai', '600020',
  'Vikram Rao', '+91-2211009988', '22 Banjara Hills', 'Hyderabad', '500034',
  'Electronics', 8.0, 120000, 'Server Hardware Components',
  'In Transit', 'Nellore Transit Hub', 14.4426, 79.9865,
  'Prasad T', 'AP-01-KL-1234', 'Truck',
  NOW() + INTERVAL '1 day', NOW() - INTERVAL '3 days', NOW() - INTERVAL '6 hours'
),
(
  'IND202604280009', 'Pradeep Nair', '+91-9900112233',
  '5 Residency Road', 'Bangalore', '560025',
  'Sunita Rao', '+91-8800223344', '10 Jubilee Hills', 'Hyderabad', '500033',
  'Food Items', 6.0, 4500, 'Premium Dry Fruits Gift Box',
  'Out for Delivery', 'Hyderabad City Hub', 17.4065, 78.4772,
  'Raju M', 'TS-01-MN-5678', 'Bike',
  NOW() + INTERVAL '3 hours', NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 hours'
),
(
  'IND202604280010', 'Meena Iyer', '+91-7711223344',
  '20 Besant Nagar', 'Chennai', '600090',
  'Arun Kumar', '+91-6611334455', '30 Indiranagar', 'Bangalore', '560038',
  'Books & Media', 3.5, 1800, 'Medical Reference Books',
  'Delivered', 'Bangalore Hub', 12.9784, 77.6408,
  'Suresh B', 'KA-02-OP-9012', 'Bike',
  NOW() - INTERVAL '3 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '3 days'
);

-- ─── Seed Events ──────────────────────────────────────────────

-- IND202604280001 (In Transit) — 4 events
INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'Pending', 'Mumbai Pickup Hub', 19.0760, 72.8777, 'CREATED', 'Shipment created and registered', NULL, created_at
FROM shipments WHERE tracking_id = 'IND202604280001';

INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'Pending', 'Mumbai Pickup Hub', 19.0760, 72.8777, 'PICKUP', 'Package picked up from sender', 'Amit Singh', created_at + INTERVAL '4 hours'
FROM shipments WHERE tracking_id = 'IND202604280001';

INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'In Transit', 'Mumbai Sorting Hub', 19.0760, 72.8777, 'HUB_SORT', 'Sorted at Mumbai hub, dispatched to Delhi', 'Amit Singh', created_at + INTERVAL '8 hours'
FROM shipments WHERE tracking_id = 'IND202604280001';

INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'In Transit', 'Jaipur Transit Hub', 26.9124, 75.7873, 'TRANSIT', 'Package in transit via Jaipur', NULL, created_at + INTERVAL '24 hours'
FROM shipments WHERE tracking_id = 'IND202604280001';

-- IND202604280003 (Delivered) — 6 events
INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'Pending', 'Hyderabad Pickup Hub', 17.3850, 78.4867, 'CREATED', 'Shipment created and registered', NULL, created_at
FROM shipments WHERE tracking_id = 'IND202604280003';

INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'Pending', 'Hyderabad Pickup Hub', 17.3850, 78.4867, 'PICKUP', 'Package picked up from sender', 'Ravi Kumar', created_at + INTERVAL '3 hours'
FROM shipments WHERE tracking_id = 'IND202604280003';

INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'In Transit', 'Hyderabad Sorting Hub', 17.3850, 78.4867, 'HUB_SORT', 'Sorted at Hyderabad hub', 'Ravi Kumar', created_at + INTERVAL '6 hours'
FROM shipments WHERE tracking_id = 'IND202604280003';

INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'In Transit', 'Kurnool Transit Hub', 15.8281, 78.0373, 'TRANSIT', 'In transit via Kurnool', NULL, created_at + INTERVAL '18 hours'
FROM shipments WHERE tracking_id = 'IND202604280003';

INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'Out for Delivery', 'Bangalore City Hub', 12.9716, 77.5946, 'OUT_FOR_DELIVERY', 'Out for delivery in Bangalore', 'Ravi Kumar', created_at + INTERVAL '36 hours'
FROM shipments WHERE tracking_id = 'IND202604280003';

INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'Delivered', '789 Koramangala, Bangalore', 12.9716, 77.5946, 'DELIVERED', 'Package delivered successfully. Signed by Sarah Khan', 'Ravi Kumar', created_at + INTERVAL '48 hours'
FROM shipments WHERE tracking_id = 'IND202604280003';

-- IND202604280004 (Out for Delivery) — 4 events
INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'Pending', 'Noida Pickup Hub', 28.5355, 77.3910, 'CREATED', 'Shipment created and registered', NULL, created_at
FROM shipments WHERE tracking_id = 'IND202604280004';

INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'Pending', 'Noida Pickup Hub', 28.5355, 77.3910, 'PICKUP', 'Package picked up from sender', 'Deepak Roy', created_at + INTERVAL '5 hours'
FROM shipments WHERE tracking_id = 'IND202604280004';

INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'In Transit', 'Patna Transit Hub', 25.5941, 85.1376, 'TRANSIT', 'In transit via Patna', NULL, created_at + INTERVAL '30 hours'
FROM shipments WHERE tracking_id = 'IND202604280004';

INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'Out for Delivery', 'Kolkata Outskirts', 22.5726, 88.3639, 'OUT_FOR_DELIVERY', 'Out for delivery in Kolkata', 'Deepak Roy', created_at + INTERVAL '48 hours'
FROM shipments WHERE tracking_id = 'IND202604280004';

-- IND202604280006 (Delivered) — 5 events
INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'Pending', 'Pune Pickup Hub', 18.5204, 73.8567, 'CREATED', 'Shipment created and registered', NULL, created_at
FROM shipments WHERE tracking_id = 'IND202604280006';

INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'Pending', 'Pune Pickup Hub', 18.5204, 73.8567, 'PICKUP', 'Package picked up from sender', 'Kiran Patel', created_at + INTERVAL '4 hours'
FROM shipments WHERE tracking_id = 'IND202604280006';

INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'In Transit', 'Nashik Transit Hub', 19.9975, 73.7898, 'TRANSIT', 'In transit via Nashik', NULL, created_at + INTERVAL '12 hours'
FROM shipments WHERE tracking_id = 'IND202604280006';

INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'Out for Delivery', 'Ahmedabad City Hub', 23.0225, 72.5714, 'OUT_FOR_DELIVERY', 'Out for delivery in Ahmedabad', 'Kiran Patel', created_at + INTERVAL '28 hours'
FROM shipments WHERE tracking_id = 'IND202604280006';

INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'Delivered', '44 CG Road, Ahmedabad', 23.0225, 72.5714, 'DELIVERED', 'Package delivered successfully. Signed by Meera Desai', 'Kiran Patel', created_at + INTERVAL '36 hours'
FROM shipments WHERE tracking_id = 'IND202604280006';

-- IND202604280010 (Delivered) — 5 events
INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'Pending', 'Chennai Pickup Hub', 13.0827, 80.2707, 'CREATED', 'Shipment created and registered', NULL, created_at
FROM shipments WHERE tracking_id = 'IND202604280010';

INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'Pending', 'Chennai Pickup Hub', 13.0827, 80.2707, 'PICKUP', 'Package picked up from sender', 'Suresh B', created_at + INTERVAL '3 hours'
FROM shipments WHERE tracking_id = 'IND202604280010';

INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'In Transit', 'Vellore Transit Hub', 12.9165, 79.1325, 'TRANSIT', 'In transit via Vellore', NULL, created_at + INTERVAL '10 hours'
FROM shipments WHERE tracking_id = 'IND202604280010';

INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'Out for Delivery', 'Bangalore Hub', 12.9784, 77.6408, 'OUT_FOR_DELIVERY', 'Out for delivery in Bangalore', 'Suresh B', created_at + INTERVAL '20 hours'
FROM shipments WHERE tracking_id = 'IND202604280010';

INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'Delivered', '30 Indiranagar, Bangalore', 12.9784, 77.6408, 'DELIVERED', 'Package delivered successfully. Signed by Arun Kumar', 'Suresh B', created_at + INTERVAL '28 hours'
FROM shipments WHERE tracking_id = 'IND202604280010';

-- CREATED events for remaining shipments
INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'Pending', sender_city || ' Pickup Hub', current_lat, current_lng, 'CREATED', 'Shipment created and registered', NULL, created_at
FROM shipments WHERE tracking_id IN ('IND202604280002', 'IND202604280005', 'IND202604280007', 'IND202604280008', 'IND202604280009');
