'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FlipCard } from '@/components/flip-card'
import { mockAlerts } from '@/lib/data'
import type { FlipCardData } from '@/lib/types'

const tabs = ['Active', 'Resolved', 'All']
const typeFilters = ['All', 'weather', 'traffic', 'optimization', 'system']

export default function AdminAlertsPage() {
  const [tab, setTab] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')

  const filtered = mockAlerts.filter((a) => {
    const matchTab = tab === 'All' || (tab === 'Active' ? a.status === 'active' : a.status === 'resolved')
    const matchType = typeFilter === 'All' || a.alertType === typeFilter
    return matchTab && matchType
  })

  const alertFlipCards: FlipCardData[] = filtered.map((a) => ({
    id: a.id,
    frontTitle: a.alertType ?? 'System',
    frontValue: a.type.toUpperCase(),
    frontSubtitle: a.timestamp,
    frontIcon: 'Bell',
    frontColor: a.severity === 'high' ? 'amber' : a.severity === 'medium' ? 'violet' : 'emerald',
    backTitle: 'Alert Details',
    backContent: a.message,
    backStats: [
      { label: 'Type', value: a.alertType ?? 'system' },
      { label: 'Severity', value: a.severity ?? 'medium' },
      { label: 'Shipment', value: a.shipmentId ?? '—' },
    ],
    backAction: a.shipmentId ? { label: 'View Shipment', href: `/logistics/${a.shipmentId}` } : undefined,
  }))

  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-pepi-thin text-on-surface">
        System Alerts
      </motion.h1>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-1">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`text-sm px-4 py-1.5 border transition-colors ${tab === t ? 'border-primary/40 bg-primary/10 text-primary' : 'border-white/10 text-on-surface-variant hover:border-white/20'}`}>{t}</button>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {typeFilters.map(f => (
            <button key={f} onClick={() => setTypeFilter(f)} className={`text-sm px-3 py-1 border transition-colors capitalize ${typeFilter === f ? 'border-primary/40 bg-primary/10 text-primary' : 'border-white/10 text-on-surface-variant hover:border-white/20'}`}>{f}</button>
          ))}
        </div>
      </div>
      {alertFlipCards.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">No alerts match your filters.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {alertFlipCards.map((card, i) => (
            <motion.div key={card.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <FlipCard data={card} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
