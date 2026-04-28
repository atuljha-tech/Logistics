'use client'

import React from 'react'
import { GlassPanel } from './glass-panel'
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'

interface Alert {
  id: string
  message: string
  type: 'warning' | 'error' | 'success'
  timestamp: string
}

interface AlertsCardProps {
  alerts: Alert[]
  className?: string
}

export const AlertsCard: React.FC<AlertsCardProps> = ({
  alerts,
  className = '',
}) => {
  const getIcon = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />
    }
  }

  return (
    <GlassPanel className={`p-6 ${className}`}>
      <h3 className="text-h3 font-h3 text-on-surface mb-4">System Alerts</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <p className="text-body-md text-on-surface-variant text-center py-8">No active alerts</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low border border-white/5"
            >
              <div className="mt-0.5">{getIcon(alert.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-body-md text-on-surface truncate">{alert.message}</p>
                <p className="text-xs text-on-surface-variant mt-1">{alert.timestamp}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </GlassPanel>
  )
}
