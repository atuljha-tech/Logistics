'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  MapPin,
  Search,
  Truck,
  Zap,
} from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// ---- Types ----
interface Shipment {
  id: string
  origin: string
  destination: string
  status: string
  current_location: string
  eta: string
  route: string[]
  alternate_route: string[]
}

interface RiskData {
  shipmentId: string
  riskScore: number
  riskLevel: 'low' | 'medium' | 'high'
  weatherImpact: number
  trafficImpact: number
  weatherCondition: string
  trafficType: string
}

interface ShipmentWithRisk extends Shipment {
  risk?: RiskData
  riskLoading?: boolean
}

// ---- Helpers ----
const STATUSES = ['All', 'in-transit', 'delivered', 'pending', 'delayed']

function getRiskColor(level?: string) {
  switch (level) {
    case 'high':   return 'text-red-400 bg-red-400/10 border-red-400/30'
    case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
    case 'low':    return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
    default:       return 'text-on-surface-variant bg-surface-container border-outline-variant'
  }
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'in-transit':  return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30'
    case 'delivered':   return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
    case 'delayed':     return 'text-red-400 bg-red-400/10 border-red-400/30'
    default:            return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

// ---- Component ----
export default function SupplyChainPage() {
  const router = useRouter()
  const [shipments, setShipments] = useState<ShipmentWithRisk[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE}/shipments`)
        if (!res.ok) throw new Error(`Server responded with ${res.status}`)
        const json = await res.json()
        if (!json.success) throw new Error(json.error || 'Failed to fetch shipments')

        const base: ShipmentWithRisk[] = (json.data as Shipment[]).map((s) => ({
          ...s,
          riskLoading: true,
        }))
        setShipments(base)
        setLoading(false)

        // Fetch all risk predictions in parallel
        const riskResults = await Promise.allSettled(
          base.map((s) =>
            fetch(`${API_BASE}/predict-risk/${s.id}`)
              .then((r) => r.json())
              .then((j) => (j.success ? (j.data as RiskData) : null))
              .catch(() => null)
          )
        )

        setShipments(
          base.map((s, i) => ({
            ...s,
            risk: riskResults[i].status === 'fulfilled' ? (riskResults[i] as PromiseFulfilledResult<RiskData | null>).value ?? undefined : undefined,
            riskLoading: false,
          }))
        )
      } catch (err: unknown) {
        setLoading(false)
        setError(err instanceof Error ? err.message : 'Unexpected error')
      }
    }
    load()
  }, [])

  // ---- Filtering ----
  const filtered = shipments.filter((s) => {
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      s.id.toLowerCase().includes(q) ||
      s.origin.toLowerCase().includes(q) ||
      s.destination.toLowerCase().includes(q)
    const matchesStatus =
      statusFilter === 'All' ||
      s.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  // ---- Metrics ----
  const totalShipments = shipments.length
  const risked = shipments.filter((s) => s.risk)
  const avgRisk =
    risked.length > 0
      ? Math.round(risked.reduce((acc, s) => acc + (s.risk?.riskScore ?? 0), 0) / risked.length)
      : 0
  const highRiskCount = risked.filter((s) => s.risk?.riskLevel === 'high').length

  // ---- Render ----
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-on-surface-variant">Loading supply chain data…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h2 className="text-h3 font-h3 text-on-surface mb-2">Failed to load data</h2>
          <p className="text-body-md text-on-surface-variant mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-on-surface mb-1">Supply Chain Overview</h1>
        <p className="text-on-surface-variant">AI-powered risk predictions &amp; route optimization</p>
      </motion.div>

      {/* Metrics */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { label: 'Total Shipments', value: totalShipments, icon: Truck, color: 'text-cyan-400' },
          { label: 'Average Risk Score', value: `${avgRisk}%`, icon: Zap, color: 'text-yellow-400' },
          { label: 'High Risk', value: highRiskCount, icon: AlertTriangle, color: 'text-red-400' },
        ].map((m) => (
          <div
            key={m.label}
            className="bg-surface-container p-5 border border-outline-variant flex items-center gap-4"
          >
            <m.icon className={`w-8 h-8 ${m.color} shrink-0`} />
            <div>
              <p className="text-2xl font-bold text-on-surface">{m.value}</p>
              <p className="text-sm text-on-surface-variant">{m.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search by ID, origin, destination…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface-container border border-outline-variant text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                statusFilter === s
                  ? 'bg-primary/20 border-primary/40 text-primary'
                  : 'bg-surface-container border-outline-variant text-on-surface-variant hover:border-primary/30 hover:text-on-surface'
              }`}
            >
              {s === 'All' ? 'All' : s.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="text-lg">No shipments match your search.</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filtered.map((s) => (
            <motion.div
              key={s.id}
              variants={cardVariants}
              onClick={() => router.push(`/supply-chain/${s.id}`)}
              className="group bg-surface-container border border-outline-variant hover:border-primary/40 p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-on-surface-variant font-mono mb-1">{s.id}</p>
                  <p className="text-on-surface font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    {s.origin}
                    <span className="text-on-surface-variant mx-1">→</span>
                    {s.destination}
                  </p>
                </div>
                {/* Risk badge */}
                {s.riskLoading ? (
                  <Loader2 className="w-4 h-4 text-on-surface-variant animate-spin mt-1" />
                ) : s.risk ? (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getRiskColor(s.risk.riskLevel)}`}>
                    {s.risk.riskScore}% {s.risk.riskLevel}
                  </span>
                ) : null}
              </div>

              {/* Divider */}
              <div className="border-t border-white/5 my-3" />

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-on-surface-variant text-xs mb-0.5">Status</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getStatusColor(s.status)}`}>
                    {s.status.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                </div>
                <div>
                  <p className="text-on-surface-variant text-xs mb-0.5">ETA</p>
                  <p className="text-on-surface flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {s.eta}
                  </p>
                </div>
                <div>
                  <p className="text-on-surface-variant text-xs mb-0.5">Location</p>
                  <p className="text-on-surface">{s.current_location}</p>
                </div>
                {s.risk && (
                  <div>
                    <p className="text-on-surface-variant text-xs mb-0.5">Weather / Traffic</p>
                    <p className="text-on-surface">
                      {s.risk.weatherImpact}%&nbsp;/&nbsp;{s.risk.trafficImpact}%
                    </p>
                  </div>
                )}
              </div>

              {/* Footer prompt */}
              <div className="mt-4 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> View route optimization →
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
