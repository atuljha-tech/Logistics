-- Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id TEXT UNIQUE NOT NULL,
  sender_name TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_address TEXT NOT NULL,
  sender_pincode TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  recipient_address TEXT NOT NULL,
  recipient_pincode TEXT NOT NULL,
  origin_city TEXT NOT NULL,
  destination_city TEXT NOT NULL,
  item_description TEXT NOT NULL,
  item_weight DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  estimated_delivery DATE,
  current_location TEXT,
  current_lat DECIMAL(10,8),
  current_lng DECIMAL(11,8),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create shipment_events table for tracking history
CREATE TABLE IF NOT EXISTS shipment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  location TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  details TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_id ON shipments(tracking_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipment_events_shipment_id ON shipment_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipment_events_timestamp ON shipment_events(timestamp);

-- Insert sample shipments with Indian data
INSERT INTO shipments (
  tracking_id, sender_name, sender_phone, sender_email, sender_address,
  sender_pincode, recipient_name, recipient_phone, recipient_address,
  recipient_pincode, origin_city, destination_city, item_description,
  item_weight, status, estimated_delivery, current_location,
  current_lat, current_lng
) VALUES
  (
    'IND' || to_char(NOW(), 'YYYYMMDDHHmmss') || '001',
    'Rajesh Kumar', '+91-9876543210', 'rajesh@email.com',
    '123 MG Road, Bangalore', '560001',
    'Priya Sharma', '+91-9123456789', '456 Marine Drive, Mumbai',
    '400001', 'Bangalore', 'Mumbai', 'Electronics - Laptop', 2.5,
    'In Transit', NOW() + INTERVAL '3 days', 'Nashik Highway',
    19.1136, 73.8550
  ),
  (
    'IND' || to_char(NOW(), 'YYYYMMDDHHmmss') || '002',
    'Amit Patel', '+91-8765432109', 'amit@email.com',
    '789 Bandra Kurla, Mumbai', '400051',
    'Neha Singh', '+91-9012345678', '321 Connaught Place, Delhi',
    '110001', 'Mumbai', 'Delhi', 'Documents Bundle', 0.5,
    'Out for Delivery', NOW() + INTERVAL '1 day', 'Delhi Outskirts',
    28.7041, 77.1025
  ),
  (
    'IND' || to_char(NOW(), 'YYYYMMDDHHmmss') || '003',
    'Vijay Reddy', '+91-7654321098', 'vijay@email.com',
    '654 Hitech City, Hyderabad', '500081',
    'Sarah Khan', '+91-8901234567', '789 Powder Mill Road, Bangalore',
    '560029', 'Hyderabad', 'Bangalore', 'Fashion Items', 1.2,
    'Delivered', NOW() - INTERVAL '2 days', 'Bangalore',
    12.9716, 77.5946
  ),
  (
    'IND' || to_char(NOW(), 'YYYYMMDDHHmmss') || '004',
    'Anita Gupta', '+91-6543210987', 'anita@email.com',
    '456 Salt Lake, Kolkata', '700064',
    'Ravi Desai', '+91-7890123456', '567 Airoli, Navi Mumbai',
    '400708', 'Kolkata', 'Navi Mumbai', 'Books & Stationery', 3.0,
    'Pending', NOW() + INTERVAL '5 days', 'Kolkata Hub',
    22.5726, 88.3639
  ),
  (
    'IND' || to_char(NOW(), 'YYYYMMDDHHmmss') || '005',
    'Suresh Menon', '+91-5432109876', 'suresh@email.com',
    '123 Whitefield, Bangalore', '560066',
    'Deepa Rao', '+91-6789012345', '890 Electronics City, Bangalore',
    '560100', 'Bangalore', 'Bangalore', 'Computer Peripherals', 2.1,
    'Delivered', NOW() - INTERVAL '1 day', 'Bangalore',
    12.9352, 77.6245
  );

-- Insert sample events for tracking history
INSERT INTO shipment_events (shipment_id, event_type, location, details) 
SELECT id, 'Pickup', sender_address || ', ' || origin_city, 'Package picked up from sender'
FROM shipments LIMIT 5;

INSERT INTO shipment_events (shipment_id, event_type, location, details)
SELECT id, 'In Transit', 'Distribution Hub - ' || origin_city, 'Package at origin hub'
FROM shipments WHERE status IN ('In Transit', 'Out for Delivery', 'Delivered') LIMIT 5;

INSERT INTO shipment_events (shipment_id, event_type, location, details)
SELECT id, 'Out for Delivery', 'Local Delivery Center', 'Package out for delivery'
FROM shipments WHERE status IN ('Out for Delivery', 'Delivered') LIMIT 3;

INSERT INTO shipment_events (shipment_id, event_type, location, details)
SELECT id, 'Delivered', recipient_address || ', ' || destination_city, 'Package delivered successfully'
FROM shipments WHERE status = 'Delivered' LIMIT 2;

ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_public_tracking" ON shipments;
CREATE POLICY "allow_public_tracking" ON shipments
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "allow_public_event_read" ON shipment_events;
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
