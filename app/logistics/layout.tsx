'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Package, Map, Search } from 'lucide-react'

export default function LogisticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navItems = [
    { href: '/logistics', label: 'Dashboard', icon: Package },
    { href: '/logistics/create', label: 'Create Shipment', icon: Package },
    { href: '/logistics/track', label: 'Track Shipment', icon: Search },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Navigation Bar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 glass-panel border-b border-white/5 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/logistics" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center group-hover:from-primary/50 group-hover:to-primary/30 transition-all">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <span className="text-h3 font-h3 text-on-surface hidden sm:inline">LogisTrack</span>
          </Link>

          <div className="flex items-center gap-1 md:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-lg text-body-sm font-semibold text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all duration-300 flex items-center gap-2"
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Content */}
      <div className="pt-16">
        {children}
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="border-t border-white/5 mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-body-sm text-on-surface-variant">
            &copy; 2024 LogisTrack. India&apos;s fastest shipment tracking platform.
          </p>
        </div>
      </motion.footer>
    </div>
  )
}
