-- Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_id VARCHAR(50) UNIQUE NOT NULL DEFAULT ('IND' || to_char(NOW(), 'YYMMDDHHmmss') || LPAD(CAST(FLOOR(RANDOM() * 10000) AS TEXT), 4, '0')),
  sender_name VARCHAR(100) NOT NULL,
  sender_phone VARCHAR(20) NOT NULL,
  sender_address TEXT NOT NULL,
  sender_pincode VARCHAR(10) NOT NULL,
  receiver_name VARCHAR(100) NOT NULL,
  receiver_phone VARCHAR(20) NOT NULL,
  receiver_address TEXT NOT NULL,
  receiver_pincode VARCHAR(10) NOT NULL,
  package_type VARCHAR(50) NOT NULL DEFAULT 'Electronics',
  weight DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Transit', 'Out for Delivery', 'Delivered')),
  current_lat DECIMAL(10, 8),
  current_lng DECIMAL(11, 8),
  estimated_delivery DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create shipment_events table for tracking history
CREATE TABLE IF NOT EXISTS shipment_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(200) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description TEXT
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_id ON shipments(tracking_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipment_events_shipment_id ON shipment_events(shipment_id);

-- Seed data with Indian names and cities
INSERT INTO shipments (sender_name, sender_phone, sender_address, sender_pincode, receiver_name, receiver_phone, receiver_address, receiver_pincode, package_type, weight, status, current_lat, current_lng, estimated_delivery) VALUES
('Rahul Sharma', '+91-9876543210', '123 MG Road, Bangalore Tech Park', '560001', 'Priya Verma', '+91-8765432109', '456 Park Street, Kolkata', '700001', 'Electronics', 2.5, 'In Transit', 19.0760, 72.8777, '2024-01-22'),
('Arjun Singh', '+91-9123456789', '789 Cyber City, Hyderabad', '500001', 'Neha Gupta', '+91-7654321098', '321 Marina Beach Road, Chennai', '600001', 'Documents', 0.5, 'Out for Delivery', 13.0499, 80.2624, '2024-01-20'),
('Vikram Patel', '+91-8765432101', '567 Bandra Complex, Mumbai', '400001', 'Anjali Desai', '+91-9876501234', '789 Connaught Place, Delhi', '110001', 'Clothing', 3.2, 'Delivered', 28.6139, 77.2090, '2024-01-18'),
('Sanjay Kumar', '+91-9998887776', '234 IT Park, Pune', '411001', 'Divya Reddy', '+91-8765432199', '654 MG Road Extension, Bangalore', '560027', 'Food Items', 1.8, 'Pending', 19.0825, 72.7411, '2024-01-25'),
('Isha Kapoor', '+91-7654321234', '890 Kala Ghoda, Mumbai', '400001', 'Rohan Malhotra', '+91-9876543321', '432 Green Park, Delhi', '110016', 'Electronics', 4.1, 'In Transit', 19.2183, 72.8537, '2024-01-23');

-- Insert tracking events for shipment history
INSERT INTO shipment_events (shipment_id, status, location, latitude, longitude, description) VALUES
((SELECT id FROM shipments WHERE tracking_id LIKE 'IND%' ORDER BY created_at ASC LIMIT 1), 'Pending', 'Bangalore Warehouse', 12.9716, 77.5946, 'Package received and sorted'),
((SELECT id FROM shipments WHERE tracking_id LIKE 'IND%' ORDER BY created_at ASC LIMIT 1), 'In Transit', 'Hyderabad Hub', 17.3850, 78.4867, 'Shipped from origin facility'),
((SELECT id FROM shipments WHERE tracking_id LIKE 'IND%' ORDER BY created_at ASC LIMIT 1 OFFSET 1), 'Out for Delivery', 'Chennai Local Center', 13.0499, 80.2624, 'Out for delivery today'),
((SELECT id FROM shipments WHERE tracking_id LIKE 'IND%' ORDER BY created_at ASC LIMIT 1 OFFSET 2), 'Delivered', 'Delhi Main Hub', 28.6139, 77.2090, 'Package delivered successfully'),
((SELECT id FROM shipments WHERE tracking_id LIKE 'IND%' ORDER BY created_at ASC LIMIT 1 OFFSET 3), 'Pending', 'Pune Sorting Center', 18.5204, 73.8567, 'Package registered in system');

-- Enable RLS (Row Level Security) if needed
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_events ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to tracking
CREATE POLICY "Public can view shipments by tracking_id" 
ON shipments FOR SELECT 
USING (true);

CREATE POLICY "Public can view events for any shipment"
ON shipment_events FOR SELECT
USING (true);

-- Write policies for development create/update flows
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
