'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { GlassPanel } from '@/components/glass-panel'
import { OptimizeModal } from '@/components/optimize-modal'
import { Search, Download, Plus, Eye, Zap, Loader2, AlertTriangle } from 'lucide-react'

type FilterType = 'all' | 'in-transit' | 'delivered' | 'pending' | 'delayed'
type RiskLevel = 'all' | 'low' | 'medium' | 'high'

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

interface SupplyShipment {
  id: string
  tracking_id?: string
  origin: string
  destination: string
  status: string
  eta: string
}

interface ApiShipment {
  id: string
  tracking_id?: string
  updated_at?: string
  created_at?: string
}

interface RiskData {
  shipmentId: string
  riskScore: number
}

interface DashboardShipment {
  id: string
  trackingId: string
  origin: string
  destination: string
  status: string
  eta: string
  riskScore: number
  lastUpdate: string
}

export default function ShipmentsPage() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [riskFilter, setRiskFilter] = useState<RiskLevel>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [shipments, setShipments] = useState<DashboardShipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null)
  const [isOptimizeOpen, setIsOptimizeOpen] = useState(false)

  useEffect(() => {
    async function loadShipments() {
      try {
        setLoading(true)
        setError(null)

        const [supplyRes, apiRes] = await Promise.all([
          fetch(`${API_BASE}/shipments`),
          fetch(`${API_BASE}/api/shipments?limit=200`),
        ])

        if (!supplyRes.ok) throw new Error(`Supply-chain API failed (${supplyRes.status})`)
        if (!apiRes.ok) throw new Error(`Shipments API failed (${apiRes.status})`)

        const supplyJson = await supplyRes.json()
        const apiJson = await apiRes.json()

        if (!supplyJson.success) throw new Error(supplyJson.error || 'Failed to fetch supply shipments')
        if (!apiJson.success) throw new Error(apiJson.error || 'Failed to fetch shipment metadata')

        const supplyShipments: SupplyShipment[] = supplyJson.data || []
        const apiShipments: ApiShipment[] = apiJson.data || []
        const apiById = new Map(apiShipments.map((item) => [item.id, item]))

        const riskResults = await Promise.allSettled(
          supplyShipments.map((shipment) =>
            fetch(`${API_BASE}/predict-risk/${shipment.id}`)
              .then((r) => r.json())
              .then((j) => (j.success ? (j.data as RiskData) : null))
              .catch(() => null)
          )
        )

        const mapped: DashboardShipment[] = supplyShipments.map((shipment, index) => {
          const meta = apiById.get(shipment.id)
          const risk = riskResults[index].status === 'fulfilled'
            ? (riskResults[index] as PromiseFulfilledResult<RiskData | null>).value
            : null

          const lastUpdateRaw = meta?.updated_at || meta?.created_at || ''
          const formattedLastUpdate = lastUpdateRaw
            ? new Date(lastUpdateRaw).toLocaleString('en-IN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'N/A'

          return {
            id: shipment.id,
            trackingId: shipment.tracking_id || shipment.id,
            origin: shipment.origin,
            destination: shipment.destination,
            status: shipment.status,
            eta: shipment.eta,
            riskScore: risk?.riskScore ?? 0,
            lastUpdate: formattedLastUpdate,
          }
        })

        setShipments(mapped)
        setSelectedShipmentId(mapped[0]?.id || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch shipments')
      } finally {
        setLoading(false)
      }
    }

    loadShipments()
  }, [])

  const getRiskLevel = (score: number): RiskLevel => {
    if (score < 30) return 'low'
    if (score < 70) return 'medium'
    return 'high'
  }

  const filteredShipments = useMemo(() => shipments.filter((ship) => {
    const matchesFilter = filter === 'all' || ship.status === filter
    const matchesSearch =
      ship.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ship.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ship.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ship.destination.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRisk =
      riskFilter === 'all' || getRiskLevel(ship.riskScore || 0) === riskFilter
    return matchesFilter && matchesSearch && matchesRisk
  }), [shipments, filter, searchTerm, riskFilter])

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading shipments...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="glass-panel p-6 rounded-xl border border-red-500/30 bg-red-500/5 max-w-lg">
          <div className="flex items-center gap-3 mb-2 text-red-300">
            <AlertTriangle className="w-5 h-5" />
            <p className="font-semibold">Failed to load real shipment data</p>
          </div>
          <p className="text-sm text-red-200/90">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-h1 text-on-surface">Shipments</h1>
          <p className="text-body-md text-on-surface-variant mt-2">
            Track and manage all your active and historical shipments
          </p>
        </div>
        <div className="flex gap-3">
          <button className="glass-panel px-6 py-3 rounded-lg border border-white/20 text-on-surface hover:border-white/40 transition-colors flex items-center gap-2 font-label-caps text-xs uppercase">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="px-6 py-3 bg-linear-to-r from-primary to-primary/80 text-on-primary rounded-lg font-label-caps text-xs uppercase hover:opacity-90 transition-opacity flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Shipment
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <GlassPanel className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-lg border border-outline-variant">
              <Search className="w-5 h-5 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search by ID, origin, or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant text-sm"
              />
            </div>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as RiskLevel)}
              className="px-4 py-2 bg-surface-container-low rounded-lg border border-outline-variant text-on-surface outline-none text-sm"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
            {(['all', 'in-transit', 'delivered', 'pending', 'delayed'] as FilterType[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-semibold text-xs uppercase transition-all ${
                    filter === status
                      ? 'bg-primary/20 border border-primary/50 text-on-primary'
                      : 'bg-surface-container border border-white/10 text-on-surface-variant hover:border-white/20'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </div>
        </GlassPanel>
      </div>

      {/* Shipments Table */}
      <GlassPanel className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-xs font-label-caps uppercase text-on-surface-variant">
                Shipment ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-label-caps uppercase text-on-surface-variant">
                Route
              </th>
              <th className="px-6 py-4 text-left text-xs font-label-caps uppercase text-on-surface-variant">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-label-caps uppercase text-on-surface-variant">
                Risk Score
              </th>
              <th className="px-6 py-4 text-left text-xs font-label-caps uppercase text-on-surface-variant">
                ETA
              </th>
              <th className="px-6 py-4 text-left text-xs font-label-caps uppercase text-on-surface-variant">
                Last Update
              </th>
              <th className="px-6 py-4 text-left text-xs font-label-caps uppercase text-on-surface-variant">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredShipments.map((shipment, i) => {
              const riskLevel = getRiskLevel(shipment.riskScore || 0)
              return (
                <motion.tr
                  key={shipment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-surface-container/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedShipmentId(shipment.id)}
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-primary hover:underline">
                      {shipment.trackingId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-on-surface">
                      {shipment.origin} → {shipment.destination}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        shipment.status === 'delivered'
                          ? 'bg-emerald-400/20 text-emerald-400'
                          : shipment.status === 'delayed'
                          ? 'bg-error/20 text-error'
                          : shipment.status === 'in-transit'
                          ? 'bg-cyan-400/20 text-cyan-400'
                          : 'bg-yellow-400/20 text-yellow-400'
                      }`}
                    >
                      {shipment.status.charAt(0).toUpperCase() +
                        shipment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 w-32">
                      <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${
                            riskLevel === 'low'
                              ? 'bg-emerald-400'
                              : riskLevel === 'medium'
                              ? 'bg-yellow-400'
                              : 'bg-error'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${shipment.riskScore || 0}%` }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                        />
                      </div>
                      <span className="text-xs text-on-surface-variant w-8">
                        {shipment.riskScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface">
                    {shipment.eta || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-xs text-on-surface-variant font-mono">
                    {shipment.lastUpdate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedShipmentId(shipment.id)
                          setIsOptimizeOpen(true)
                        }}
                        className="p-2 hover:bg-surface-container rounded transition-colors"
                        title="Optimize"
                      >
                        <Zap className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedShipmentId(shipment.id)
                        }}
                        className="p-2 hover:bg-surface-container rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-cyan-400" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
            {filteredShipments.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-on-surface-variant"
                >
                  No shipments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassPanel>

      {/* Modal */}
      <OptimizeModal
        isOpen={isOptimizeOpen}
        onClose={() => setIsOptimizeOpen(false)}
        shipmentId={selectedShipmentId || undefined}
      />
    </div>
  )
}
