'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, ArrowLeft, MapPin, Package, Calendar, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Shipment {
  id: string
  tracking_id: string
  sender_name: string
  receiver_name: string
  sender_address: string
  receiver_address: string
  package_type: string
  weight: number
  status: string
  estimated_delivery: string
  created_at: string
  events?: ShipmentEvent[]
  shipment_events?: ShipmentEvent[]
}

interface ShipmentEvent {
  id: string
  status: string
  location: string
  occurred_at: string
  timestamp?: string
  description?: string
}

export default function TrackShipment() {
  const [trackingId, setTrackingId] = useState('')
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingId.trim()) return

    setLoading(true)
    setError('')
    setShipment(null)

    try {
      const res = await fetch(`${API_BASE}/api/track/${trackingId}`)
      const data = await res.json()

      if (data.success) {
        setShipment(data.data)
      } else {
        setError('Shipment not found. Please check your tracking ID.')
      }
    } catch (err) {
      setError('Network error. Make sure backend is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      case 'In Transit':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      case 'Out for Delivery':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30'
      case 'Pending':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '✓'
      case 'In Transit':
        return '⚡'
      case 'Out for Delivery':
        return '🚚'
      case 'Pending':
        return '⏱'
      default:
        return '📦'
    }
  }

  const timelineEvents = shipment?.shipment_events ?? shipment?.events ?? []

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <Link href="/logistics" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-semibold">Back to Dashboard</span>
          </Link>
          <h1 className="text-h1 font-h1 text-on-surface mb-2">Track Your Shipment</h1>
          <p className="text-body-md text-on-surface-variant">Enter your tracking ID to get real-time updates</p>
        </motion.div>

        {/* Search Form */}
        <motion.form onSubmit={handleTrack} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
          <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Enter tracking ID (e.g., IND202401011234)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-linear-to-r from-primary via-primary to-primary/80 text-on-primary rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 md:w-auto w-full"
            >
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </div>
        </motion.form>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 glass-panel p-6 rounded-2xl border border-red-500/30 bg-red-500/5 flex items-center gap-4"
          >
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Shipment Details */}
        {shipment && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Status Banner */}
            <div className={`glass-panel p-8 rounded-2xl border ${getStatusColor(shipment.status)}`}>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl">{getStatusIcon(shipment.status)}</span>
                <div>
                  <p className="text-xs text-on-surface-variant font-label-caps mb-1">Current Status</p>
                  <p className="text-h2 font-h2 text-on-surface">{shipment.status}</p>
                </div>
              </div>
              <p className="text-body-md text-on-surface-variant">Tracking ID: {shipment.tracking_id}</p>
            </div>

            {/* Main Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sender Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-panel p-6 rounded-2xl border border-white/5"
              >
                <h3 className="text-h3 font-h3 text-on-surface mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  From
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-on-surface-variant font-label-caps mb-1">Sender</p>
                    <p className="text-body-md font-semibold text-on-surface">{shipment.sender_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-label-caps mb-1">Address</p>
                    <p className="text-body-sm text-on-surface">{shipment.sender_address}</p>
                  </div>
                </div>
              </motion.div>

              {/* Receiver Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-panel p-6 rounded-2xl border border-white/5"
              >
                <h3 className="text-h3 font-h3 text-on-surface mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  To
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-on-surface-variant font-label-caps mb-1">Receiver</p>
                    <p className="text-body-md font-semibold text-on-surface">{shipment.receiver_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-label-caps mb-1">Address</p>
                    <p className="text-body-sm text-on-surface">{shipment.receiver_address}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Package & Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel p-6 rounded-2xl border border-white/5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Package className="w-5 h-5 text-primary" />
                  <h3 className="text-h3 font-h3 text-on-surface">Package</h3>
                </div>
                <p className="text-body-sm text-on-surface-variant mb-2">{shipment.package_type}</p>
                <p className="text-body-md font-semibold text-on-surface">{shipment.weight} kg</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel p-6 rounded-2xl border border-white/5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="text-h3 font-h3 text-on-surface">Delivery</h3>
                </div>
                <p className="text-body-sm text-on-surface-variant mb-2">Est. Delivery</p>
                <p className="text-body-md font-semibold text-on-surface">
                  {new Date(shipment.estimated_delivery).toLocaleDateString('en-IN')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-panel p-6 rounded-2xl border border-white/5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="text-h3 font-h3 text-on-surface">Created</h3>
                </div>
                <p className="text-body-sm text-on-surface-variant mb-2">Shipment Date</p>
                <p className="text-body-md font-semibold text-on-surface">
                  {new Date(shipment.created_at).toLocaleDateString('en-IN')}
                </p>
              </motion.div>
            </div>

            {/* Timeline */}
            {timelineEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel p-8 rounded-2xl border border-white/5"
              >
                <h3 className="text-h3 font-h3 text-on-surface mb-6">Tracking Timeline</h3>
                <div className="space-y-4">
                  {timelineEvents.map((event, idx) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-primary mt-2" />
                        {idx < timelineEvents.length - 1 && (
                          <div className="w-0.5 h-16 bg-primary/20 my-2" />
                        )}
                      </div>
                      <div className="pb-8">
                        <p className="text-body-md font-semibold text-on-surface">{event.status}</p>
                        <p className="text-body-sm text-on-surface-variant mb-1">{event.location}</p>
                        {event.description && <p className="text-body-sm text-on-surface-variant">{event.description}</p>}
                        <p className="text-xs text-on-surface-variant mt-2">
                          {new Date(event.occurred_at || event.timestamp || '').toLocaleString('en-IN')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!shipment && !error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-12 rounded-2xl border border-white/5 text-center"
          >
            <Package className="w-16 h-16 text-on-surface-variant/30 mx-auto mb-4" />
            <p className="text-on-surface-variant text-body-md">Enter a tracking ID to view shipment details</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
