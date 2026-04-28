import { supabase, isNetworkError } from '../config/supabase.js'
import { fetchShipmentEvents } from '../utils/shipmentEvents.js'
import { insertSingleAdaptive, updateSingleAdaptive } from '../utils/supabaseAdaptive.js'
import { mockInsert, mockUpdate, store } from '../utils/mockStore.js'

export async function getEventsByShipmentId(req, res) {
  try {
    const { shipmentId } = req.params
    const { data, error } = await fetchShipmentEvents(shipmentId)
    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    if (isNetworkError(err)) {
      const events = store.shipment_events
        .filter(e => e.shipment_id === req.params.shipmentId)
        .sort((a, b) => new Date(a.occurred_at) - new Date(b.occurred_at))
      return res.json({ success: true, data: events })
    }
    console.error('Error fetching events:', err)
    res.status(500).json({ success: false, error: err.message })
  }
}

export async function addEventToShipment(req, res) {
  try {
    const { shipmentId } = req.params
    const { status, location, latitude, longitude, event_type, description, agent_name } = req.body

    if (!status || !location) {
      return res.status(400).json({ success: false, error: 'Missing status or location' })
    }

    const eventTime = new Date().toISOString()
    const eventPayload = {
      shipment_id: shipmentId, status, location,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      event_type, description, agent_name,
      occurred_at: eventTime, timestamp: eventTime,
    }

    let eventData
    const { data: evData, error: evInsertErr } = await insertSingleAdaptive('shipment_events', eventPayload)
    if (evInsertErr) {
      const { data } = mockInsert('shipment_events', eventPayload)
      eventData = data
    } else {
      eventData = evData
    }

    const updatePayload = {
      status, current_location: location,
      ...(latitude && { current_lat: parseFloat(latitude) }),
      ...(longitude && { current_lng: parseFloat(longitude) }),
      ...(agent_name && { assigned_agent: agent_name }),
      updated_at: new Date().toISOString(),
    }

    const { error: upErr } = await updateSingleAdaptive('shipments', shipmentId, updatePayload)
    if (upErr) mockUpdate('shipments', shipmentId, updatePayload)

    res.status(201).json({ success: true, data: eventData })
  } catch (err) {
    console.error('Error adding event:', err)
    res.status(500).json({ success: false, error: err.message })
  }
}
