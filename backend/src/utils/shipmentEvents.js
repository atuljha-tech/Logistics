import { supabase, isNetworkError } from '../config/supabase.js'
import { store } from './mockStore.js'

export async function fetchShipmentEvents(shipmentId) {
  try {
    const occurredAtQuery = await supabase
      .from('shipment_events')
      .select('*')
      .eq('shipment_id', shipmentId)
      .order('occurred_at', { ascending: true })

    if (!occurredAtQuery.error) return occurredAtQuery

    const message = occurredAtQuery.error?.message || ''
    const shouldRetryWithTimestamp =
      /occurred_at/i.test(message) && /does not exist/i.test(message)

    if (!shouldRetryWithTimestamp) return occurredAtQuery

    return supabase
      .from('shipment_events')
      .select('*')
      .eq('shipment_id', shipmentId)
      .order('timestamp', { ascending: true })
  } catch (err) {
    if (isNetworkError(err)) {
      const events = store.shipment_events
        .filter(e => e.shipment_id === shipmentId)
        .sort((a, b) => new Date(a.occurred_at) - new Date(b.occurred_at))
      return { data: events, error: null }
    }
    return { data: [], error: err }
  }
}
