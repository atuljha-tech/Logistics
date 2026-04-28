'use client'

import React from 'react'
import { GlassPanel } from './glass-panel'

interface StatCardProps {
  label: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  changeType = 'neutral',
  icon,
  className = '',
}) => {
  const changeColor = {
    positive: 'text-emerald-400',
    negative: 'text-rose-400',
    neutral: 'text-on-surface-variant',
  }

  return (
    <GlassPanel className={`p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-body-md text-on-surface-variant mb-2">{label}</p>
          <p className="text-h2 text-on-surface font-h2 mb-2">{value}</p>
          {change && (
            <p className={`text-label-caps font-label-caps text-sm ${changeColor[changeType]}`}>
              {changeType === 'positive' ? '+' : ''}{change}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-on-surface-variant opacity-60">
            {icon}
          </div>
        )}
      </div>
    </GlassPanel>
  )
}
