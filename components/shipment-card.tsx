'use client'

import React from 'react'
import { GlassPanel } from './glass-panel'
import { Package, MapPin, Calendar } from 'lucide-react'

interface ShipmentCardProps {
  id: string
  origin: string
  destination: string
  status: 'in-transit' | 'delivered' | 'pending' | 'delayed'
  progress: number
  eta: string
  weight?: string
  className?: string
}

export const ShipmentCard: React.FC<ShipmentCardProps> = ({
  id,
  origin,
  destination,
  status,
  progress,
  eta,
  weight,
  className = '',
}) => {
  const statusColor = {
    'in-transit': 'text-cyan-400',
    'delivered': 'text-emerald-400',
    'pending': 'text-amber-400',
    'delayed': 'text-rose-400',
  }

  const statusBg = {
    'in-transit': 'bg-cyan-400/10',
    'delivered': 'bg-emerald-400/10',
    'pending': 'bg-amber-400/10',
    'delayed': 'bg-rose-400/10',
  }

  return (
    <GlassPanel className={`p-4 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-on-surface-variant" />
            <span className="text-label-caps font-label-caps text-on-surface-variant text-xs">{id}</span>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusBg[status]} ${statusColor[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-body-md text-on-surface">
            <MapPin className="w-4 h-4" />
            <span>{origin} → {destination}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-on-surface-variant">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 text-body-md text-on-surface-variant">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">{eta}</span>
          </div>
          {weight && (
            <span className="text-xs text-on-surface-variant">{weight}</span>
          )}
        </div>
      </div>
    </GlassPanel>
  )
}
