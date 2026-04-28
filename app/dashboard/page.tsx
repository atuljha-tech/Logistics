'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Truck, TrendingUp, CheckCircle, Activity, Zap, Brain, Package, Loader2, AlertTriangle } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Stats {
  total: number
  pending: number
  in_transit: number
  out_for_delivery: number
  delivered: number
  delivered_today: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE}/api/statistics`)
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats ? [
    { label: 'Total Shipments', value: stats.total, icon: Package, color: 'text-primary', href: '/logistics' },
    { label: 'In Transit', value: stats.in_transit, icon: Truck, color: 'text-cyan-400', href: '/logistics' },
    { label: 'Delivered Today', value: stats.delivered_today, icon: CheckCircle, color: 'text-emerald-400', href: '/logistics' },
    { label: 'Pending', value: stats.pending, icon: Activity, color: 'text-yellow-400', href: '/logistics' },
  ] : []

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-pepi-thin text-on-surface">Operations Dashboard</h1>
        <p className="text-on-surface-variant mt-2 font-biotif-pro">
          Live shipment tracking and supply chain management
        </p>
      </motion.div>

      {/* Live Stats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface-container border border-white/10 p-6 flex items-center justify-center h-28">
              <Loader2 className="w-5 h-5 animate-spin text-on-surface-variant" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 border border-amber-400/30 bg-amber-400/5 text-amber-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-sm">Backend not reachable. Start the backend server on port 3001.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={card.href}
                className="block bg-surface-container border border-white/10 p-6 hover:border-white/20 transition-colors"
              >
                <card.icon className={`w-6 h-6 ${card.color} mb-3`} />
                <p className={`text-3xl font-pepi-thin ${card.color}`}>{card.value}</p>
                <p className="text-sm text-on-surface-variant font-biotif-pro mt-1">{card.label}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Access */}
      <div>
        <h2 className="text-xl font-pepi-thin text-on-surface mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: '/logistics', icon: Truck, label: 'All Shipments', desc: 'View and manage shipments', color: 'text-primary' },
            { href: '/logistics/create', icon: TrendingUp, label: 'Create Shipment', desc: 'Add a new shipment', color: 'text-emerald-400' },
            { href: '/logistics/track', icon: Activity, label: 'Track Package', desc: 'Track by tracking ID', color: 'text-cyan-400' },
            { href: '/supply-chain', icon: Zap, label: 'Supply Chain', desc: 'Risk & route optimization', color: 'text-violet-400' },
          ].map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Link
                href={item.href}
                className="block bg-surface-container border border-white/10 p-6 hover:border-white/20 transition-colors"
              >
                <item.icon className={`w-6 h-6 ${item.color} mb-3`} />
                <h3 className="font-medium text-on-surface mb-1">{item.label}</h3>
                <p className="text-sm text-on-surface-variant">{item.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Status Breakdown */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface-container-low border border-white/10 p-6"
        >
          <h2 className="text-xl font-pepi-thin text-on-surface mb-4">Status Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: 'Delivered', value: stats.delivered, total: stats.total, color: 'bg-emerald-400' },
              { label: 'In Transit', value: stats.in_transit, total: stats.total, color: 'bg-cyan-400' },
              { label: 'Out for Delivery', value: stats.out_for_delivery, total: stats.total, color: 'bg-blue-400' },
              { label: 'Pending', value: stats.pending, total: stats.total, color: 'bg-yellow-400' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-on-surface-variant">{item.label}</span>
                  <span className="text-on-surface">{item.value} / {item.total}</span>
                </div>
                <div className="h-1.5 bg-surface-container-high overflow-hidden">
                  <motion.div
                    className={`h-full ${item.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: item.total > 0 ? `${(item.value / item.total) * 100}%` : '0%' }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
