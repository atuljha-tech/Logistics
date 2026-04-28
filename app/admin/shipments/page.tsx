'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Eye, Zap, Plus, Download, CheckSquare, Package2, Loader2, AlertTriangle, Trash2, RefreshCw } from 'lucide-react'
import { TrackingTimeline } from '@/components/tracking-timeline'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface ApiShipment {
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
  assigned_agent?: string
  vehicle_number?: string
}

const statusColors: Record<string, string> = {
  'In Transit': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
  'in-transit': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
  'Delivered': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  'delivered': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  'Pending': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  'pending': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  'Out for Delivery': 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  'Delayed': 'text-red-400 bg-red-400/10 border-red-400/30',
  'delayed': 'text-red-400 bg-red-400/10 border-red-400/30',
}

const STATUSES = ['All', 'Pending', 'In Transit', 'Out for Delivery', 'Delivered']

function exportToCSV(shipments: ApiShipment[]) {
  const headers = ['Tracking ID', 'Sender', 'Receiver', 'From', 'To', 'Status', 'Weight (kg)', 'Package Type', 'Location', 'Created']
  const rows = shipments.map(s => [
    s.tracking_id,
    s.sender_name,
    s.receiver_name,
    s.sender_city || s.sender_address,
    s.receiver_city || s.receiver_address,
    s.status,
    s.weight,
    s.package_type,
    s.current_location,
    new Date(s.created_at).toLocaleDateString('en-IN'),
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `shipments-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<ApiShipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [bulkLoading, setBulkLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const PAGE_SIZE = 20

  const fetchShipments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) })
      if (statusFilter !== 'All') params.set('status', statusFilter)
      const res = await fetch(`${API_BASE}/api/shipments?${params}`)
      const data = await res.json()
      if (data.success) {
        setShipments(data.data || [])
        setTotal(data.pagination?.total || 0)
      } else {
        setError(data.error || 'Failed to load shipments')
      }
    } catch (e) {
      setError('Cannot reach backend. Make sure it is running on port 3001.')
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter])

  useEffect(() => { fetchShipments() }, [fetchShipments])

  const toggleSelect = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleBulkDeliver = async () => {
    if (selected.length === 0) return
    setBulkLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/shipments/bulk-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selected, status: 'Delivered' }),
      })
      const data = await res.json()
      if (data.success) {
        setSelected([])
        fetchShipments()
      }
    } catch (e) {
      console.error('Bulk update failed', e)
    } finally {
      setBulkLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this shipment? This cannot be undone.')) return
    setDeleteLoading(id)
    try {
      const res = await fetch(`${API_BASE}/api/shipments/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setShipments(prev => prev.filter(s => s.id !== id))
        setSelected(prev => prev.filter(x => x !== id))
      }
    } catch (e) {
      console.error('Delete failed', e)
    } finally {
      setDeleteLoading(null)
    }
  }

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-pepi-thin text-on-surface">
          All Shipments
          {total > 0 && <span className="text-lg text-on-surface-variant ml-3">({total} total)</span>}
        </motion.h1>
        <div className="flex gap-2 flex-wrap">
          <Link href="/logistics/create" className="flex items-center gap-1 text-sm px-4 py-2 bg-primary text-on-primary hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Create Shipment
          </Link>
          <button
            onClick={() => exportToCSV(filtered)}
            className="flex items-center gap-1 text-sm px-3 py-2 border border-white/10 text-on-surface-variant hover:border-white/20 transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={fetchShipments} className="p-2 border border-white/10 text-on-surface-variant hover:border-white/20 transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          {selected.length > 0 && (
            <button
              onClick={handleBulkDeliver}
              disabled={bulkLoading}
              className="flex items-center gap-1 text-sm px-3 py-2 border border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10 transition-colors disabled:opacity-50"
            >
              {bulkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
              Mark Delivered ({selected.length})
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 flex-wrap">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1) }}
              className={`text-sm px-3 py-1.5 border transition-colors ${statusFilter === s ? 'border-primary/40 bg-primary/10 text-primary' : 'border-white/10 text-on-surface-variant hover:border-white/20'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by tracking ID, sender, receiver, city…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-3 py-1.5 bg-surface-container border border-white/10 text-on-surface placeholder:text-on-surface-variant text-sm outline-none focus:border-primary/40"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-on-surface-variant">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading shipments…
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-6 border border-red-500/30 bg-red-500/5 text-red-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-medium">Failed to load shipments</p>
            <p className="text-sm text-red-400/70 mt-1">{error}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-surface-container-low border border-white/10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-on-surface-variant">
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      className="accent-primary"
                      checked={selected.length === filtered.length && filtered.length > 0}
                      onChange={(e) => setSelected(e.target.checked ? filtered.map(s => s.id) : [])}
                    />
                  </th>
                  <th className="text-left p-4 font-biotif-pro font-medium">Tracking ID</th>
                  <th className="text-left p-4 font-biotif-pro font-medium">Sender</th>
                  <th className="text-left p-4 font-biotif-pro font-medium">Receiver</th>
                  <th className="text-left p-4 font-biotif-pro font-medium">Route</th>
                  <th className="text-left p-4 font-biotif-pro font-medium">Status</th>
                  <th className="text-left p-4 font-biotif-pro font-medium">Weight</th>
                  <th className="text-left p-4 font-biotif-pro font-medium">Created</th>
                  <th className="text-left p-4 font-biotif-pro font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-16 text-on-surface-variant">
                      <Package2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      No shipments found.
                    </td>
                  </tr>
                ) : filtered.map((s) => (
                  <React.Fragment key={s.id}>
                    <tr
                      className="border-b border-white/5 hover:bg-surface-container/50 transition-colors cursor-pointer"
                      onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                    >
                      <td className="p-4" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="accent-primary"
                          checked={selected.includes(s.id)}
                          onChange={() => toggleSelect(s.id)}
                        />
                      </td>
                      <td className="p-4 font-mono text-xs text-primary">{s.tracking_id}</td>
                      <td className="p-4 text-on-surface">{s.sender_name}</td>
                      <td className="p-4 text-on-surface">{s.receiver_name}</td>
                      <td className="p-4">
                        <span className="text-on-surface-variant">{s.sender_city || '—'}</span>
                        <ArrowRight className="w-3 h-3 text-on-surface-variant inline mx-1" />
                        <span className="text-on-surface-variant">{s.receiver_city || '—'}</span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-0.5 border ${statusColors[s.status] || 'text-on-surface-variant border-white/10'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-4 text-on-surface-variant">{s.weight} kg</td>
                      <td className="p-4 text-xs text-on-surface-variant">
                        {new Date(s.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                          <Link href={`/logistics/${s.id}`} title="View Details">
                            <Eye className="w-4 h-4 text-on-surface-variant hover:text-primary transition-colors" />
                          </Link>
                          <button
                            onClick={() => handleDelete(s.id)}
                            disabled={deleteLoading === s.id}
                            title="Delete"
                          >
                            {deleteLoading === s.id
                              ? <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                              : <Trash2 className="w-4 h-4 text-on-surface-variant hover:text-red-400 transition-colors" />
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expanded === s.id && (
                      <tr>
                        <td colSpan={9} className="px-6 py-4 bg-surface-container/30 border-b border-white/10">
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <p className="text-xs text-on-surface-variant mb-3 font-biotif-pro uppercase tracking-wider">Shipment Details</p>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-on-surface-variant">Package Type</span>
                                    <span className="text-on-surface">{s.package_type}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-on-surface-variant">Current Location</span>
                                    <span className="text-on-surface">{s.current_location}</span>
                                  </div>
                                  {s.assigned_agent && (
                                    <div className="flex justify-between">
                                      <span className="text-on-surface-variant">Agent</span>
                                      <span className="text-on-surface">{s.assigned_agent}</span>
                                    </div>
                                  )}
                                  {s.vehicle_number && (
                                    <div className="flex justify-between">
                                      <span className="text-on-surface-variant">Vehicle</span>
                                      <span className="text-on-surface">{s.vehicle_number}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between">
                                    <span className="text-on-surface-variant">Est. Delivery</span>
                                    <span className="text-on-surface">
                                      {s.estimated_delivery ? new Date(s.estimated_delivery).toLocaleDateString('en-IN') : '—'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-on-surface-variant mb-3 font-biotif-pro uppercase tracking-wider">Addresses</p>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="text-on-surface-variant text-xs">From:</span>
                                    <p className="text-on-surface">{s.sender_address}</p>
                                  </div>
                                  <div>
                                    <span className="text-on-surface-variant text-xs">To:</span>
                                    <p className="text-on-surface">{s.receiver_address}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10 flex gap-3">
                              <Link
                                href={`/logistics/${s.id}`}
                                className="text-xs px-4 py-2 bg-primary text-on-primary hover:bg-primary/90 transition-colors"
                              >
                                View Full Details
                              </Link>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-on-surface-variant">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm border border-white/10 text-on-surface-variant hover:border-white/20 disabled:opacity-40 transition-colors"
                >
                  ← Prev
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1.5 text-sm border transition-colors ${p === page ? 'border-primary/40 bg-primary/10 text-primary' : 'border-white/10 text-on-surface-variant hover:border-white/20'}`}
                    >
                      {p}
                    </button>
                  )
                })}
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
