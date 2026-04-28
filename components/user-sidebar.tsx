'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  MapPin,
  History,
  Bell,
  ClipboardList,
  TrendingUp,
  User,
  LogOut,
  X,
  Menu,
} from 'lucide-react'
import { mockUserDashboardStats } from '@/lib/data'

const navItems = [
  { href: '/user-dashboard', label: 'My Overview', icon: LayoutDashboard },
  { href: '/user-dashboard/my-shipments', label: 'My Shipments', icon: Package },
  { href: '/user-dashboard/track', label: 'Track Package', icon: MapPin },
  { href: '/user-dashboard/history', label: 'History', icon: History },
  { href: '/user-dashboard/notifications', label: 'Notifications', icon: Bell, badge: mockUserDashboardStats.myAlerts },
  { href: '/user-dashboard/actions', label: 'Pending Actions', icon: ClipboardList, badge: mockUserDashboardStats.myPendingActions },
  { href: '/user-dashboard/performance', label: 'My Performance', icon: TrendingUp },
  { href: '/user-dashboard/profile', label: 'Profile', icon: User },
]

export const UserSidebar: React.FC = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [userName, setUserName] = useState('User')
  const [userInitial, setUserInitial] = useState('U')

  useEffect(() => {
    const stored = localStorage.getItem('user_name')
    if (stored) {
      setUserName(stored)
      setUserInitial(stored.charAt(0).toUpperCase())
    }
  }, [])

  const isActive = (href: string) =>
    href === '/user-dashboard' ? pathname === '/user-dashboard' : pathname.startsWith(href)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-surface-container p-2 border border-white/10 hover:border-white/20 transition-colors"
      >
        {isOpen ? <X className="w-5 h-5 text-on-surface" /> : <Menu className="w-5 h-5 text-on-surface" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      <div
        className={`fixed top-0 left-0 h-screen w-64 z-40 bg-surface-container-low border-r border-white/10 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <span className="text-xl font-pepi-thin text-on-surface">SmartLogistics</span>
          <p className="text-xs text-on-surface-variant font-biotif-pro mt-1">My Dashboard</p>
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
                  ? 'bg-primary/10 border border-primary/30 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container border border-transparent hover:border-white/10'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="text-sm font-biotif-pro">{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-auto text-xs bg-amber-400/20 text-amber-400 border border-amber-400/30 px-1.5 py-0.5 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
              {userInitial}
            </div>
            <div>
              <p className="text-sm font-medium text-on-surface">{userName}</p>
              <Link href="/user-dashboard/profile" className="text-xs text-primary hover:underline">
                View Profile
              </Link>
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
