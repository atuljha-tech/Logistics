'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FlipCard } from '@/components/flip-card'
import type { FlipCardData } from '@/lib/types'

const approvalCards: FlipCardData[] = [
  { id: 'APR1', frontTitle: 'Route Override — SHP-004', frontValue: 'URGENT', frontSubtitle: 'Requested by Sam Chen · 2h ago', frontIcon: 'ClipboardCheck', frontColor: 'amber', backTitle: 'Approval Details', backContent: 'SHP-004 has been delayed 18h. Sam is requesting a route change via Denver bypass to save 4 hours.', backStats: [{ label: 'Requester', value: 'Sam Chen' }, { label: 'Priority', value: 'Urgent' }, { label: 'AI Suggests', value: 'Approve' }], backAction: { label: 'View Shipment', href: '/logistics/SHP-004' } },
  { id: 'APR2', frontTitle: 'New User Registration', frontValue: 'NORMAL', frontSubtitle: 'david@enterprise.com · 3h ago', frontIcon: 'Users', frontColor: 'cyan', backTitle: 'User Request', backContent: 'David Kim from Enterprise Co. requesting operator access. Email verified.', backStats: [{ label: 'Role Requested', value: 'operator' }, { label: 'Company', value: 'Enterprise Co.' }, { label: 'AI Suggests', value: 'Approve' }] },
  { id: 'APR3', frontTitle: 'Bulk Export Request', frontValue: 'LOW', frontSubtitle: 'Requested by Maria Garcia · 5h ago', frontIcon: 'ClipboardCheck', frontColor: 'violet', backTitle: 'Export Request', backContent: 'Maria is requesting a full export of Q4 shipment data for the board report.', backStats: [{ label: 'Data Range', value: 'Q4 2023' }, { label: 'Records', value: '3,200+' }, { label: 'AI Suggests', value: 'Approve' }] },
]

export default function AdminApprovalsPage() {
  const [resolved, setResolved] = useState<string[]>([])

  const pending = approvalCards.filter(c => !resolved.includes(c.id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-pepi-thin text-on-surface">Approval Queue</motion.h1>
        <span className="text-sm text-on-surface-variant">{pending.length} pending</span>
      </div>

      {pending.length === 0 ? (
        <div className="text-center py-16 text-emerald-400">
          <p className="text-xl">✓ All approvals handled</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pending.map((card, i) => (
            <motion.div key={card.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="space-y-2">
              <FlipCard data={card} />
              <div className="flex gap-2">
                <button onClick={() => setResolved(r => [...r, card.id])} className="flex-1 text-xs py-2 bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/20 transition-colors">
                  ✓ Approve
                </button>
                <button onClick={() => setResolved(r => [...r, card.id])} className="flex-1 text-xs py-2 bg-red-400/10 text-red-400 border border-red-400/30 hover:bg-red-400/20 transition-colors">
                  ✗ Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
