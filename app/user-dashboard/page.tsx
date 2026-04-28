'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FlipCardGrid } from '@/components/flip-card'
import { PerformanceRing } from '@/components/performance-ring'
import { mockUserFlipCards, mockAlerts } from '@/lib/data'
import { MapPin, Plus, History, MessageCircle, Package, ArrowRight, Clock, Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
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

const notifFlipCards = mockAlerts.slice(0, 3).map((a, i) => ({
  id: `NOTIF-${i}`,
  frontTitle: a.alertType ?? 'alert',
  frontValue: a.type.toUpperCase(),
  frontSubtitle: a.timestamp,
  frontIcon: a.type === 'success' ? 'Star' : 'Bell',
  frontColor: a.type === 'success' ? 'emerald' : a.type === 'error' ? 'amber' : 'amber',
  backTitle: 'Full Alert',
  backContent: a.message,
  backStats: a.shipmentId ? [{ label: 'Shipment', value: a.shipmentId }] : undefined,
  backAction: a.shipmentId ? { label: 'View Shipment', href: `/logistics/${a.shipmentId}` } : undefined,
}))

const quickActions = [
  { label: 'Track Package', icon: MapPin, href: '/user-dashboard/track', color: 'text-cyan-400' },
  { label: 'Create Shipment', icon: Plus, href: '/logistics/create', color: 'text-emerald-400' },
  { label: 'View History', icon: History, href: '/user-dashboard/history', color: 'text-violet-400' },
  { label: 'Contact Support', icon: MessageCircle, href: 'mailto:support@smartlogistics.com', color: 'text-amber-400' },
]

export default function UserDashboardPage() {
  const [recentShipments, setRecentShipments] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('there')

  useEffect(() => {
    const stored = localStorage.getItem('user_name')
    if (stored) setUserName(stored.split(' ')[0])
  }, [])

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/shipments?limit=3`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/api/statistics`).then(r => r.json()).catch(() => null),
    ]).then(([shipmentsData, statsData]) => {
      if (shipmentsData?.success) setRecentShipments(shipmentsData.data || [])
      if (statsData?.success) setStats(statsData.data)
    }).finally(() => setLoading(false))
  }, [])

  const liveFlipCards = stats ? [
    {
      ...mockUserFlipCards[0],
      frontValue: stats.in_transit + stats.out_for_delivery,
      frontSubtitle: `${stats.out_for_delivery} out for delivery`,
    },
    {
      ...mockUserFlipCards[1],
      frontValue: stats.total > 0 ? `${Math.round((stats.delivered / stats.total) * 100)}%` : '—',
      frontSubtitle: `${stats.delivered} delivered total`,
    },
    mockUserFlipCards[2],
    mockUserFlipCards[3],
  ] : mockUserFlipCards

  return (
    <div className="space-y-8">
      {/* A. Welcome Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-pepi-thin text-on-surface">
          {getGreeting()}, {userName} 👋
        </h1>
        <p className="text-on-surface-variant font-biotif-pro mt-1">
          {stats ? (
            <>
              <span className="text-cyan-400 font-semibold">{stats.in_transit} in transit</span>
              {' · '}
              <span className="text-yellow-400 font-semibold">{stats.pending} pending</span>
              {' · '}
              <span className="text-emerald-400 font-semibold">{stats.delivered_today} delivered today</span>
            </>
          ) : 'Loading your shipment summary…'}
        </p>
      </motion.div>

      {/* B. Flip Card Grid */}
      <FlipCardGrid cards={liveFlipCards} data-testid="user-flip-grid" />

      {/* C. Recent Shipments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-pepi-thin text-on-surface">Recent Shipments</h2>
          <Link href="/user-dashboard/my-shipments" className="text-xs text-primary hover:underline">View all →</Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-3 text-on-surface-variant">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : recentShipments.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {recentShipments.map((s: any, i: number) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface-container border border-white/10 p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-mono text-on-surface-variant">{s.tracking_id}</p>
                    <p className="text-sm font-medium text-on-surface flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {s.sender_city || 'Origin'}
                      <ArrowRight className="w-3 h-3 text-on-surface-variant" />
                      {s.receiver_city || 'Destination'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 border shrink-0 ${statusColors[s.status] || 'text-on-surface-variant border-white/10'}`}>
                    {s.status}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">{s.package_type} · {s.weight} kg</p>
                <div className="flex items-center justify-between text-xs mt-3">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {s.estimated_delivery ? new Date(s.estimated_delivery).toLocaleDateString('en-IN') : '—'}
                  </span>
                  <Link href={`/user-dashboard/track?id=${s.tracking_id}`} className="text-primary hover:underline">
                    Track →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-on-surface-variant">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No shipments yet.</p>
            <Link href="/logistics/create" className="text-sm text-primary hover:underline mt-1 block">Create your first shipment →</Link>
          </div>
        )}
      </div>

      {/* D. Quick Actions */}
      <div>
        <h2 className="text-xl font-pepi-thin text-on-surface mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={action.href}
                className="flex flex-col items-center justify-center gap-3 p-6 bg-surface-container border border-white/10 hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <action.icon className={`w-8 h-8 ${action.color} group-hover:scale-110 transition-transform`} />
                <span className="text-sm font-biotif-pro text-on-surface-variant group-hover:text-on-surface transition-colors text-center">
                  {action.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* E. Notifications */}
      <div>
        <h2 className="text-xl font-pepi-thin text-on-surface mb-4">Recent Notifications</h2>
        <FlipCardGrid cards={notifFlipCards} />
      </div>

      {/* F. Performance snapshot */}
      <div className="bg-surface-container-low border border-white/10 p-6">
        <h2 className="text-xl font-pepi-thin text-on-surface mb-6">My Performance</h2>
        <div className="flex flex-wrap items-center gap-8">
          <PerformanceRing score={88} size={140} label="Overall Score" />
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Delivery Accuracy', value: 94, color: 'bg-emerald-400' },
              { label: 'Response Time', value: 92, color: 'bg-cyan-400' },
              { label: 'Documentation', value: 78, color: 'bg-amber-400' },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-on-surface-variant font-biotif-pro">{m.label}</span>
                  <span className="text-on-surface">{m.value}%</span>
                </div>
                <div className="h-1.5 bg-surface-container-high overflow-hidden">
                  <motion.div
                    className={`h-full ${m.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
