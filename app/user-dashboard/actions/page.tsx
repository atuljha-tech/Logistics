'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, FileText, Weight } from 'lucide-react'

const actionItems = [
  { id: 'A1', title: 'Customs Form — SHP-002', desc: 'Complete and submit by 5PM today', icon: FileText, urgent: true, color: 'text-red-400 border-red-400/30 bg-red-400/10' },
  { id: 'A2', title: 'Weight Discrepancy — SHP-004', desc: 'Verify actual weight vs declared 390kg', icon: Weight, urgent: false, color: 'text-amber-400 border-amber-400/30 bg-amber-400/10' },
  { id: 'A3', title: 'Signature Confirmation — SHP-001', desc: 'Awaiting digital signature for Denver hub', icon: CheckCircle, urgent: false, color: 'text-violet-400 border-violet-400/30 bg-violet-400/10' },
]

export default function ActionsPage() {
  const [done, setDone] = useState<string[]>([])

  const pending = actionItems.filter(a => !done.includes(a.id))

  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-pepi-thin text-on-surface">
        Pending Actions <span className="text-xl text-on-surface-variant">({pending.length})</span>
      </motion.h1>
      <div className="space-y-4">
        {pending.map((action, i) => (
          <motion.div key={action.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={`flex items-center gap-4 p-5 border ${action.color}`}>
            <action.icon className="w-6 h-6 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-on-surface">{action.title}</p>
              <p className="text-sm text-on-surface-variant">{action.desc}</p>
            </div>
            {action.urgent && <span className="text-xs px-2 py-0.5 bg-red-400/20 text-red-400 border border-red-400/30">URGENT</span>}
            <button onClick={() => setDone(d => [...d, action.id])} className="text-xs px-4 py-2 bg-primary text-on-primary hover:bg-primary/90 transition-colors">Complete</button>
          </motion.div>
        ))}
        {pending.length === 0 && (
          <div className="text-center py-16 text-emerald-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-3" />
            <p className="text-xl font-pepi-thin">All actions completed!</p>
          </div>
        )}
      </div>
    </div>
  )
}
