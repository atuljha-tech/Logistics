'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  DollarSign, Users, Activity, ClipboardCheck,
  Package, Clock, Bell, Star, TrendingUp, ArrowRight
} from 'lucide-react'
import { FlipCardData } from '@/lib/types'

const iconMap: Record<string, React.ReactNode> = {
  DollarSign: <DollarSign className="w-7 h-7" />,
  Users: <Users className="w-7 h-7" />,
  Activity: <Activity className="w-7 h-7" />,
  ClipboardCheck: <ClipboardCheck className="w-7 h-7" />,
  Package: <Package className="w-7 h-7" />,
  Clock: <Clock className="w-7 h-7" />,
  Bell: <Bell className="w-7 h-7" />,
  Star: <Star className="w-7 h-7" />,
  TrendingUp: <TrendingUp className="w-7 h-7" />,
}

const colorMap: Record<string, string> = {
  emerald: 'text-emerald-400 bg-emerald-400/10',
  cyan: 'text-cyan-400 bg-cyan-400/10',
  violet: 'text-violet-400 bg-violet-400/10',
  amber: 'text-amber-400 bg-amber-400/10',
}

interface FlipCardProps {
  data: FlipCardData
  isFlipped?: boolean
  className?: string
  'data-testid'?: string
}

export const FlipCard: React.FC<FlipCardProps> = ({
  data,
  isFlipped: controlledFlipped,
  className = '',
  'data-testid': testId,
}) => {
  const [internalFlipped, setInternalFlipped] = useState(false)
  const isFlipped = controlledFlipped !== undefined ? controlledFlipped : internalFlipped
  const iconColor = colorMap[data.frontColor || 'cyan']

  return (
    <div
      data-testid={testId || `flip-card-${data.id}`}
      className={`relative h-52 cursor-pointer ${className}`}
      style={{ perspective: '1000px' }}
      onMouseEnter={() => controlledFlipped === undefined && setInternalFlipped(true)}
      onMouseLeave={() => controlledFlipped === undefined && setInternalFlipped(false)}
      onClick={() => controlledFlipped === undefined && setInternalFlipped(f => !f)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* FRONT FACE */}
        <div
          className="absolute inset-0 glass-panel p-5 flex flex-col justify-between border border-white/10"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-start justify-between">
            <div className={`p-3 ${iconColor}`}>
              {iconMap[data.frontIcon || 'TrendingUp']}
            </div>
            <span className="text-xs text-on-surface-variant border border-white/10 px-2 py-1">
              hover for details
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold text-on-surface tracking-tight">
              {data.frontValue}
            </div>
            <div className="text-sm font-medium text-on-surface mt-1">
              {data.frontTitle}
            </div>
            {data.frontSubtitle && (
              <div className="text-xs text-on-surface-variant mt-1">
                {data.frontSubtitle}
              </div>
            )}
          </div>
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 p-5 flex flex-col justify-between border border-primary/30 bg-primary/5"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-2">
              {data.backTitle}
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {data.backContent}
            </p>
          </div>
          {data.backStats && (
            <div className="space-y-1.5">
              {data.backStats.map((stat, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">{stat.label}</span>
                  <span className="text-on-surface font-medium">{stat.value}</span>
                </div>
              ))}
            </div>
          )}
          {data.backAction && (
            <Link
              href={data.backAction.href}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors mt-2"
              onClick={e => e.stopPropagation()}
            >
              {data.backAction.label} <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  )
}

interface FlipCardGridProps {
  cards: FlipCardData[]
  'data-testid'?: string
}

export const FlipCardGrid: React.FC<FlipCardGridProps> = ({
  cards,
  'data-testid': testId,
}) => (
  <div
    data-testid={testId || 'flip-card-grid'}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
  >
    {cards.map((card, i) => (
      <motion.div
        key={card.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
      >
        <FlipCard data={card} />
      </motion.div>
    ))}
  </div>
)
