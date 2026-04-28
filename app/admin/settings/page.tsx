'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-pepi-thin text-on-surface">Admin Settings</motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['General', 'Notifications', 'Security', 'Billing'].map((section) => (
          <div key={section} className="bg-surface-container-low border border-white/10 p-6">
            <h2 className="text-lg font-pepi-thin text-on-surface mb-4">{section}</h2>
            <p className="text-sm text-on-surface-variant">Configure {section.toLowerCase()} settings for the platform.</p>
            <button className="mt-4 text-sm px-4 py-2 border border-primary/30 text-primary hover:bg-primary/10 transition-colors">Edit Settings</button>
          </div>
        ))}
      </div>
    </div>
  )
}
