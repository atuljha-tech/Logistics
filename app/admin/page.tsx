'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FlipCardGrid } from '@/components/flip-card'
import { PerformanceRing } from '@/components/performance-ring'
import {
  mockAdminStats,
  mockAdminFlipCards,
  mockShipments,
  mockAlerts,
  mockUserProfiles,
  mockAnalyticsData,
} from '@/lib/data'
import {
  ArrowRight, Eye, Zap, TrendingUp, TrendingDown,
  Star, Clock, Users, Package2, Activity, CheckCircle,
  AlertCircle, XCircle, Plus, Loader2
} from 'lucide-react'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface LiveStats {
  total: number
  pending: number
  in_transit: number
  out_for_delivery: number
  delivered: number
  delivered_today: number
  created_this_month: number
}

const statusColors: Record<string, string> = {
  'in-transit': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
  'delivered': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  'pending': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  'delayed': 'text-red-400 bg-red-400/10 border-red-400/30',
}

const alertTypeIcon: Record<string, React.ReactNode> = {
  warning: <AlertCircle className="w-4 h-4 text-amber-400" />,
  error: <XCircle className="w-4 h-4 text-red-400" />,
  success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
}

export default function AdminPage() {
  const [liveStats, setLiveStats] = useState<LiveStats | null>(null)
  const [recentShipments, setRecentShipments] = useState<any[]>([])
  const [statsLoading, setStatsLoading] = useState(true)
  const [userName, setUserName] = useState('Admin')

  useEffect(() => {
    const stored = localStorage.getItem('user_name')
    if (stored) setUserName(stored)
  }, [])

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/statistics`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/api/shipments?limit=5`).then(r => r.json()).catch(() => null),
    ]).then(([statsData, shipmentsData]) => {
      if (statsData?.success) setLiveStats(statsData.data)
      if (shipmentsData?.success) setRecentShipments(shipmentsData.data || [])
    }).finally(() => setStatsLoading(false))
  }, [])

  const quickMetrics = [
    { label: 'Total Shipments', value: liveStats ? liveStats.total.toLocaleString() : '…', trend: null, up: true },
    { label: 'In Transit', value: liveStats ? liveStats.in_transit.toLocaleString() : '…', trend: null, up: true },
    { label: 'Delivered Today', value: liveStats ? liveStats.delivered_today.toLocaleString() : '…', trend: null, up: true },
    { label: 'Pending', value: liveStats ? liveStats.pending.toLocaleString() : '…', sub: null, up: false },
    { label: 'System Uptime', value: '99.97%', trend: '30d avg', up: true },
    { label: 'Pending Approvals', value: mockAdminStats.pendingApprovals.toString(), sub: '2 urgent', up: false },
  ]

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-8">
      {/* A. Welcome Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-pepi-thin text-on-surface">Welcome back, {userName}</h1>
          <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 font-biotif-pro">ADMIN</span>
        </div>
        <p className="text-on-surface-variant font-biotif-pro mt-1">{dateStr}</p>
      </motion.div>

      {/* B. Flip Card Grid */}
      <FlipCardGrid cards={mockAdminFlipCards} data-testid="admin-flip-grid" />

      {/* C. Quick Metrics Bar */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {quickMetrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="bg-surface-container border border-white/10 p-4"
          >
            <p className="text-xs text-on-surface-variant font-biotif-pro mb-1">{m.label}</p>
            <p className="text-xl font-pepi-thin text-on-surface">{m.value}</p>
            {m.trend && (
              <p className={`text-xs mt-0.5 flex items-center gap-1 ${m.up ? 'text-emerald-400' : 'text-amber-400'}`}>
                {m.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {m.trend}
              </p>
            )}
            {m.sub && <p className="text-xs text-on-surface-variant mt-0.5">{m.sub}</p>}
          </motion.div>
        ))}
      </motion.div>

      {/* D. Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Shipments (2/3) */}
        <div className="lg:col-span-2 bg-surface-container-low border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-pepi-thin text-on-surface">Recent Shipments</h2>
            <Link href="/logistics/create" className="flex items-center gap-1 text-xs text-primary border border-primary/30 px-3 py-1.5 hover:bg-primary/10 transition-colors">
              <Plus className="w-3 h-3" /> New Shipment
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-on-surface-variant border-b border-white/10">
                  <th className="text-left pb-3 font-biotif-pro font-medium">Tracking ID</th>
                  <th className="text-left pb-3 font-biotif-pro font-medium">Sender</th>
                  <th className="text-left pb-3 font-biotif-pro font-medium">Receiver</th>
                  <th className="text-left pb-3 font-biotif-pro font-medium">Status</th>
                  <th className="text-left pb-3 font-biotif-pro font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {statsLoading ? (
                  <tr><td colSpan={5} className="py-8 text-center"><Loader2 className="w-4 h-4 animate-spin text-on-surface-variant mx-auto" /></td></tr>
                ) : recentShipments.length > 0 ? recentShipments.map((s: any) => (
                  <tr key={s.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="py-3 font-mono text-xs text-primary">{s.tracking_id}</td>
                    <td className="py-3 text-on-surface">{s.sender_name}</td>
                    <td className="py-3 text-on-surface">{s.receiver_name}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 border ${
                        s.status === 'In Transit' ? 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30' :
                        s.status === 'Delivered' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' :
                        s.status === 'Pending' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' :
                        'text-red-400 bg-red-400/10 border-red-400/30'
                      }`}>{s.status}</span>
                    </td>
                    <td className="py-3">
                      <Link href={`/logistics/${s.id}`}>
                        <Eye className="w-4 h-4 text-on-surface-variant hover:text-primary transition-colors" />
                      </Link>
                    </td>
                  </tr>
                )) : mockShipments.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="py-3 font-mono text-xs text-on-surface-variant">{s.id}</td>
                    <td className="py-3 text-on-surface">{s.origin}</td>
                    <td className="py-3 text-on-surface">{s.destination}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 border ${statusColors[s.status]}`}>{s.status}</span>
                    </td>
                    <td className="py-3">
                      <Link href={`/logistics/${s.id}`}>
                        <Eye className="w-4 h-4 text-on-surface-variant hover:text-primary transition-colors" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="/admin/shipments" className="text-xs text-primary hover:underline mt-3 block">View all shipments →</Link>
        </div>

        {/* Right column (1/3) */}
        <div className="space-y-4">
          {/* Recent Alerts */}
          <div className="bg-surface-container-low border border-white/10 p-5">
            <h3 className="text-base font-pepi-thin text-on-surface mb-3">Recent Alerts</h3>
            <div className="space-y-3">
              {mockAlerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className="flex items-start gap-2">
                  {alertTypeIcon[alert.type]}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-on-surface truncate">{alert.message}</p>
                    <p className="text-xs text-on-surface-variant">{alert.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/admin/alerts" className="text-xs text-primary hover:underline mt-3 block">View all alerts →</Link>
          </div>

          {/* Pending Approvals mini-list */}
          <div className="bg-surface-container-low border border-white/10 p-5">
            <h3 className="text-base font-pepi-thin text-on-surface mb-3">Pending Approvals</h3>
            <div className="space-y-3">
              {[
                { title: 'Route Override — SHP-004', type: 'urgent', requester: 'Sam Chen' },
                { title: 'New User: david@co.com', type: 'normal', requester: 'System' },
                { title: 'Bulk Export Request', type: 'low', requester: 'Maria Garcia' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-on-surface">{item.title}</p>
                    <p className="text-xs text-on-surface-variant">{item.requester}</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="text-xs px-2 py-0.5 bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/20 transition-colors">✓</button>
                    <button className="text-xs px-2 py-0.5 bg-red-400/10 text-red-400 border border-red-400/30 hover:bg-red-400/20 transition-colors">✗</button>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/admin/approvals" className="text-xs text-primary hover:underline mt-3 block">View all →</Link>
          </div>
        </div>
      </div>

      {/* E. Analytics Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-low border border-white/10 p-6">
          <h3 className="text-base font-pepi-thin text-on-surface mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={mockAnalyticsData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#c4c7c8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#201f1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0 }} />
              <Area type="monotone" dataKey="revenue" stroke="#34d399" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-surface-container-low border border-white/10 p-6">
          <h3 className="text-base font-pepi-thin text-on-surface mb-4">Efficiency Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={mockAnalyticsData}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#c4c7c8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#201f1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0 }} />
              <Line type="monotone" dataKey="efficiency" stroke="#60a5fa" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* F. User Activity Table */}
      <div className="bg-surface-container-low border border-white/10 p-6">
        <h2 className="text-xl font-pepi-thin text-on-surface mb-4">User Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-on-surface-variant border-b border-white/10">
                <th className="text-left pb-3 font-biotif-pro font-medium">User</th>
                <th className="text-left pb-3 font-biotif-pro font-medium">Role</th>
                <th className="text-left pb-3 font-biotif-pro font-medium">Department</th>
                <th className="text-left pb-3 font-biotif-pro font-medium">Active</th>
                <th className="text-left pb-3 font-biotif-pro font-medium">Performance</th>
                <th className="text-left pb-3 font-biotif-pro font-medium">Last Login</th>
                <th className="text-left pb-3 font-biotif-pro font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockUserProfiles.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container/50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="text-on-surface font-medium">{u.name}</p>
                        <p className="text-xs text-on-surface-variant">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 border ${
                      u.role === 'admin' ? 'text-red-400 border-red-400/30 bg-red-400/10' :
                      u.role === 'manager' ? 'text-violet-400 border-violet-400/30 bg-violet-400/10' :
                      'text-cyan-400 border-cyan-400/30 bg-cyan-400/10'
                    }`}>{u.role}</span>
                  </td>
                  <td className="py-3 text-on-surface-variant">{u.department}</td>
                  <td className="py-3 text-on-surface">{u.activeShipments}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-surface-container-high overflow-hidden w-16">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${u.performanceScore}%` }}
                        />
                      </div>
                      <span className="text-xs text-on-surface">{u.performanceScore}</span>
                    </div>
                  </td>
                  <td className="py-3 text-xs text-on-surface-variant">{u.lastLogin}</td>
                  <td className="py-3">
                    <button className="text-xs text-primary hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
