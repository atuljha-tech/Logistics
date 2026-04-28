'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Package, MapPin, Calendar, Loader2, AlertTriangle, Search, ArrowRight, RefreshCw } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Shipment {
  id: string
  tracking_id: string
  sender_name: string
  receiver_name: string
  sender_city?: string
  receiver_city?: string
  package_type: string
  weight: number
  status: string
  current_location: string
  estimated_delivery: string
  created_at: string
}

const statusColors: Record<string, string> = {
  'In Transit': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
  'Delivered': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  'Pending': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  'Out for Delivery': 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  'Delayed': 'text-red-400 bg-red-400/10 border-red-400/30',
}

const TABS = ['All', 'Pending', 'In Transit', 'Out for Delivery', 'Delivered']

export default function MyShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const PAGE_SIZE = 12

  const fetchShipments = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) })
      if (tab !== 'All') params.set('status', tab)
      const res = await fetch(`${API_BASE}/api/shipments?${params}`)
      const data = await res.json()
      if (data.success) {
        setShipments(data.data || [])
        setTotal(data.pagination?.total || 0)
      } else {
        setError(data.error || 'Failed to load shipments')
      }
    } catch {
      setError('Cannot reach backend. Make sure it is running on port 3001.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchShipments() }, [tab, page])

  const filtered = shipments.filter(s => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      s.tracking_id?.toLowerCase().includes(q) ||
      s.sender_name?.toLowerCase().includes(q) ||
      s.receiver_name?.toLowerCase().includes(q) ||
      s.sender_city?.toLowerCase().includes(q) ||
      s.receiver_city?.toLowerCase().includes(q)
    )
  })

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-pepi-thin text-on-surface">
          My Shipments
          {total > 0 && <span className="text-lg text-on-surface-variant ml-3">({total})</span>}
        </motion.h1>
        <div className="flex gap-2">
          <Link href="/logistics/create" className="text-sm px-4 py-2 bg-primary text-on-primary hover:bg-primary/90 transition-colors">
            + New Shipment
          </Link>
          <button onClick={fetchShipments} className="p-2 border border-white/10 text-on-surface-variant hover:border-white/20 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 flex-wrap">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setPage(1) }}
              className={`text-sm px-3 py-1.5 border transition-colors ${tab === t ? 'border-primary/40 bg-primary/10 text-primary' : 'border-white/10 text-on-surface-variant hover:border-white/20'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search by ID, sender, receiver, city…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 bg-surface-container border border-white/10 text-on-surface placeholder:text-on-surface-variant text-sm outline-none focus:border-primary/40"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-on-surface-variant">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading shipments…
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 border border-red-500/30 bg-red-500/5 text-red-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-pepi-thin">No shipments found</p>
          <Link href="/logistics/create" className="text-sm text-primary hover:underline mt-2 block">
            Create your first shipment →
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/logistics/${s.id}`} className="block bg-surface-container-low border border-white/10 p-5 hover:border-white/20 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-mono text-on-surface-variant">{s.tracking_id}</p>
                      <p className="text-sm font-medium text-on-surface mt-0.5">
                        {s.sender_city || 'Origin'}
                        <ArrowRight className="w-3 h-3 inline mx-1 text-on-surface-variant" />
                        {s.receiver_city || 'Destination'}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 border shrink-0 ${statusColors[s.status] || 'text-on-surface-variant border-white/10'}`}>
                      {s.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-on-surface-variant">
                    <div className="flex items-center gap-1.5">
                      <Package className="w-3 h-3" />
                      <span>{s.package_type} · {s.weight} kg</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{s.current_location}</span>
                    </div>
                    {s.estimated_delivery && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        <span>Est. {new Date(s.estimated_delivery).toLocaleDateString('en-IN')}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xs text-on-surface-variant">
                      {s.sender_name} → {s.receiver_name}
                    </span>
                    <span className="text-xs text-primary">View →</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-on-surface-variant">
                Page {page} of {totalPages} · {total} total
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm border border-white/10 text-on-surface-variant hover:border-white/20 disabled:opacity-40 transition-colors"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-sm border border-white/10 text-on-surface-variant hover:border-white/20 disabled:opacity-40 transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
