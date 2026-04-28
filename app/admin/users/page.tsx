'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FlipCard } from '@/components/flip-card'
import { PerformanceRing } from '@/components/performance-ring'
import { mockUserProfiles } from '@/lib/data'

const roles = ['All', 'admin', 'operator', 'manager']

export default function AdminUsersPage() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = mockUserProfiles.filter((u) => {
    const matchRole = filter === 'All' || u.role === filter
    const q = search.toLowerCase()
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    return matchRole && matchSearch
  })

  const userFlipCards = filtered.map((u) => ({
    id: u.id,
    frontTitle: u.name,
    frontValue: u.activeShipments,
    frontSubtitle: u.role,
    frontIcon: 'Users',
    frontColor: u.role === 'admin' ? 'amber' : u.role === 'manager' ? 'violet' : 'cyan',
    backTitle: u.name,
    backContent: `${u.department} · Joined ${u.joinedDate}`,
    backStats: [
      { label: 'Total Handled', value: u.totalShipmentsHandled.toString() },
      { label: 'Performance', value: `${u.performanceScore}/100` },
      { label: 'Last Login', value: u.lastLogin },
    ],
    backAction: { label: 'View Profile', href: `/admin/users` },
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-pepi-thin text-on-surface">
          User Management
        </motion.h1>
        <button className="text-sm px-4 py-2 bg-primary text-on-primary hover:bg-primary/90 transition-colors">
          + Invite User
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`text-sm px-3 py-1.5 border transition-colors ${
                filter === r ? 'border-primary/40 bg-primary/10 text-primary' : 'border-white/10 text-on-surface-variant hover:border-white/20'
              }`}
            >
              {r === 'All' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-40 px-3 py-1.5 bg-surface-container border border-white/10 text-on-surface placeholder:text-on-surface-variant text-sm outline-none focus:border-primary/40"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">No users match your search.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {userFlipCards.map((card, i) => (
            <motion.div key={card.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <div className="flex flex-col gap-3">
                <FlipCard data={card} className="h-52" />
                <div className="flex justify-center">
                  <PerformanceRing
                    score={mockUserProfiles.find(u => u.id === card.id)?.performanceScore ?? 0}
                    size={80}
                    strokeWidth={6}
                    label="Score"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
