'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Clock, MapPin } from 'lucide-react'
import { RoutePoint } from '@/lib/types'

interface TrackingTimelineProps {
  route: RoutePoint[]
  'data-testid'?: string
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({
  route,
  'data-testid': testId,
}) => {
  const [flippedStep, setFlippedStep] = useState<number | null>(null)

  return (
    <div data-testid={testId || 'tracking-timeline'} className="space-y-2">
      {route.map((point, index) => {
        const isFlipped = flippedStep === index
        const isCompleted = point.status === 'completed'
        const isCurrent = point.status === 'current'

        return (
          <div key={index} className="flex items-start gap-3">
            {/* Status indicator */}
            <div className="flex flex-col items-center">
              <motion.div
                animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-8 h-8 flex items-center justify-center border-2 ${
                  isCompleted ? 'bg-emerald-400/20 border-emerald-400' :
                  isCurrent   ? 'bg-primary/20 border-primary' :
                                'bg-surface-container border-white/20'
                }`}
              >
                {isCompleted ? <CheckCircle className="w-4 h-4 text-emerald-400" /> :
                 isCurrent   ? <Clock className="w-4 h-4 text-primary" /> :
                               <Circle className="w-4 h-4 text-on-surface-variant" />}
              </motion.div>
              {index < route.length - 1 && (
                <div className="w-0.5 h-8 bg-white/10 mt-1">
                  {isCompleted && (
                    <motion.div
                      className="w-full bg-emerald-400/40"
                      initial={{ height: 0 }}
                      animate={{ height: '100%' }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Step flip card */}
            <div
              className="flex-1 mb-2"
              style={{ perspective: '600px' }}
              onClick={() => setFlippedStep(isFlipped ? null : index)}
            >
              <motion.div
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="relative h-14 cursor-pointer"
              >
                {/* Front */}
                <div
                  className={`absolute inset-0 glass-panel px-4 py-2 flex items-center justify-between border ${
                    isCurrent ? 'border-primary/30' : 'border-white/10'
                  }`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-on-surface-variant" />
                    <span className={`text-sm font-medium ${
                      isCompleted ? 'text-on-surface' :
                      isCurrent   ? 'text-primary' :
                                    'text-on-surface-variant'
                    }`}>
                      {point.city}
                    </span>
                  </div>
                  {point.timestamp && (
                    <span className="text-xs text-on-surface-variant">{point.timestamp}</span>
                  )}
                  {!point.timestamp && point.status === 'upcoming' && (
                    <span className="text-xs text-on-surface-variant">Upcoming</span>
                  )}
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 px-4 py-2 flex items-center justify-between bg-primary/10 border border-primary/30"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <span className="text-xs text-on-surface-variant">
                    {point.status === 'completed' ? `Departed: ${point.timestamp}` :
                     point.status === 'current'   ? 'Currently here' :
                                                    'Not yet reached'}
                  </span>
                  <span className={`text-xs px-2 py-0.5 ${
                    isCompleted ? 'bg-emerald-400/20 text-emerald-400' :
                    isCurrent   ? 'bg-primary/20 text-primary' :
                                  'bg-white/10 text-on-surface-variant'
                  }`}>
                    {point.status}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
