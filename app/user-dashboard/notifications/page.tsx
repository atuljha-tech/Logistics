'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FlipCard } from '@/components/flip-card'
import { mockAlerts } from '@/lib/data'
import type { FlipCardData } from '@/lib/types'

const tabs = ['Unread', 'All', 'Archived']

export default function NotificationsPage() {
  const [tab, setTab] = useState('All')
  const [markRead, setMarkRead] = useState<string[]>([])

  const notifCards: FlipCardData[] = mockAlerts.map(a => ({
    id: a.id,
    frontTitle: a.alertType ?? 'notification',
    frontValue: a.type.toUpperCase(),
    frontSubtitle: a.timestamp,
    frontIcon: 'Bell',
    frontColor: a.type === 'success' ? 'emerald' : a.type === 'error' ? 'amber' : 'violet',
    backTitle: 'Notification Detail',
    backContent: a.message,
    backStats: [
      { label: 'Type', value: a.alertType ?? 'system' },
      { label: 'Status', value: markRead.includes(a.id) ? 'Read' : 'Unread' },
    ],
    backAction: a.shipmentId ? { label: 'View Shipment', href: `/logistics/${a.shipmentId}` } : undefined,
  }))

  const filtered = tab === 'Unread' ? notifCards.filter(c => !markRead.includes(c.id)) : notifCards

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-pepi-thin text-on-surface">Notifications</motion.h1>
        <button onClick={() => setMarkRead(mockAlerts.map(a => a.id))} className="text-sm text-primary hover:underline">Mark All Read</button>
      </div>
      <div className="flex gap-1">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`text-sm px-4 py-1.5 border transition-colors ${tab === t ? 'border-primary/40 bg-primary/10 text-primary' : 'border-white/10 text-on-surface-variant hover:border-white/20'}`}>{t}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((card, i) => (
          <motion.div key={card.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="space-y-2">
            <FlipCard data={card} />
            <button onClick={() => setMarkRead(r => [...r, card.id])} className="w-full text-xs py-1.5 border border-white/10 text-on-surface-variant hover:border-white/20 hover:text-on-surface transition-colors">
              {markRead.includes(card.id) ? '✓ Read' : 'Mark Read'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
