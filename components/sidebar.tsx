'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  BarChart3,
  AlertCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: 'Logistics',
    href: '/logistics',
    icon: <Package className="w-5 h-5" />,
  },
  {
    label: 'Supply Chain',
    href: '/supply-chain',
    icon: <Zap className="w-5 h-5" />,
  },
  {
    label: 'Shipments',
    href: '/dashboard/shipments',
    icon: <Package className="w-5 h-5" />,
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: 'Alerts',
    href: '/dashboard/alerts',
    icon: <AlertCircle className="w-5 h-5" />,
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings className="w-5 h-5" />,
  },
]

export const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-surface-container p-2 border border-white/10 hover:border-white/20 transition-colors"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-on-surface" />
        ) : (
          <Menu className="w-5 h-5 text-on-surface" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-surface-container-low border-r border-white/10 flex flex-col transition-transform duration-300 z-40 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-h2 font-h2 text-on-surface">SmartLogistics</h1>
          <p className="text-xs text-on-surface-variant mt-1">Supply Chain OS</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
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
              {item.icon}
              <span className="text-body-md font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 space-y-3">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container border border-transparent hover:border-white/10 transition-all duration-200">
            <LogOut className="w-5 h-5" />
            <span className="text-body-md">Logout</span>
          </button>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden md:block w-64" />
    </>
  )
}
