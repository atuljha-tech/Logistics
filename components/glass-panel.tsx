'use client'

import React from 'react'

interface GlassPanelProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'dark' | 'accent'
}

export const GlassPanel = React.forwardRef<
  HTMLDivElement,
  GlassPanelProps
>(({ children, className = '', variant = 'default' }, ref) => {
  const variantStyles = {
    default: 'bg-[rgba(26,26,26,0.3)] backdrop-blur-sm border border-white/10',
    dark: 'bg-[rgba(14,14,14,0.6)] border-white/10',
    accent: 'bg-[rgba(198,198,198,0.05)] border-white/20',
  }

  return (
    <div
      ref={ref}
      className={`border transition-all duration-300 hover:border-white/10 ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  )
})

GlassPanel.displayName = 'GlassPanel'
