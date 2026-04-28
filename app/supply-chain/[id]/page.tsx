'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Loader2,
  MapPin,
  Navigation,
  Zap,
} from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

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

interface RouteOptimization {
  shipmentId: string
  originalRoute: string[]
  optimizedRoute: string[]   // backend returns this key (not alternateRoute)
  timeSaved: number
  costSaved: number
  riskReduction: number
  confidence: number
  distance: string
}

// ---- Helpers ----
function getRiskColor(level?: string) {
  switch (level) {
    case 'high':   return { text: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' }
    case 'medium': return { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' }
    case 'low':    return { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' }
    default:       return { text: 'text-on-surface-variant', bg: 'bg-surface-container', border: 'border-outline-variant' }
  }
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 bg-surface-container-high overflow-hidden">
      <motion.div
        className={`h-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 1, delay: 0.3 }}
      />
    </div>
  )
}

function RouteDisplay({ stops, label, color }: { stops: string[]; label: string; color: string }) {
  if (!stops || stops.length === 0) return null
  return (
    <div>
      <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">{label}</p>
      <div className="flex flex-wrap items-center gap-2">
        {stops.map((stop, i) => (
          <React.Fragment key={i}>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 border text-sm font-medium ${color}`}>
              <MapPin className="w-3.5 h-3.5" />
              {stop}
            </div>
            {i < stops.length - 1 && (
              <ArrowRight className="w-4 h-4 text-on-surface-variant shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// ---- Component ----
export default function SupplyChainDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [risk, setRisk] = useState<RiskData | null>(null)
  const [optimization, setOptimization] = useState<RouteOptimization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showOptimized, setShowOptimized] = useState(false)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    if (!id) return
    async function load() {
      try {
        setLoading(true)
        const [shipmentsRes, riskRes, optimizeRes] = await Promise.allSettled([
          fetch(`${API_BASE}/shipments`).then((r) => r.json()),
          fetch(`${API_BASE}/predict-risk/${id}`).then((r) => r.json()),
          fetch(`${API_BASE}/optimize-route/${id}`).then((r) => r.json()),
        ])

        // Shipment
        if (shipmentsRes.status === 'fulfilled' && shipmentsRes.value.success) {
          const found = (shipmentsRes.value.data as Shipment[]).find((s) => s.id === id)
          if (!found) throw new Error('Shipment not found')
          setShipment(found)
        } else {
          throw new Error('Failed to fetch shipments')
        }

        // Risk — safe, no crash if missing
        if (riskRes.status === 'fulfilled' && riskRes.value?.success) {
          setRisk(riskRes.value.data as RiskData)
        }

        // Optimization — safe, no crash if missing
        if (optimizeRes.status === 'fulfilled' && optimizeRes.value?.success) {
          const raw = optimizeRes.value.data
          // Backend key is `optimizedRoute`, not `alternateRoute`
          setOptimization({
            ...raw,
            optimizedRoute: raw.optimizedRoute ?? raw.alternateRoute ?? [],
            originalRoute: raw.originalRoute ?? [],
          } as RouteOptimization)
        }

        setLoading(false)
      } catch (err: unknown) {
        setLoading(false)
        setError(err instanceof Error ? err.message : 'Unexpected error')
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-on-surface-variant">Analysing shipment data…</p>
        </div>
      </div>
    )
  }

  if (error || !shipment) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-red-500/10 border border-red-500/30 p-8 max-w-md">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h2 className="text-h3 font-h3 text-on-surface mb-2">Could not load shipment</h2>
          <p className="text-body-md text-on-surface-variant mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-surface-container text-on-surface border border-outline-variant hover:border-primary/30 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const riskColors = getRiskColor(risk?.riskLevel)
  const currentRoute = showOptimized
    ? (optimization?.optimizedRoute ?? shipment.alternate_route ?? [])
    : (optimization?.originalRoute ?? shipment.route ?? [])

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Supply Chain
      </motion.button>

      {/* High-risk alert */}
      {risk?.riskLevel === 'high' && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 bg-red-400/10 border border-red-400/30 p-4"
        >
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-400">High Risk Detected</p>
            <p className="text-sm text-on-surface-variant">
              This shipment has a risk score of <strong>{risk.riskScore}%</strong>. Consider applying the optimized route.
            </p>
          </div>
        </motion.div>
      )}

      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container border border-outline-variant p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-mono text-on-surface-variant mb-1">{shipment.id}</p>
            <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {shipment.origin}
              <ArrowRight className="w-5 h-5 text-on-surface-variant" />
              {shipment.destination}
            </h1>
          </div>
          {risk && (
            <span className={`text-sm font-semibold px-3 py-1.5 border ${riskColors.text} ${riskColors.bg} ${riskColors.border}`}>
              {risk.riskScore}% risk · {risk.riskLevel}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Status', value: shipment.status.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) },
            { label: 'Current Location', value: shipment.current_location },
            { label: 'ETA', value: shipment.eta },
            { label: 'Route Stops', value: `${(shipment.route ?? []).length} waypoints` },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-on-surface-variant mb-1">{item.label}</p>
              <p className="text-on-surface font-medium">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Breakdown */}
        {risk && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-container border border-outline-variant p-6 space-y-5"
          >
            <h2 className="text-lg font-semibold text-on-surface flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" /> Risk Breakdown
            </h2>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-on-surface-variant">Weather Impact</span>
                <span className="text-on-surface font-medium">{risk.weatherImpact}%</span>
              </div>
              <ProgressBar value={risk.weatherImpact} color="bg-gradient-to-r from-blue-400 to-cyan-400" />
              <p className="text-xs text-on-surface-variant mt-1">Condition: {risk.weatherCondition}</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-on-surface-variant">Traffic Impact</span>
                <span className="text-on-surface font-medium">{risk.trafficImpact}%</span>
              </div>
              <ProgressBar value={risk.trafficImpact} color="bg-gradient-to-r from-orange-400 to-red-400" />
              <p className="text-xs text-on-surface-variant mt-1">Traffic: {risk.trafficType}</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-on-surface-variant">Overall Risk Score</span>
                <span className={`font-semibold ${riskColors.text}`}>{risk.riskScore}%</span>
              </div>
              <ProgressBar
                value={risk.riskScore}
                color={
                  risk.riskLevel === 'high'
                    ? 'bg-gradient-to-r from-red-400 to-rose-500'
                    : risk.riskLevel === 'medium'
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                    : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                }
              />
            </div>
          </motion.div>
        )}

        {/* Optimization Metrics */}
        {optimization && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-surface-container border border-outline-variant p-6 space-y-5"
          >
            <h2 className="text-lg font-semibold text-on-surface flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" /> Route Optimization
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Time Saved', value: `${optimization.timeSaved}h`, color: 'text-emerald-400' },
                { label: 'Risk Reduction', value: `${optimization.riskReduction}%`, color: 'text-cyan-400' },
                { label: 'Confidence', value: `${optimization.confidence}%`, color: 'text-primary' },
              ].map((m) => (
                <div key={m.label} className="bg-surface-container-high p-3 text-center">
                  <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-on-surface-variant">Distance: <strong className="text-on-surface">{optimization.distance}</strong></span>
              <span className="text-on-surface-variant">Cost Saved: <strong className="text-emerald-400">₹{optimization.costSaved}</strong></span>
            </div>

            <div>
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">AI Suggestions</p>
              <ul className="space-y-2">
                {[
                  `Switch to optimized route via ${optimization.optimizedRoute[1] ?? 'transit hub'}`,
                  `Expected to save ${optimization.timeSaved}h in transit time`,
                  `Risk reduction of ${optimization.riskReduction}% with ${optimization.confidence}% AI confidence`,
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>

      {/* Route View */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface-container border border-outline-variant p-6 space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-on-surface flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> Route Comparison
          </h2>
          {optimization && (
            <div className="flex items-center gap-2 bg-surface-container-high p-1">
              <button
                onClick={() => setShowOptimized(false)}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                  !showOptimized
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Original
              </button>
              <button
                onClick={() => setShowOptimized(true)}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                  showOptimized
                    ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Optimized ✨
              </button>
            </div>
          )}
        </div>

        <RouteDisplay
          stops={currentRoute}
          label={showOptimized ? 'Optimized Route' : 'Original Route'}
          color={
            showOptimized
              ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
              : 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30'
          }
        />

        {/* Side-by-side when optimization available */}
        {optimization && !showOptimized && (optimization.optimizedRoute ?? []).length > 0 && (
          <RouteDisplay
            stops={optimization.optimizedRoute}
            label="Optimized Alternative"
            color="text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
          />
        )}
      </motion.div>

      {/* Apply button */}
      {optimization && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex justify-end"
        >
          <button
            disabled={applied}
            onClick={() => { setApplied(true); setShowOptimized(true) }}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all ${
              applied
                ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30 cursor-default'
                : 'bg-primary text-on-primary hover:bg-primary/90'
            }`}
          >
            {applied ? (
              <><CheckCircle className="w-5 h-5" /> Optimized Route Applied</>
            ) : (
              <><Zap className="w-5 h-5" /> Apply Optimized Route</>
            )}
          </button>
        </motion.div>
      )}
    </div>
  )
}
