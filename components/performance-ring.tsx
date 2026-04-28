'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface PerformanceRingProps {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
  'data-testid'?: string
}

export const PerformanceRing: React.FC<PerformanceRingProps> = ({
  score,
  size = 120,
  strokeWidth = 8,
  label = 'Performance',
  'data-testid': testId,
}) => {
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const color = score >= 90 ? '#34d399' : score >= 70 ? '#60a5fa' : '#fbbf24'

  return (
    <div
      data-testid={testId || 'performance-ring'}
      className="flex flex-col items-center gap-2"
    >
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-on-surface"
          style={{ fontSize: size * 0.2, fontWeight: 700 }}
        >
          {score}
        </text>
      </svg>
      <span className="text-xs text-on-surface-variant">{label}</span>
    </div>
  )
}
