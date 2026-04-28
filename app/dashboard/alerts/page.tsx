'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { GlassPanel } from '@/components/glass-panel'
import { mockAlerts } from '@/lib/data'
import { AlertCircle, AlertTriangle, CheckCircle, Bell, Clock, Check } from 'lucide-react'

type AlertType = 'all' | 'weather' | 'traffic' | 'optimization' | 'system'
type AlertSeverity = 'all' | 'high' | 'medium' | 'low'

export default function AlertsPage() {
  const [typeFilter, setTypeFilter] = useState<AlertType>('all')
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity>('all')
  const [dateRange, setDateRange] = useState('7d')

  const filteredAlerts = mockAlerts.filter((alert) => {
    const typeMatch = typeFilter === 'all' || alert.alertType === typeFilter
    const severityMatch = severityFilter === 'all' || alert.severity === severityFilter
    return typeMatch && severityMatch
  })

  const getSeverityBg = (severity?: string) => {
    switch (severity) {
      case 'high':
        return 'bg-error/20'
      case 'medium':
        return 'bg-yellow-500/20'
      case 'low':
        return 'bg-emerald-400/20'
      default:
        return 'bg-surface-container'
    }
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high':
        return 'text-error'
      case 'medium':
        return 'text-yellow-400'
      case 'low':
        return 'text-emerald-400'
      default:
        return 'text-on-surface-variant'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-h1 text-on-surface">Alert History</h1>
          <p className="text-body-md text-on-surface-variant mt-2">
            Monitor and manage system notifications and shipment alerts
          </p>
        </div>
        <button className="glass-panel px-6 py-3 rounded-lg border border-white/20 text-on-surface hover:border-white/40 transition-colors flex items-center gap-2 font-label-caps text-xs uppercase">
          <Bell className="w-4 h-4" />
          Configure Alerts
        </button>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassPanel className="p-4">
          <div className="text-center">
            <div className="text-h2 font-h2 text-on-surface">
              {mockAlerts.length}
            </div>
            <p className="text-xs text-on-surface-variant mt-2">Total Alerts</p>
          </div>
        </GlassPanel>

        <GlassPanel className="p-4">
          <div className="text-center">
            <div className="text-h2 font-h2 text-error">
              {mockAlerts.filter((a) => a.severity === 'high').length}
            </div>
            <p className="text-xs text-on-surface-variant mt-2">High Severity</p>
          </div>
        </GlassPanel>

        <GlassPanel className="p-4">
          <div className="text-center">
            <div className="text-h2 font-h2 text-yellow-400">
              {mockAlerts.filter((a) => a.severity === 'medium').length}
            </div>
            <p className="text-xs text-on-surface-variant mt-2">Medium Severity</p>
          </div>
        </GlassPanel>

        <GlassPanel className="p-4">
          <div className="text-center">
            <div className="text-h2 font-h2 text-emerald-400">
              {mockAlerts.filter((a) => a.status === 'resolved').length}
            </div>
            <p className="text-xs text-on-surface-variant mt-2">Resolved</p>
          </div>
        </GlassPanel>
      </div>

      {/* Filters */}
      <GlassPanel className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-label-caps text-on-surface-variant mb-2 block">
                Alert Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as AlertType)}
                className="w-full px-4 py-2 bg-surface-container-low rounded-lg border border-outline-variant text-on-surface outline-none text-sm"
              >
                <option value="all">All Types</option>
                <option value="weather">Weather</option>
                <option value="traffic">Traffic</option>
                <option value="optimization">Optimization</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-label-caps text-on-surface-variant mb-2 block">
                Severity
              </label>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as AlertSeverity)}
                className="w-full px-4 py-2 bg-surface-container-low rounded-lg border border-outline-variant text-on-surface outline-none text-sm"
              >
                <option value="all">All Levels</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-label-caps text-on-surface-variant mb-2 block">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-2 bg-surface-container-low rounded-lg border border-outline-variant text-on-surface outline-none text-sm"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassPanel className="p-4 hover:border-white/20 transition-colors">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 p-2 rounded-lg ${getSeverityBg(alert.severity)}`}>
                  {alert.severity === 'high' && (
                    <AlertCircle className={`w-5 h-5 ${getSeverityColor(alert.severity)}`} />
                  )}
                  {alert.severity === 'medium' && (
                    <AlertTriangle className={`w-5 h-5 ${getSeverityColor(alert.severity)}`} />
                  )}
                  {alert.severity === 'low' && (
                    <CheckCircle className={`w-5 h-5 ${getSeverityColor(alert.severity)}`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-body-md font-semibold text-on-surface">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-label-caps text-on-surface-variant uppercase">
                          {alert.alertType}
                        </span>
                        {alert.shipmentId && (
                          <span className="text-xs font-mono text-primary">
                            {alert.shipmentId}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getSeverityBg(alert.severity)} ${getSeverityColor(alert.severity)}`}
                    >
                      {alert.severity?.charAt(0).toUpperCase() + (alert.severity?.slice(1) || 'N/A')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="font-mono">{alert.timestamp}</span>
                      </div>
                      <div>
                        Status:{' '}
                        <span className={alert.status === 'active' ? 'text-yellow-400' : 'text-emerald-400'}>
                          {alert.status?.charAt(0).toUpperCase() + (alert.status?.slice(1) || 'N/A')}
                        </span>
                      </div>
                    </div>

                    {alert.status === 'active' && (
                      <button className="px-3 py-1 text-xs font-semibold bg-surface-container hover:bg-surface-container-high rounded border border-white/10 text-on-surface transition-colors flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        ))}

        {filteredAlerts.length === 0 && (
          <GlassPanel className="p-8 text-center">
            <p className="text-on-surface-variant">No alerts match your filters</p>
          </GlassPanel>
        )}
      </div>
    </div>
  )
}
