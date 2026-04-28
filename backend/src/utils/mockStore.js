/**
 * In-memory mock store — used when Supabase is unreachable.
 * Provides full CRUD so the entire app works in offline/dev mode.
 */
import { randomUUID } from 'crypto'

const store = {
  shipments: [],
  shipment_events: [],
}

// Seed with realistic Indian logistics data
function seed() {
  const now = new Date()
  const ids = Array.from({ length: 8 }, () => randomUUID())

  const shipmentData = [
    {
      id: ids[0], tracking_id: 'IND202604280001', status: 'In Transit',
      sender_name: 'Rajesh Kumar', sender_phone: '+91-9876543210',
      sender_address: '123 MG Road, Bandra, Mumbai', sender_city: 'Mumbai', sender_pincode: '400050',
      receiver_name: 'Priya Sharma', receiver_phone: '+91-9123456789',
      receiver_address: '456 Connaught Place, New Delhi', receiver_city: 'Delhi', receiver_pincode: '110001',
      package_type: 'Electronics', weight: 2.5, value: 45000,
      description: 'Laptop - Dell XPS 15',
      current_location: 'Jaipur Transit Hub', current_lat: 26.9124, current_lng: 75.7873,
      assigned_agent: 'Amit Singh', vehicle_number: 'MH-01-AB-1234', vehicle_type: 'Truck',
      estimated_delivery: new Date(now.getTime() + 2 * 86400000).toISOString(),
      actual_delivery: null,
      created_at: new Date(now.getTime() - 3 * 86400000).toISOString(),
      updated_at: new Date(now.getTime() - 1 * 86400000).toISOString(),
    },
    {
      id: ids[1], tracking_id: 'IND202604280002', status: 'Pending',
      sender_name: 'Amit Patel', sender_phone: '+91-8765432109',
      sender_address: '789 Bandra Kurla Complex, Mumbai', sender_city: 'Mumbai', sender_pincode: '400051',
      receiver_name: 'Neha Singh', receiver_phone: '+91-9012345678',
      receiver_address: '321 Hitech City, Hyderabad', receiver_city: 'Hyderabad', receiver_pincode: '500081',
      package_type: 'Documents', weight: 0.5, value: 500,
      description: 'Legal Documents Bundle',
      current_location: 'Mumbai Pickup Hub', current_lat: 19.0760, current_lng: 72.8777,
      assigned_agent: null, vehicle_number: null, vehicle_type: null,
      estimated_delivery: new Date(now.getTime() + 4 * 86400000).toISOString(),
      actual_delivery: null,
      created_at: new Date(now.getTime() - 1 * 86400000).toISOString(),
      updated_at: new Date(now.getTime() - 1 * 86400000).toISOString(),
    },
    {
      id: ids[2], tracking_id: 'IND202604280003', status: 'Delivered',
      sender_name: 'Vijay Reddy', sender_phone: '+91-7654321098',
      sender_address: '654 Hitech City, Hyderabad', sender_city: 'Hyderabad', sender_pincode: '500081',
      receiver_name: 'Sarah Khan', receiver_phone: '+91-8901234567',
      receiver_address: '789 Koramangala, Bangalore', receiver_city: 'Bangalore', receiver_pincode: '560034',
      package_type: 'Clothing', weight: 1.2, value: 3500,
      description: 'Fashion Items - Summer Collection',
      current_location: 'Bangalore Delivery Hub', current_lat: 12.9716, current_lng: 77.5946,
      assigned_agent: 'Ravi Kumar', vehicle_number: 'KA-01-CD-5678', vehicle_type: 'Bike',
      estimated_delivery: new Date(now.getTime() - 2 * 86400000).toISOString(),
      actual_delivery: new Date(now.getTime() - 2 * 86400000).toISOString(),
      created_at: new Date(now.getTime() - 7 * 86400000).toISOString(),
      updated_at: new Date(now.getTime() - 2 * 86400000).toISOString(),
    },
    {
      id: ids[3], tracking_id: 'IND202604280004', status: 'Out for Delivery',
      sender_name: 'Anita Gupta', sender_phone: '+91-6543210987',
      sender_address: '101 Sector 18, Noida', sender_city: 'Noida', sender_pincode: '201301',
      receiver_name: 'Suresh Mehta', receiver_phone: '+91-7890123456',
      receiver_address: '202 Salt Lake, Kolkata', receiver_city: 'Kolkata', receiver_pincode: '700091',
      package_type: 'Food Items', weight: 3.0, value: 1200,
      description: 'Organic Spices and Dry Fruits',
      current_location: 'Kolkata Outskirts', current_lat: 22.5726, current_lng: 88.3639,
      assigned_agent: 'Deepak Roy', vehicle_number: 'WB-01-EF-9012', vehicle_type: 'Van',
      estimated_delivery: now.toISOString(),
      actual_delivery: null,
      created_at: new Date(now.getTime() - 5 * 86400000).toISOString(),
      updated_at: new Date(now.getTime() - 3600000).toISOString(),
    },
    {
      id: ids[4], tracking_id: 'IND202604280005', status: 'In Transit',
      sender_name: 'Kavya Nair', sender_phone: '+91-9988776655',
      sender_address: '55 Marine Drive, Kochi', sender_city: 'Kochi', sender_pincode: '682001',
      receiver_name: 'Arjun Pillai', receiver_phone: '+91-8877665544',
      receiver_address: '77 Anna Nagar, Chennai', receiver_city: 'Chennai', receiver_pincode: '600040',
      package_type: 'Books & Media', weight: 4.0, value: 2800,
      description: 'Engineering Textbooks - 8 volumes',
      current_location: 'Coimbatore Transit Hub', current_lat: 11.0168, current_lng: 76.9558,
      assigned_agent: 'Murugan S', vehicle_number: 'TN-01-GH-3456', vehicle_type: 'Truck',
      estimated_delivery: new Date(now.getTime() + 1 * 86400000).toISOString(),
      actual_delivery: null,
      created_at: new Date(now.getTime() - 4 * 86400000).toISOString(),
      updated_at: new Date(now.getTime() - 12 * 3600000).toISOString(),
    },
    {
      id: ids[5], tracking_id: 'IND202604280006', status: 'Delivered',
      sender_name: 'Rohit Joshi', sender_phone: '+91-7766554433',
      sender_address: '33 FC Road, Pune', sender_city: 'Pune', sender_pincode: '411004',
      receiver_name: 'Meera Desai', receiver_phone: '+91-6655443322',
      receiver_address: '44 CG Road, Ahmedabad', receiver_city: 'Ahmedabad', receiver_pincode: '380009',
      package_type: 'Electronics', weight: 5.5, value: 85000,
      description: 'Camera Equipment - DSLR Kit',
      current_location: 'Ahmedabad Delivery Hub', current_lat: 23.0225, current_lng: 72.5714,
      assigned_agent: 'Kiran Patel', vehicle_number: 'GJ-01-IJ-7890', vehicle_type: 'Van',
      estimated_delivery: new Date(now.getTime() - 1 * 86400000).toISOString(),
      actual_delivery: new Date(now.getTime() - 1 * 86400000).toISOString(),
      created_at: new Date(now.getTime() - 6 * 86400000).toISOString(),
      updated_at: new Date(now.getTime() - 1 * 86400000).toISOString(),
    },
    {
      id: ids[6], tracking_id: 'IND202604280007', status: 'Pending',
      sender_name: 'Sanjay Verma', sender_phone: '+91-5544332211',
      sender_address: '88 Civil Lines, Jaipur', sender_city: 'Jaipur', sender_pincode: '302006',
      receiver_name: 'Pooja Agarwal', receiver_phone: '+91-4433221100',
      receiver_address: '99 Hazratganj, Lucknow', receiver_city: 'Lucknow', receiver_pincode: '226001',
      package_type: 'Clothing', weight: 2.0, value: 6500,
      description: 'Wedding Attire - Sarees and Lehengas',
      current_location: 'Jaipur Pickup Hub', current_lat: 26.9124, current_lng: 75.7873,
      assigned_agent: null, vehicle_number: null, vehicle_type: null,
      estimated_delivery: new Date(now.getTime() + 3 * 86400000).toISOString(),
      actual_delivery: null,
      created_at: new Date(now.getTime() - 2 * 86400000).toISOString(),
      updated_at: new Date(now.getTime() - 2 * 86400000).toISOString(),
    },
    {
      id: ids[7], tracking_id: 'IND202604280008', status: 'In Transit',
      sender_name: 'Divya Krishnan', sender_phone: '+91-3322110099',
      sender_address: '11 Adyar, Chennai', sender_city: 'Chennai', sender_pincode: '600020',
      receiver_name: 'Vikram Rao', receiver_phone: '+91-2211009988',
      receiver_address: '22 Banjara Hills, Hyderabad', receiver_city: 'Hyderabad', receiver_pincode: '500034',
      package_type: 'Electronics', weight: 8.0, value: 120000,
      description: 'Server Hardware Components',
      current_location: 'Nellore Transit Hub', current_lat: 14.4426, current_lng: 79.9865,
      assigned_agent: 'Prasad T', vehicle_number: 'AP-01-KL-1234', vehicle_type: 'Truck',
      estimated_delivery: new Date(now.getTime() + 1 * 86400000).toISOString(),
      actual_delivery: null,
      created_at: new Date(now.getTime() - 3 * 86400000).toISOString(),
      updated_at: new Date(now.getTime() - 6 * 3600000).toISOString(),
    },
  ]

  store.shipments = shipmentData

  // Seed events for first 3 shipments
  const eventTypes = ['CREATED', 'PICKUP', 'TRANSIT', 'HUB_SORT', 'OUT_FOR_DELIVERY', 'DELIVERED']
  const eventDescs = {
    CREATED: 'Shipment created and registered',
    PICKUP: 'Package picked up from sender',
    TRANSIT: 'In transit to destination city',
    HUB_SORT: 'Arrived at sorting hub',
    OUT_FOR_DELIVERY: 'Out for delivery to recipient',
    DELIVERED: 'Successfully delivered to recipient',
  }

  shipmentData.forEach((s, si) => {
    const eventsForShipment = si === 0
      ? ['CREATED', 'PICKUP', 'TRANSIT', 'HUB_SORT']
      : si === 2
      ? ['CREATED', 'PICKUP', 'TRANSIT', 'HUB_SORT', 'OUT_FOR_DELIVERY', 'DELIVERED']
      : si === 3
      ? ['CREATED', 'PICKUP', 'TRANSIT', 'HUB_SORT', 'OUT_FOR_DELIVERY']
      : ['CREATED', 'PICKUP']

    eventsForShipment.forEach((evType, ei) => {
      store.shipment_events.push({
        id: randomUUID(),
        shipment_id: s.id,
        status: s.status,
        location: si === 0
          ? ['Mumbai Pickup Hub', 'Mumbai Pickup Hub', 'Jaipur Transit Hub', 'Jaipur Sorting Center'][ei]
          : s.current_location,
        latitude: s.current_lat,
        longitude: s.current_lng,
        event_type: evType,
        description: eventDescs[evType],
        agent_name: s.assigned_agent,
        occurred_at: new Date(new Date(s.created_at).getTime() + ei * 18 * 3600000).toISOString(),
        created_at: new Date(new Date(s.created_at).getTime() + ei * 18 * 3600000).toISOString(),
      })
    })
  })
}

seed()

// ---- CRUD helpers ----

export function mockQuery(table) {
  return {
    _table: table,
    _filters: [],
    _order: null,
    _limit: null,
    _range: null,
    _single: false,
    _count: false,

    select(fields, opts = {}) {
      if (opts.count === 'exact') this._count = true
      return this
    },
    eq(col, val) { this._filters.push({ type: 'eq', col, val }); return this },
    in(col, vals) { this._filters.push({ type: 'in', col, vals }); return this },
    or(expr) { this._filters.push({ type: 'or', expr }); return this },
    ilike(col, pattern) { this._filters.push({ type: 'ilike', col, pattern }); return this },
    order(col, opts = {}) { this._order = { col, asc: opts.ascending !== false }; return this },
    limit(n) { this._limit = n; return this },
    range(from, to) { this._range = { from, to }; return this },
    single() { this._single = true; return this },

    async then(resolve) {
      let rows = [...store[this._table]]

      for (const f of this._filters) {
        if (f.type === 'eq') {
          rows = rows.filter(r => String(r[f.col]) === String(f.val))
        } else if (f.type === 'in') {
          rows = rows.filter(r => f.vals.includes(r[f.col]))
        } else if (f.type === 'or') {
          // parse simple ilike patterns like "col.ilike.%val%,col2.ilike.%val%"
          const parts = f.expr.split(',')
          rows = rows.filter(r => parts.some(p => {
            const [col, , pattern] = p.split('.')
            const val = pattern.replace(/%/g, '').toLowerCase()
            return String(r[col] || '').toLowerCase().includes(val)
          }))
        } else if (f.type === 'ilike') {
          const val = f.pattern.replace(/%/g, '').toLowerCase()
          rows = rows.filter(r => String(r[f.col] || '').toLowerCase().includes(val))
        }
      }

      if (this._order) {
        rows.sort((a, b) => {
          const av = a[this._order.col], bv = b[this._order.col]
          if (av < bv) return this._order.asc ? -1 : 1
          if (av > bv) return this._order.asc ? 1 : -1
          return 0
        })
      }

      const count = rows.length

      if (this._range) {
        rows = rows.slice(this._range.from, this._range.to + 1)
      } else if (this._limit) {
        rows = rows.slice(0, this._limit)
      }

      if (this._single) {
        if (rows.length === 0) {
          return resolve({ data: null, error: { code: 'PGRST116', message: 'Row not found' }, count: 0 })
        }
        return resolve({ data: rows[0], error: null, count: 1 })
      }

      return resolve({ data: rows, error: null, count: this._count ? count : null })
    }
  }
}

export function mockInsert(table, payload) {
  const row = { id: randomUUID(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...payload }
  store[table].push(row)
  return { data: row, error: null }
}

export function mockUpdate(table, id, payload) {
  const idx = store[table].findIndex(r => r.id === id)
  if (idx === -1) return { data: null, error: { message: 'Row not found' } }
  store[table][idx] = { ...store[table][idx], ...payload, updated_at: new Date().toISOString() }
  return { data: store[table][idx], error: null }
}

export function mockDelete(table, id) {
  const before = store[table].length
  store[table] = store[table].filter(r => r.id !== id)
  // Also cascade delete events
  if (table === 'shipments') {
    store.shipment_events = store.shipment_events.filter(e => e.shipment_id !== id)
  }
  return { error: before === store[table].length ? { message: 'Row not found' } : null }
}

export function mockBulkUpdate(table, ids, payload) {
  let updated = 0
  store[table] = store[table].map(r => {
    if (ids.includes(r.id)) {
      updated++
      return { ...r, ...payload, updated_at: new Date().toISOString() }
    }
    return r
  })
  return { data: store[table].filter(r => ids.includes(r.id)), error: null, updated }
}

export { store }
