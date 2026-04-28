'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FlipCard } from '@/components/flip-card'
import type { FlipCardData } from '@/lib/types'

const systemCards: FlipCardData[] = [
  { id: 'SYS1', frontTitle: 'API Status', frontValue: '✅ Operational', frontSubtitle: 'All endpoints live', frontIcon: 'Activity', frontColor: 'emerald', backTitle: 'API Latency', backContent: 'All API endpoints responding normally.', backStats: [{ label: 'P50', value: '42ms' }, { label: 'P95', value: '120ms' }, { label: 'P99', value: '250ms' }] },
  { id: 'SYS2', frontTitle: 'Database', frontValue: '8ms avg', frontSubtitle: '99.99% uptime', frontIcon: 'Activity', frontColor: 'cyan', backTitle: 'Database Stats', backContent: 'PostgreSQL via Supabase. Connection pool healthy.', backStats: [{ label: 'Connections', value: '12/50' }, { label: 'Query Avg', value: '8ms' }, { label: 'Cache Hit', value: '97%' }] },
  { id: 'SYS3', frontTitle: 'Background Jobs', frontValue: '12 running', frontSubtitle: '0 failed', frontIcon: 'Activity', frontColor: 'violet', backTitle: 'Job Queue', backContent: 'Worker processes running normally. No failures in last 24h.', backStats: [{ label: 'Completed', value: '1,482' }, { label: 'Running', value: '12' }, { label: 'Failed', value: '0' }] },
  { id: 'SYS4', frontTitle: 'Storage', frontValue: '43% used', frontSubtitle: '2.1 GB / 5 GB', frontIcon: 'Activity', frontColor: 'amber', backTitle: 'Storage Breakdown', backContent: 'Storage is within healthy limits.', backStats: [{ label: 'Shipment Docs', value: '1.2 GB' }, { label: 'Media', value: '0.6 GB' }, { label: 'Logs', value: '0.3 GB' }] },
]

const mockLogs = [
  { time: '10:32:14', level: 'INFO', msg: 'Shipment SHP-001 status updated to in-transit' },
  { time: '10:31:02', level: 'WARN', msg: 'High traffic on Route 70, ETA adjusted by 2h' },
  { time: '10:29:45', level: 'INFO', msg: 'User alex@smartlogistics.com logged in' },
  { time: '10:28:00', level: 'ERROR', msg: 'Failed to send delivery notification (retry 1/3)' },
  { time: '10:25:11', level: 'INFO', msg: 'Background job: route optimization completed' },
]

const levelColors: Record<string, string> = { INFO: 'text-cyan-400', WARN: 'text-amber-400', ERROR: 'text-red-400' }

export default function AdminSystemPage() {
  const [maintenance, setMaintenance] = useState(false)
  const [confirm, setConfirm] = useState(false)

  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-pepi-thin text-on-surface">System Health</motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemCards.map((card, i) => (
          <motion.div key={card.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <FlipCard data={card} />
          </motion.div>
        ))}
      </div>

      {/* Logs */}
      <div className="bg-surface-container-low border border-white/10 p-6">
        <h2 className="text-xl font-pepi-thin text-on-surface mb-4">Recent System Logs</h2>
        <div className="font-mono text-xs space-y-2">
          {mockLogs.map((log, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-on-surface-variant w-20 shrink-0">{log.time}</span>
              <span className={`w-12 shrink-0 font-bold ${levelColors[log.level]}`}>{log.level}</span>
              <span className="text-on-surface">{log.msg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance Toggle */}
      <div className="bg-surface-container-low border border-amber-400/30 p-6">
        <h2 className="text-xl font-pepi-thin text-on-surface mb-2">Maintenance Mode</h2>
        <p className="text-sm text-on-surface-variant mb-4">Enabling maintenance mode will take the platform offline for users.</p>
        {confirm ? (
          <div className="flex gap-3">
            <button onClick={() => { setMaintenance(!maintenance); setConfirm(false) }} className="text-sm px-4 py-2 bg-amber-400 text-black font-semibold hover:bg-amber-300 transition-colors">
              Confirm {maintenance ? 'Disable' : 'Enable'}
            </button>
            <button onClick={() => setConfirm(false)} className="text-sm px-4 py-2 border border-white/10 text-on-surface-variant hover:border-white/20 transition-colors">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setConfirm(true)} className={`text-sm px-4 py-2 border transition-colors ${maintenance ? 'border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10' : 'border-amber-400/30 text-amber-400 hover:bg-amber-400/10'}`}>
            {maintenance ? 'Disable Maintenance' : 'Enable Maintenance'}
          </button>
        )}
      </div>
    </div>
  )
}
