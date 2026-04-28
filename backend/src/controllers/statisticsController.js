import { supabase, isNetworkError } from '../config/supabase.js'
import { store } from '../utils/mockStore.js'

export async function getShipmentStatistics(req, res) {
  try {
    const { data, error } = await supabase.from('shipments').select('status, created_at, value, weight')
    if (error) throw error

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const stats = buildStats(data, todayStart, monthStart)
    res.json({ success: true, data: stats })
  } catch (err) {
    if (isNetworkError(err)) {
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      return res.json({ success: true, data: buildStats(store.shipments, todayStart, monthStart) })
    }
    console.error('Error fetching statistics:', err)
    // Return zeros so dashboards don't crash
    res.json({
      success: true,
      data: { total: 0, pending: 0, in_transit: 0, out_for_delivery: 0, delivered: 0,
              delivered_today: 0, created_this_month: 0, total_value: 0, total_weight: 0 },
    })
  }
}

function buildStats(data, todayStart, monthStart) {
  return {
    total: data.length,
    pending: data.filter(s => s.status === 'Pending').length,
    in_transit: data.filter(s => s.status === 'In Transit').length,
    out_for_delivery: data.filter(s => s.status === 'Out for Delivery').length,
    delivered: data.filter(s => s.status === 'Delivered').length,
    delivered_today: data.filter(s => s.status === 'Delivered' && new Date(s.created_at) >= todayStart).length,
    created_this_month: data.filter(s => new Date(s.created_at) >= monthStart).length,
    total_value: data.reduce((sum, s) => sum + (parseFloat(s.value) || 0), 0),
    total_weight: data.reduce((sum, s) => sum + (parseFloat(s.weight) || 0), 0),
  }
}
