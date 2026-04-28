-- Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id TEXT PRIMARY KEY,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in-transit',
  current_location TEXT,
  eta TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  route JSONB DEFAULT '[]',
  alternate_route JSONB DEFAULT '[]'
);

-- Insert seed data
INSERT INTO shipments (id, origin, destination, status, current_location, eta, route, alternate_route) VALUES
(
  'SHP-001',
  'New York',
  'Los Angeles',
  'in-transit',
  'Chicago',
  '2 days',
  '[{"city": "New York", "timestamp": "2024-01-15 08:30"}, {"city": "Chicago", "timestamp": "2024-01-16 14:20"}, {"city": "Denver", "timestamp": "2024-01-17 11:45"}, {"city": "Las Vegas", "timestamp": "2024-01-18 09:00"}, {"city": "Los Angeles", "timestamp": "2024-01-19 14:00"}]'::jsonb,
  '[{"city": "New York", "timestamp": "2024-01-15 08:30"}, {"city": "Pittsburgh", "timestamp": "2024-01-16 10:00"}, {"city": "St. Louis", "timestamp": "2024-01-17 08:00"}, {"city": "Santa Fe", "timestamp": "2024-01-18 06:00"}, {"city": "Los Angeles", "timestamp": "2024-01-19 12:00"}]'::jsonb
),
(
  'SHP-002',
  'Miami',
  'Seattle',
  'in-transit',
  'Atlanta',
  '3 days',
  '[{"city": "Miami", "timestamp": "2024-01-16 09:15"}, {"city": "Atlanta", "timestamp": "2024-01-17 16:30"}, {"city": "St. Louis", "timestamp": "2024-01-18 10:20"}, {"city": "Denver", "timestamp": "2024-01-19 08:00"}, {"city": "Seattle", "timestamp": "2024-01-20 14:00"}]'::jsonb,
  '[{"city": "Miami", "timestamp": "2024-01-16 09:15"}, {"city": "Jacksonville", "timestamp": "2024-01-16 14:00"}, {"city": "Charlotte", "timestamp": "2024-01-17 12:00"}, {"city": "Chicago", "timestamp": "2024-01-18 08:00"}, {"city": "Seattle", "timestamp": "2024-01-20 16:00"}]'::jsonb
),
(
  'SHP-003',
  'Boston',
  'San Francisco',
  'delivered',
  'San Francisco',
  'Delivered',
  '[{"city": "Boston", "timestamp": "2024-01-10 07:00"}, {"city": "Philadelphia", "timestamp": "2024-01-11 13:30"}, {"city": "Pittsburgh", "timestamp": "2024-01-12 15:45"}, {"city": "Chicago", "timestamp": "2024-01-13 18:00"}, {"city": "Denver", "timestamp": "2024-01-15 10:30"}, {"city": "San Francisco", "timestamp": "2024-01-17 11:20"}]'::jsonb,
  '[{"city": "Boston", "timestamp": "2024-01-10 07:00"}, {"city": "New York", "timestamp": "2024-01-10 14:00"}, {"city": "Washington DC", "timestamp": "2024-01-11 10:00"}, {"city": "Nashville", "timestamp": "2024-01-12 12:00"}, {"city": "Denver", "timestamp": "2024-01-14 16:00"}, {"city": "San Francisco", "timestamp": "2024-01-17 09:00"}]'::jsonb
),
(
  'SHP-004',
  'Dallas',
  'Portland',
  'delayed',
  'Kansas City',
  '4 days',
  '[{"city": "Dallas", "timestamp": "2024-01-14 06:00"}, {"city": "Oklahoma City", "timestamp": "2024-01-15 14:15"}, {"city": "Kansas City", "timestamp": "2024-01-18 09:30"}, {"city": "Denver", "timestamp": "2024-01-19 08:00"}, {"city": "Portland", "timestamp": "2024-01-21 14:00"}]'::jsonb,
  '[{"city": "Dallas", "timestamp": "2024-01-14 06:00"}, {"city": "Tulsa", "timestamp": "2024-01-14 16:00"}, {"city": "Kansas City", "timestamp": "2024-01-15 18:00"}, {"city": "Omaha", "timestamp": "2024-01-16 14:00"}, {"city": "Portland", "timestamp": "2024-01-19 16:00"}]'::jsonb
),
(
  'SHP-005',
  'Phoenix',
  'New York',
  'pending',
  'Phoenix',
  '5 days',
  '[{"city": "Phoenix", "timestamp": "2024-01-18 08:00"}, {"city": "Albuquerque", "timestamp": "2024-01-18 16:00"}, {"city": "Dallas", "timestamp": "2024-01-19 14:00"}, {"city": "Memphis", "timestamp": "2024-01-20 12:00"}, {"city": "New York", "timestamp": "2024-01-22 10:00"}]'::jsonb,
  '[{"city": "Phoenix", "timestamp": "2024-01-18 08:00"}, {"city": "El Paso", "timestamp": "2024-01-18 14:00"}, {"city": "San Antonio", "timestamp": "2024-01-19 10:00"}, {"city": "Houston", "timestamp": "2024-01-19 20:00"}, {"city": "New York", "timestamp": "2024-01-22 12:00"}]'::jsonb
);
