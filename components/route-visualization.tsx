'use client'

import React from 'react'
import { GlassPanel } from '@/components/glass-panel'
import { Check, ChevronRight } from 'lucide-react'

interface RoutePoint {
  city: string
  timestamp?: string
}

interface RouteVisualizationProps {
  route: RoutePoint[]
  alternateRoute: RoutePoint[]
}

export function RouteVisualization({ route, alternateRoute }: RouteVisualizationProps) {
  return (
    <div className="space-y-6">
      {/* Original Route */}
      <GlassPanel className="p-6">
        <h3 className="text-h3 font-h3 text-on-surface mb-6 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          Original Route
        </h3>

        <div className="space-y-4">
          {route.map((point, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="flex flex-col items-center pt-1">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                {i < route.length - 1 && <div className="w-0.5 h-12 bg-red-500/30 my-1" />}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-on-surface">{point.city}</p>
                {point.timestamp && <p className="text-xs text-on-surface-variant font-mono mt-1">{point.timestamp}</p>}
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Alternate Route */}
      <GlassPanel className="p-6 border-emerald-400/30">
        <h3 className="text-h3 font-h3 text-on-surface mb-6 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
          Optimized Route
        </h3>

        <div className="space-y-4">
          {alternateRoute.map((point, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="flex flex-col items-center pt-1">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                {i < alternateRoute.length - 1 && <div className="w-0.5 h-12 bg-emerald-400/30 my-1" />}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-on-surface">{point.city}</p>
                {point.timestamp && <p className="text-xs text-on-surface-variant font-mono mt-1">{point.timestamp}</p>}
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  )
}
