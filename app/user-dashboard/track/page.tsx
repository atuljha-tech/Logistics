'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Search, Loader2, AlertCircle, MapPin, Package, Calendar, CheckCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface ShipmentEvent {
  id: string
  status: string
  location: string
  occurred_at?: string
  timestamp?: string
  description?: string
  event_type?: string
}

interface Shipment {
  id: string
  tracking_id: string
  sender_name: string
  receiver_name: string
  sender_city?: string
  receiver_city?: string
  sender_address: string
  receiver_address: string
  package_type: string
  weight: number
  status: string
  current_location: string
  estimated_delivery: string
  created_at: string
  events?: ShipmentEvent[]
}

const statusColors: Record<string, string> = {
  'In Transit': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
  'Delivered': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  'Pending': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  'Out for Delivery': 'text-blue-400 bg-blue-400/10 border-blue-400/30',
}

function TrackPageInner() {
  const searchParams = useSearchParams()
  const [trackId, setTrackId] = useState(searchParams?.get('id') || '')
  const [inputValue, setInputValue] = useState(searchParams?.get('id') || '')
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (id?: string) => {
    const query = (id || inputValue).trim()
    if (!query) return
    setTrackId(query)
    setLoading(true)
    setError('')
    setShipment(null)
    try {
      const res = await fetch(`${API_BASE}/api/track/${query}`)
      const data = await res.json()
      if (data.success) {
        setShipment(data.data)
      } else {
        setError('Shipment not found. Please check your tracking ID.')
      }
    } catch {
      setError('Network error. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const id = searchParams?.get('id')
    if (id) handleTrack(id)
  }, [])

  const events: ShipmentEvent[] = shipment?.events || []

  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-pepi-thin text-on-surface">
        Track Package
      </motion.h1>

      {/* Search */}
      <form
        onSubmit={e => { e.preventDefault(); handleTrack() }}
        className="flex gap-3"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Enter tracking ID (e.g. IND20240101…)"
            value={inputValue}
            onChange={e => setInputValue(e.target.value.toUpperCase())}
            className="w-full pl-10 pr-4 py-3 bg-surface-container border border-white/10 text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary/40 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary text-on-primary text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Track
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 border border-red-500/30 bg-red-500/5 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 gap-3 text-on-surface-variant">
          <Loader2 className="w-5 h-5 animate-spin" />
          Searching for shipment…
        </div>
      )}

      {/* Shipment info */}
      {shipment && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Left: shipment summary */}
          <div className="bg-surface-container-low border border-white/10 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-mono text-on-surface-variant">{shipment.tracking_id}</p>
                <h2 className="text-xl font-pepi-thin text-on-surface mt-1">
                  {shipment.sender_city || 'Origin'} → {shipment.receiver_city || 'Destination'}
                </h2>
              </div>
              <span className={`text-xs px-2 py-1 border ${statusColors[shipment.status] || 'text-on-surface-variant border-white/10'}`}>
                {shipment.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-on-surface-variant text-xs mb-1">Sender</p>
                <p className="text-on-surface">{shipment.sender_name}</p>
              </div>
              <div>
                <p className="text-on-surface-variant text-xs mb-1">Receiver</p>
                <p className="text-on-surface">{shipment.receiver_name}</p>
              </div>
              <div>
                <p className="text-on-surface-variant text-xs mb-1">Package Type</p>
                <p className="text-on-surface">{shipment.package_type}</p>
              </div>
              <div>
                <p className="text-on-surface-variant text-xs mb-1">Weight</p>
                <p className="text-on-surface">{shipment.weight} kg</p>
              </div>
              <div>
                <p className="text-on-surface-variant text-xs mb-1">Current Location</p>
                <p className="text-on-surface flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-primary" />
                  {shipment.current_location}
                </p>
              </div>
              <div>
                <p className="text-on-surface-variant text-xs mb-1">Est. Delivery</p>
                <p className="text-on-surface flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-primary" />
                  {shipment.estimated_delivery
                    ? new Date(shipment.estimated_delivery).toLocaleDateString('en-IN')
                    : '—'}
                </p>
              </div>
            </div>

            {/* Delivery countdown */}
            <div className="p-4 bg-primary/5 border border-primary/20 text-center">
              <p className="text-xs text-on-surface-variant mb-1">
                {shipment.status === 'Delivered' ? 'Delivered on' : 'Estimated Delivery'}
              </p>
              <p className="text-xl font-pepi-thin text-primary">
                {shipment.estimated_delivery
                  ? new Date(shipment.estimated_delivery).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                  : '—'}
              </p>
            </div>

            {/* Share */}
            <button
              onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/logistics/track?id=${shipment.tracking_id}`)}
              className="w-full text-xs py-2 border border-white/10 text-on-surface-variant hover:border-white/20 hover:text-on-surface transition-colors"
            >
              📋 Copy Tracking Link
            </button>
          </div>

          {/* Right: event timeline */}
          <div className="bg-surface-container-low border border-white/10 p-6">
            <h3 className="text-lg font-pepi-thin text-on-surface mb-4">Tracking History</h3>
            {events.length === 0 ? (
              <p className="text-sm text-on-surface-variant">No tracking events yet.</p>
            ) : (
              <div className="space-y-3">
                {events.map((event, i) => {
                  const isLast = i === events.length - 1
                  const time = event.occurred_at || event.timestamp
                  return (
                    <div key={event.id} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 flex items-center justify-center border-2 ${
                          isLast ? 'bg-primary/20 border-primary' : 'bg-emerald-400/20 border-emerald-400'
                        }`}>
                          {isLast
                            ? <Package className="w-4 h-4 text-primary" />
                            : <CheckCircle className="w-4 h-4 text-emerald-400" />
                          }
                        </div>
                        {i < events.length - 1 && (
                          <div className="w-0.5 h-8 bg-emerald-400/30 mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p className="text-sm font-medium text-on-surface">
                          {event.description || event.event_type || event.status}
                        </p>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </p>
                        {time && (
                          <p className="text-xs text-on-surface-variant mt-0.5">
                            {new Date(time).toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!shipment && !loading && !error && (
        <div className="text-center py-16 text-on-surface-variant">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-pepi-thin">Enter a tracking ID to get started</p>
          <p className="text-sm mt-1">Tracking IDs start with IND followed by a timestamp</p>
        </div>
      )}
    </div>
  )
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20 gap-3 text-on-surface-variant">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading…
      </div>
    }>
      <TrackPageInner />
    </Suspense>
  )
}
