'use client'

import React from 'react'
import { Bell, Settings, Shield, ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface AdminTopBarProps {
  title?: string
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({ title = 'Admin Dashboard' }) => {
  return (
    <div className="fixed top-0 left-0 md:left-64 right-0 h-20 flex items-center justify-between px-6 border-b border-white/10 z-30 backdrop-blur-sm bg-[rgba(26,26,26,0.3)]">
      <div className="flex items-center gap-3">
        <Shield className="w-4 h-4 text-red-400" />
        <h1 className="text-lg font-pepi-thin text-on-surface">{title}</h1>
        <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5">
          ADMIN
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Switch View */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs text-on-surface-variant">Switch View:</span>
          <Link
            href="/user-dashboard"
            className="text-xs px-3 py-1 border border-white/10 text-on-surface-variant hover:border-white/20 hover:text-on-surface transition-colors"
          >
            User View
          </Link>
          <Link
            href="/dashboard"
            className="text-xs px-3 py-1 border border-white/10 text-on-surface-variant hover:border-white/20 hover:text-on-surface transition-colors"
          >
            Dashboard
          </Link>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-on-surface-variant hover:text-on-surface transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-400" />
        </button>

        <button className="p-2 text-on-surface-variant hover:text-on-surface transition-colors">
          <Settings className="w-6 h-6" />
        </button>

        <button className="flex items-center gap-2 px-3 py-2 border border-white/10 hover:border-white/20 transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
          <span className="hidden sm:inline text-sm font-biotif-pro text-on-surface">Alex Morgan</span>
          <ChevronDown className="w-4 h-4 text-on-surface-variant" />
        </button>
      </div>
    </div>
  )
}
