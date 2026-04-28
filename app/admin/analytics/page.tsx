'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { mockAnalyticsData } from '@/lib/data'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const ranges = ['7D', '30D', '90D', '1Y']

interface LiveStats {
  total: number
  pending: number
  in_transit: number
  out_for_delivery: number
  delivered: number
  delivered_today: number
  created_this_month: number
  total_value: number
  total_weight: number
}

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState('30D')
  const [liveStats, setLiveStats] = useState<LiveStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE}/api/statistics`)
      .then(r => r.json())
      .then(d => { if (d.success) setLiveStats(d.data) })
      .catch(() => {})
      .finally(() => setStatsLoading(false))
  }, [])

  const statusDistribution = liveStats ? [
    { name: 'Pending', value: liveStats.pending, fill: '#fbbf24' },
    { name: 'In Transit', value: liveStats.in_transit, fill: '#22d3ee' },
    { name: 'Out for Delivery', value: liveStats.out_for_delivery, fill: '#60a5fa' },
    { name: 'Delivered', value: liveStats.delivered, fill: '#34d399' },
  ].filter(d => d.value > 0) : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-pepi-thin text-on-surface">
          Analytics
        </motion.h1>
        <div className="flex gap-1">
          {ranges.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`text-sm px-4 py-1.5 border transition-colors ${
                range === r ? 'border-primary/40 bg-primary/10 text-primary' : 'border-white/10 text-on-surface-variant hover:border-white/20'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Live Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface-container border border-white/10 p-4 flex items-center justify-center h-20">
              <Loader2 className="w-4 h-4 animate-spin text-on-surface-variant" />
            </div>
          ))
        ) : liveStats ? [
          { label: 'Total Shipments', value: liveStats.total.toLocaleString(), color: 'text-on-surface' },
          { label: 'Delivered Today', value: liveStats.delivered_today.toLocaleString(), color: 'text-emerald-400' },
          { label: 'In Transit', value: liveStats.in_transit.toLocaleString(), color: 'text-cyan-400' },
          { label: 'This Month', value: liveStats.created_this_month.toLocaleString(), color: 'text-violet-400' },
        ].map((s) => (
          <div key={s.label} className="bg-surface-container border border-white/10 p-4 text-center">
            <p className={`text-2xl font-pepi-thin ${s.color}`}>{s.value}</p>
            <p className="text-xs text-on-surface-variant font-biotif-pro mt-1">{s.label}</p>
          </div>
        )) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Over Time (mock trend data) */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-surface-container-low border border-white/10 p-6">
          <h3 className="text-base font-pepi-thin text-on-surface mb-1">Revenue Over Time</h3>
          <p className="text-xs text-on-surface-variant mb-4">Trend data (mock)</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockAnalyticsData}>
              <defs>
                <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#c4c7c8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#201f1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0 }} />
              <Area type="monotone" dataKey="revenue" stroke="#34d399" fill="url(#revG)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Shipment Volume */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface-container-low border border-white/10 p-6">
          <h3 className="text-base font-pepi-thin text-on-surface mb-1">Shipment Volume</h3>
          <p className="text-xs text-on-surface-variant mb-4">Trend data (mock)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockAnalyticsData}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#c4c7c8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#201f1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0 }} />
              <Bar dataKey="deliveries" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Live Status Distribution */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-surface-container-low border border-white/10 p-6">
          <h3 className="text-base font-pepi-thin text-on-surface mb-1">Status Distribution</h3>
          <p className="text-xs text-on-surface-variant mb-4">Live from database</p>
          {statsLoading ? (
            <div className="flex items-center justify-center h-[220px]">
              <Loader2 className="w-5 h-5 animate-spin text-on-surface-variant" />
            </div>
          ) : statusDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend iconType="square" />
                <Tooltip contentStyle={{ background: '#201f1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-on-surface-variant text-sm">
              No shipment data yet
            </div>
          )}
        </motion.div>

        {/* Efficiency Trend */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface-container-low border border-white/10 p-6">
          <h3 className="text-base font-pepi-thin text-on-surface mb-1">Efficiency Trend</h3>
          <p className="text-xs text-on-surface-variant mb-4">Trend data (mock)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockAnalyticsData}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#c4c7c8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#201f1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0 }} />
              <Line type="monotone" dataKey="efficiency" stroke="#a78bfa" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Delivered', value: liveStats ? liveStats.delivered.toLocaleString() : '—', color: 'text-emerald-400' },
          { label: 'Pending', value: liveStats ? liveStats.pending.toLocaleString() : '—', color: 'text-yellow-400' },
          { label: 'Out for Delivery', value: liveStats ? liveStats.out_for_delivery.toLocaleString() : '—', color: 'text-blue-400' },
          { label: 'Total Weight (kg)', value: liveStats ? Math.round(liveStats.total_weight).toLocaleString() : '—', color: 'text-cyan-400' },
        ].map((s) => (
          <div key={s.label} className="bg-surface-container border border-white/10 p-4 text-center">
            <p className={`text-2xl font-pepi-thin ${s.color}`}>{s.value}</p>
            <p className="text-xs text-on-surface-variant font-biotif-pro mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
