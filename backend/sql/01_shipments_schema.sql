-- Shipments table for tracking shipments
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id VARCHAR(20) UNIQUE NOT NULL,
  
  -- Sender info
  sender_name VARCHAR(255) NOT NULL,
  sender_phone VARCHAR(20) NOT NULL,
  sender_address TEXT NOT NULL,
  sender_city VARCHAR(100) NOT NULL,
  sender_pincode VARCHAR(10) NOT NULL,
  
  -- Receiver info
  receiver_name VARCHAR(255) NOT NULL,
  receiver_phone VARCHAR(20) NOT NULL,
  receiver_address TEXT NOT NULL,
  receiver_city VARCHAR(100) NOT NULL,
  receiver_pincode VARCHAR(10) NOT NULL,
  
  -- Shipment details
  package_type VARCHAR(100) NOT NULL,
  weight DECIMAL(10, 2) NOT NULL,
  value DECIMAL(12, 2),
  description TEXT,
  
  -- Current status and location
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  current_location VARCHAR(255),
  current_lat DECIMAL(10, 8),
  current_lng DECIMAL(11, 8),
  
  -- Agent and vehicle info
  assigned_agent VARCHAR(255),
  vehicle_number VARCHAR(50),
  vehicle_type VARCHAR(50),
  
  -- Dates
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pickup_date TIMESTAMP WITH TIME ZONE,
  estimated_delivery TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_delivery TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on tracking_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_tracking_id ON shipments(tracking_id);
CREATE INDEX IF NOT EXISTS idx_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_created_at ON shipments(created_at DESC);

-- Shipment events table for tracking history
CREATE TABLE IF NOT EXISTS shipment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  
  -- Event details
  status VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Event info
  event_type VARCHAR(100),
  description TEXT,
  agent_name VARCHAR(255),
  
  -- Timestamp
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_shipment FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);

-- Create index on shipment_id and created_at for efficient queries
CREATE INDEX IF NOT EXISTS idx_shipment_events_shipment_id ON shipment_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipment_events_created_at ON shipment_events(created_at DESC);

-- Insert sample shipments
INSERT INTO shipments (
  tracking_id, sender_name, sender_phone, sender_address, sender_city, sender_pincode,
  receiver_name, receiver_phone, receiver_address, receiver_city, receiver_pincode,
  package_type, weight, value, description, status, current_location, 
  current_lat, current_lng, estimated_delivery
) VALUES
(
  'IND' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS') || '0001',
  'Rahul Sharma',
  '+91-9876543210',
  '123 Fort Road, Kala Ghoda',
  'Mumbai',
  '400001',
  'Priya Verma',
  '+91-9123456789',
  '456 MG Road, Whitefield',
  'Bangalore',
  '560001',
  'Electronics',
  2.5,
  15000,
  'Laptop Computer',
  'In Transit',
  'Delhi Distribution Hub',
  28.6139,
  77.2090,
  NOW() + INTERVAL '3 days'
),
(
  'IND' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS') || '0002',
  'Amit Patel',
  '+91-8765432109',
  '789 Brigade Road',
  'Bangalore',
  '560025',
  'Neha Gupta',
  '+91-9876543098',
  '321 Park Street',
  'Kolkata',
  '700016',
  'Documents',
  0.5,
  5000,
  'Business Documents',
  'Out for Delivery',
  'Kolkata Local Area',
  22.5726,
  88.3639,
  NOW() + INTERVAL '1 day'
),
(
  'IND' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS') || '0003',
  'Vikram Singh',
  '+91-7654321098',
  '555 Connaught Place',
  'Delhi',
  '110001',
  'Anjali Desai',
  '+91-8765432109',
  '789 Bund Garden Road',
  'Pune',
  '411001',
  'Clothing',
  1.8,
  8000,
  'Winter Clothing',
  'Pending',
  'Delhi Hub',
  28.6139,
  77.2090,
  NOW() + INTERVAL '5 days'
),
(
  'IND' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS') || '0004',
  'Swati Nair',
  '+91-6543210987',
  '321 Anna Salai',
  'Chennai',
  '600002',
  'Ravi Kumar',
  '+91-9123456780',
  '654 Shivaji Nagar',
  'Hyderabad',
  '500003',
  'Food Items',
  3.2,
  2000,
  'Organic Spices',
  'Delivered',
  'Hyderabad',
  17.3850,
  78.4867,
  NOW() - INTERVAL '1 day'
),
(
  'IND' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS') || '0005',
  'Karan Malhotra',
  '+91-5432109876',
  '777 Dadar East',
  'Mumbai',
  '400014',
  'Divya Pant',
  '+91-8765432107',
  '222 Jaydev Vihar',
  'Bhubaneswar',
  '751013',
  'Books & Media',
  4.5,
  12000,
  'Book Collection',
  'In Transit',
  'Hyderabad Hub',
  17.3850,
  78.4867,
  NOW() + INTERVAL '4 days'
);

-- Insert sample events for tracking
INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, event_type, description, agent_name, occurred_at)
SELECT id, 'Pending', 'Delhi Pickup Hub', 28.6139, 77.2090, 'PICKUP', 'Package picked up from sender', 'Raj Kumar', NOW() - INTERVAL '2 days'
FROM shipments WHERE tracking_id LIKE '%0001%'
UNION ALL
SELECT id, 'In Transit', 'Delhi to Hyderabad Route', 28.6139, 77.2090, 'TRANSIT', 'Package in transit', NULL, NOW() - INTERVAL '1 day'
FROM shipments WHERE tracking_id LIKE '%0001%'
UNION ALL
SELECT id, 'In Transit', 'Delhi Distribution Hub', 28.6139, 77.2090, 'HUB_SORT', 'Sorted at Delhi hub', 'Aman Singh', NOW() - INTERVAL '12 hours'
FROM shipments WHERE tracking_id LIKE '%0001%'
UNION ALL
SELECT id, 'Out for Delivery', 'Kolkata Local Area', 22.5726, 88.3639, 'OUT_FOR_DELIVERY', 'Out for delivery', 'Mohan Das', NOW()
FROM shipments WHERE tracking_id LIKE '%0002%'
UNION ALL
SELECT id, 'Delivered', 'Hyderabad', 17.3850, 78.4867, 'DELIVERED', 'Package delivered successfully', 'Suresh Reddy', NOW() - INTERVAL '1 day'
FROM shipments WHERE tracking_id LIKE '%0004%';

-- Enable RLS (Row Level Security) if needed
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_events ENABLE ROW LEVEL SECURITY;

-- Optional: Create policies for public tracking (read-only)
CREATE POLICY "allow_public_tracking" ON shipments
  FOR SELECT USING (true);

CREATE POLICY "allow_public_event_read" ON shipment_events
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert shipments" ON shipments;
CREATE POLICY "Public can insert shipments"
ON shipments FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update shipments" ON shipments;
CREATE POLICY "Public can update shipments"
ON shipments FOR UPDATE
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert shipment events" ON shipment_events;
CREATE POLICY "Public can insert shipment events"
ON shipment_events FOR INSERT
WITH CHECK (true);
