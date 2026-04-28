import { supabase, isNetworkError } from '../config/supabase.js'
import { generateTrackingId } from '../utils/tracking.js'
import { deriveCity } from '../utils/location.js'
import { fetchShipmentEvents } from '../utils/shipmentEvents.js'
import { insertSingleAdaptive, updateSingleAdaptive } from '../utils/supabaseAdaptive.js'
import { mockQuery, mockInsert, mockUpdate, mockDelete, mockBulkUpdate, store } from '../utils/mockStore.js'

// ─── GET /api/shipments ───────────────────────────────────────────────────────
export async function getShipments(req, res) {
  try {
    const { page = 1, limit = 20, status, city } = req.query
    const pageNumber = Number(page) || 1
    const pageSize = Number(limit) || 20
    const offset = (pageNumber - 1) * pageSize

    let query = supabase.from('shipments').select('*', { count: 'exact' })

    if (status) query = query.eq('status', status)
    if (city) query = query.or(`receiver_address.ilike.%${city}%,sender_address.ilike.%${city}%`)

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) throw error

    const mapped = (data || []).map((s) => ({
      ...s,
      current_location: s.current_location || `${deriveCity(s.sender_city, s.sender_address)} Pickup Hub`,
    }))

    res.json({ success: true, data: mapped, pagination: { page: pageNumber, limit: pageSize, total: count } })
  } catch (err) {
    if (isNetworkError(err)) {
      // Fall back to mock store
      let rows = [...store.shipments]
      const { page = 1, limit = 20, status, city } = req.query
      const pageNumber = Number(page) || 1
      const pageSize = Number(limit) || 20

      if (status) rows = rows.filter(s => s.status === status)
      if (city) {
        const q = city.toLowerCase()
        rows = rows.filter(s =>
          (s.sender_city || '').toLowerCase().includes(q) ||
          (s.receiver_city || '').toLowerCase().includes(q)
        )
      }

      rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      const total = rows.length
      const paged = rows.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)

      return res.json({ success: true, data: paged, pagination: { page: pageNumber, limit: pageSize, total } })
    }
    console.error('Error fetching shipments:', err)
    res.status(500).json({ success: false, error: err.message })
  }
}

// ─── GET /api/shipments/:id ───────────────────────────────────────────────────
export async function getShipmentById(req, res) {
  try {
    const { id } = req.params

    const { data: shipment, error: shipmentError } = await supabase
      .from('shipments').select('*').eq('id', id).single()

    if (shipmentError) throw shipmentError

    const { data: events } = await fetchShipmentEvents(id)
    res.json({ success: true, data: { ...shipment, events: events || [] } })
  } catch (err) {
    if (isNetworkError(err)) {
      const shipment = store.shipments.find(s => s.id === req.params.id)
      if (!shipment) return res.status(404).json({ success: false, error: 'Shipment not found' })
      const events = store.shipment_events.filter(e => e.shipment_id === req.params.id)
        .sort((a, b) => new Date(a.occurred_at) - new Date(b.occurred_at))
      return res.json({ success: true, data: { ...shipment, events } })
    }
    console.error('Error fetching shipment:', err)
    res.status(500).json({ success: false, error: err.message })
  }
}

// ─── GET /api/track/:trackingId ───────────────────────────────────────────────
export async function trackShipmentByTrackingId(req, res) {
  try {
    const { trackingId } = req.params

    const { data: shipment, error: shipmentError } = await supabase
      .from('shipments').select('*').eq('tracking_id', trackingId).single()

    if (shipmentError) throw shipmentError

    const { data: events } = await fetchShipmentEvents(shipment.id)
    res.json({ success: true, data: { ...shipment, events: events || [] } })
  } catch (err) {
    if (isNetworkError(err)) {
      const shipment = store.shipments.find(s => s.tracking_id === req.params.trackingId)
      if (!shipment) return res.status(404).json({ success: false, error: 'Shipment not found' })
      const events = store.shipment_events.filter(e => e.shipment_id === shipment.id)
        .sort((a, b) => new Date(a.occurred_at) - new Date(b.occurred_at))
      return res.json({ success: true, data: { ...shipment, events } })
    }
    if (err.code === 'PGRST116') {
      return res.status(404).json({ success: false, error: 'Shipment not found' })
    }
    console.error('Error tracking shipment:', err)
    res.status(500).json({ success: false, error: err.message })
  }
}

// ─── POST /api/shipments ──────────────────────────────────────────────────────
export async function createShipment(req, res) {
  try {
    const {
      sender_name, sender_phone, sender_address, sender_city, sender_pincode,
      receiver_name, receiver_phone, receiver_address, receiver_city, receiver_pincode,
      package_type, weight, value, description, estimated_delivery,
    } = req.body

    if (!sender_name || !sender_phone || !sender_address || !sender_pincode ||
        !receiver_name || !receiver_phone || !receiver_address || !receiver_pincode ||
        !package_type || !weight || !estimated_delivery) {
      return res.status(400).json({ success: false, error: 'Missing required fields' })
    }

    const tracking_id = generateTrackingId()
    const senderCityResolved = sender_city || deriveCity(null, sender_address)
    const receiverCityResolved = receiver_city || deriveCity(null, receiver_address)

    const normalizedSenderAddress = sender_address?.includes(senderCityResolved)
      ? sender_address : `${sender_address}, ${senderCityResolved}`
    const normalizedReceiverAddress = receiver_address?.includes(receiverCityResolved)
      ? receiver_address : `${receiver_address}, ${receiverCityResolved}`

    const shipmentPayload = {
      tracking_id, sender_name, sender_phone,
      sender_address: normalizedSenderAddress, sender_city: senderCityResolved, sender_pincode,
      receiver_name, receiver_phone,
      receiver_address: normalizedReceiverAddress, receiver_city: receiverCityResolved, receiver_pincode,
      package_type, weight: parseFloat(weight),
      value: value ? parseFloat(value) : null,
      description, status: 'Pending',
      current_location: `${senderCityResolved} Pickup Hub`,
      current_lat: 28.6139, current_lng: 77.209,
      estimated_delivery,
    }

    let shipmentData
    try {
      const { data, error } = await insertSingleAdaptive('shipments', shipmentPayload)
      if (error) throw error
      shipmentData = data
    } catch (dbErr) {
      if (isNetworkError(dbErr)) {
        const { data } = mockInsert('shipments', shipmentPayload)
        shipmentData = data
      } else {
        throw dbErr
      }
    }

    const eventPayload = {
      shipment_id: shipmentData.id, status: 'Pending',
      location: `${senderCityResolved} Pickup Hub`,
      latitude: 28.6139, longitude: 77.209,
      event_type: 'CREATED', description: 'Shipment created and registered',
      agent_name: null,
      occurred_at: new Date().toISOString(), timestamp: new Date().toISOString(),
    }

    // insertSingleAdaptive returns {data,error} — it doesn't throw on network errors
    const { error: evErr } = await insertSingleAdaptive('shipment_events', eventPayload)
    if (evErr) {
      // Supabase unavailable or column exhausted — persist in mock store
      mockInsert('shipment_events', eventPayload)
    }

    res.status(201).json({ success: true, data: shipmentData })
  } catch (err) {
    console.error('Error creating shipment:', err)
    if ((err.message || '').toLowerCase().includes('row-level security')) {
      return res.status(403).json({
        success: false,
        error: 'Database RLS blocked insert. Use service role key in SUPABASE_KEY.',
      })
    }
    res.status(500).json({ success: false, error: err.message })
  }
}

// ─── PUT /api/shipments/:id ───────────────────────────────────────────────────
export async function updateShipment(req, res) {
  try {
    const { id } = req.params
    const { status, current_location, current_lat, current_lng, assigned_agent, vehicle_number, vehicle_type } = req.body

    const updateData = { updated_at: new Date().toISOString() }
    if (status) updateData.status = status
    if (current_location) updateData.current_location = current_location
    if (current_lat !== undefined) updateData.current_lat = parseFloat(current_lat)
    if (current_lng !== undefined) updateData.current_lng = parseFloat(current_lng)
    if (assigned_agent) updateData.assigned_agent = assigned_agent
    if (vehicle_number) updateData.vehicle_number = vehicle_number
    if (vehicle_type) updateData.vehicle_type = vehicle_type

    let result
    try {
      const { data, error } = await updateSingleAdaptive('shipments', id, updateData)
      if (error) throw error
      result = data
    } catch (dbErr) {
      if (isNetworkError(dbErr)) {
        const { data, error } = mockUpdate('shipments', id, updateData)
        if (error) return res.status(404).json({ success: false, error: 'Shipment not found' })
        result = data
      } else {
        throw dbErr
      }
    }

    res.json({ success: true, data: result })
  } catch (err) {
    console.error('Error updating shipment:', err)
    res.status(500).json({ success: false, error: err.message })
  }
}

// ─── DELETE /api/shipments/:id ────────────────────────────────────────────────
export async function deleteShipment(req, res) {
  const { id } = req.params
  try {
    const { error } = await supabase.from('shipments').delete().eq('id', id)
    if (error) throw error
    res.json({ success: true, message: 'Shipment deleted successfully' })
  } catch (err) {
    if (isNetworkError(err)) {
      const { error: mockErr } = mockDelete('shipments', id)
      if (mockErr) return res.status(404).json({ success: false, error: 'Shipment not found' })
      return res.json({ success: true, message: 'Shipment deleted successfully' })
    }
    console.error('Error deleting shipment:', err)
    res.status(500).json({ success: false, error: err.message })
  }
}

// ─── POST /api/shipments/bulk-update ─────────────────────────────────────────
export async function bulkUpdateShipments(req, res) {
  try {
    const { ids, status } = req.body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'ids array is required' })
    }
    if (!status) {
      return res.status(400).json({ success: false, error: 'status is required' })
    }

    const updateData = { status, updated_at: new Date().toISOString() }
    if (status === 'Delivered') updateData.actual_delivery = new Date().toISOString()

    const { data, error } = await supabase
      .from('shipments').update(updateData).in('id', ids).select()

    if (error) throw error

    res.json({ success: true, data, updated: data?.length ?? 0 })
  } catch (err) {
    if (isNetworkError(err)) {
      const updateData = { status: req.body.status }
      if (req.body.status === 'Delivered') updateData.actual_delivery = new Date().toISOString()
      const { data, updated } = mockBulkUpdate('shipments', req.body.ids, updateData)
      return res.json({ success: true, data, updated })
    }
    console.error('Error bulk updating shipments:', err)
    res.status(500).json({ success: false, error: err.message })
  }
}
