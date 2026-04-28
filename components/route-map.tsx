'use client'

import React from 'react'
import { GlassPanel } from './glass-panel'
import { MapPin } from 'lucide-react'

interface RoutePoint {
  city: string
  status: 'completed' | 'current' | 'upcoming'
  timestamp?: string
}

interface RouteMapProps {
  route: RoutePoint[]
  className?: string
}

export const RouteMap: React.FC<RouteMapProps> = ({
  route,
  className = '',
}) => {
  return (
    <GlassPanel className={`p-6 ${className}`}>
      <h3 className="text-h3 font-h3 text-on-surface mb-6">Shipment Route</h3>
      <div className="space-y-4">
        {route.map((point, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                  point.status === 'completed'
                    ? 'bg-emerald-400/20 border-emerald-400'
                    : point.status === 'current'
                    ? 'bg-cyan-400/20 border-cyan-400 ring-2 ring-cyan-400/30'
                    : 'bg-surface-container-high border-white/20'
                }`}
              >
                <MapPin className="w-3 h-3 text-on-surface" />
              </div>
              {index < route.length - 1 && (
                <div className="w-0.5 h-12 bg-gradient-to-b from-white/20 to-transparent mt-2" />
              )}
            </div>
            <div className="flex-1 pt-1">
              <p className="text-body-md text-on-surface font-semibold">{point.city}</p>
              {point.timestamp && (
                <p className="text-xs text-on-surface-variant mt-1">{point.timestamp}</p>
              )}
              {point.status === 'current' && (
                <span className="inline-block mt-2 px-2 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded text-xs text-cyan-400 font-semibold">
                  In Transit
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  )
}
