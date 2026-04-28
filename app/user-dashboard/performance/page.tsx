'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { PerformanceRing } from '@/components/performance-ring'
import { mockUserDashboardStats } from '@/lib/data'

const metrics = [
  { label: 'Delivery Accuracy', value: 94, color: 'bg-emerald-400' },
  { label: 'Response Time', value: 92, color: 'bg-cyan-400' },
  { label: 'Documentation', value: 78, color: 'bg-amber-400' },
  { label: 'On-Time Rate', value: Math.round(mockUserDashboardStats.onTimeDeliveryRate), color: 'bg-violet-400' },
]

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-pepi-thin text-on-surface">My Performance</motion.h1>

      <div className="bg-surface-container-low border border-white/10 p-8 flex flex-wrap items-center gap-12">
        <PerformanceRing score={88} size={160} label="Overall Score" />
        <div className="flex-1 min-w-64 space-y-5">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-on-surface-variant font-biotif-pro">{m.label}</span>
                <span className="text-on-surface">{m.value}%</span>
              </div>
              <div className="h-2 bg-surface-container-high overflow-hidden">
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Shipments This Month', value: mockUserDashboardStats.myDeliveredThisMonth },
          { label: 'Active Now', value: mockUserDashboardStats.myActiveShipments },
          { label: 'On-Time Rate', value: `${mockUserDashboardStats.onTimeDeliveryRate}%` },
          { label: 'Avg Handling', value: `${mockUserDashboardStats.avgHandlingTime}h` },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container border border-white/10 p-4 text-center">
            <p className="text-2xl font-pepi-thin text-primary">{stat.value}</p>
            <p className="text-xs text-on-surface-variant font-biotif-pro mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
