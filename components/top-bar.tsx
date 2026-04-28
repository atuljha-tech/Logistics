'use client'

import React, { useEffect, useState } from 'react'
import { Bell, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { GlassPanel } from './glass-panel'

interface TopBarProps {
  title?: string
  showNotifications?: boolean
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  showNotifications = true,
}) => {
  const [userName, setUserName] = useState('User')

  useEffect(() => {
    const stored = localStorage.getItem('user_name')
    if (stored) setUserName(stored)
  }, [])

  return (
    <GlassPanel className="fixed top-0 left-0 md:left-64 right-0 h-20 flex items-center justify-between px-6 border-b border-t-0 border-l-0 border-r-0 rounded-none z-30 backdrop-blur-md bg-[rgba(26,26,26,0.3)]">
      <div>
        {title && (
          <h1 className="text-h2 font-h2 text-on-surface">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Switch View */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs text-on-surface-variant">Switch View:</span>
          <Link
            href="/admin"
            className="text-xs px-3 py-1 border border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-400 transition-colors"
          >
            Admin
          </Link>
          <Link
            href="/user-dashboard"
            className="text-xs px-3 py-1 border border-white/10 text-on-surface-variant hover:border-white/20 hover:text-on-surface transition-colors"
          >
            User View
          </Link>
        </div>

        {showNotifications && (
          <button className="relative p-2 text-on-surface-variant hover:text-on-surface transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-400" />
          </button>
        )}

        <button className="p-2 text-on-surface-variant hover:text-on-surface transition-colors">
          <Settings className="w-6 h-6" />
        </button>

        <button className="flex items-center gap-2 px-3 py-2 border border-white/10 hover:border-white/20 transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500" />
          <span className="hidden sm:inline text-body-md text-on-surface">{userName}</span>
          <User className="w-4 h-4 text-on-surface-variant" />
        </button>
      </div>
    </GlassPanel>
  )
}
