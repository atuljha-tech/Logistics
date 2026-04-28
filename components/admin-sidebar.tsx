'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  UsersRound,
  Package2,
  BarChart3,
  AlertCircle,
  Server,
  ClipboardCheck,
  Settings,
  LogOut,
  X,
  Menu,
  Shield,
} from 'lucide-react'
import { mockAdminStats } from '@/lib/data'

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: UsersRound },
  { href: '/admin/shipments', label: 'All Shipments', icon: Package2 },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/alerts', label: 'Alerts', icon: AlertCircle, badge: mockAdminStats.alertsToday },
  { href: '/admin/system', label: 'System Health', icon: Server },
  { href: '/admin/approvals', label: 'Approvals', icon: ClipboardCheck, badge: mockAdminStats.pendingApprovals },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [userName, setUserName] = useState('Admin')

  useEffect(() => {
    const stored = localStorage.getItem('user_name')
    if (stored) setUserName(stored)
  }, [])

  const initials = userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-surface-container p-2 border border-white/10 hover:border-white/20 transition-colors"
      >
        {isOpen ? <X className="w-5 h-5 text-on-surface" /> : <Menu className="w-5 h-5 text-on-surface" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 z-40 bg-surface-container-low border-r border-white/10 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xl font-pepi-thin text-on-surface">SmartLogistics</span>
            <span className="text-xs font-bold px-1.5 py-0.5 bg-red-500 text-white">ADMIN</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Shield className="w-3 h-3 text-red-400" />
            <p className="text-xs text-red-400 font-biotif-pro">Administrator Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-primary/5 border border-primary/20 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container border border-transparent hover:border-white/10'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="text-sm font-biotif-pro">{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-auto text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-on-surface">{userName}</p>
              <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5">admin</span>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container border border-transparent hover:border-white/10 transition-all duration-200">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-biotif-pro">Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}
