'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Loader2, AlertTriangle, Package, Download } from 'lucide-react'

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
  updated_at?: string
}

function exportToCSV(shipments: Shipment[]) {
  const headers = ['Tracking ID', 'Sender', 'Receiver', 'From', 'To', 'Package', 'Weight', 'Delivered']
  const rows = shipments.map(s => [
    s.tracking_id, s.sender_name, s.receiver_name,
    s.sender_city || '', s.receiver_city || '',
    s.package_type, `${s.weight} kg`,
    new Date(s.updated_at || s.created_at).toLocaleDateString('en-IN'),
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `delivery-history-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function HistoryPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const PAGE_SIZE = 20

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ status: 'Delivered', page: String(page), limit: String(PAGE_SIZE) })
    fetch(`${API_BASE}/api/shipments?${params}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setShipments(d.data || [])
          setTotal(d.pagination?.total || 0)
        } else {
          setError(d.error || 'Failed to load history')
        }
      })
      .catch(() => setError('Cannot reach backend.'))
      .finally(() => setLoading(false))
  }, [page])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-pepi-thin text-on-surface">
          Delivery History
          {total > 0 && <span className="text-lg text-on-surface-variant ml-3">({total} delivered)</span>}
        </motion.h1>
        {shipments.length > 0 && (
          <button
            onClick={() => exportToCSV(shipments)}
            className="flex items-center gap-2 text-sm px-4 py-2 border border-white/10 text-on-surface-variant hover:border-white/20 transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-on-surface-variant">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading history…
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 border border-red-500/30 bg-red-500/5 text-red-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      ) : shipments.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-pepi-thin">No delivery history yet</p>
          <p className="text-sm mt-1">Delivered shipments will appear here</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {shipments.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-surface-container border border-white/10 p-5 flex items-center gap-4 hover:border-white/20 transition-colors"
              >
                <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-on-surface-variant">{s.tracking_id}</p>
                  <p className="text-on-surface font-medium">
                    {s.sender_city || s.sender_name}
                    <ArrowRight className="w-4 h-4 inline text-on-surface-variant mx-1" />
                    {s.receiver_city || s.receiver_name}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {s.package_type} · {s.weight} kg · {s.sender_name} → {s.receiver_name}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-on-surface-variant">Delivered</p>
                  <p className="text-sm text-emerald-400">
                    {new Date(s.updated_at || s.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <Link
                  href={`/logistics/${s.id}`}
                  className="text-xs px-3 py-1.5 border border-white/10 text-on-surface-variant hover:border-white/20 hover:text-on-surface transition-colors shrink-0"
                >
                  View
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-on-surface-variant">Page {page} of {totalPages}</p>
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
