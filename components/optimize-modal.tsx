'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassPanel } from './glass-panel'
import { X, ArrowRight, CheckCircle } from 'lucide-react'

interface OptimizeModalProps {
  isOpen: boolean
  onClose: () => void
  onApply?: () => void
  shipmentId?: string
}

export function OptimizeModal({
  isOpen,
  onClose,
  onApply,
  shipmentId = 'SHP-001',
}: OptimizeModalProps) {
  const [isComputing, setIsComputing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  React.useEffect(() => {
    if (isOpen) {
      setIsComputing(true)
      setIsComplete(false)
      const timer = setTimeout(() => {
        setIsComputing(false)
        setIsComplete(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleApply = () => {
    onApply?.()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <GlassPanel className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-h2 font-h2 text-on-surface">
                  Route Optimization
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-surface-container rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Route Visualization */}
                <div className="space-y-4">
                  <h3 className="text-body-md font-semibold text-on-surface">
                    Current Route vs Optimized Route
                  </h3>

                  <svg
                    viewBox="0 0 600 200"
                    className="w-full border border-white/10 rounded-lg bg-surface-container p-4"
                  >
                    {/* Original route (red dashed) */}
                    <path
                      d="M 50 100 Q 150 50 250 100 T 450 100"
                      stroke="#ff6b6b"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      fill="none"
                    />
                    <circle cx="50" cy="100" r="6" fill="#ff6b6b" />
                    <circle cx="450" cy="100" r="6" fill="#ff6b6b" />

                    {/* Optimized route (green solid) */}
                    <path
                      d="M 50 100 Q 180 80 250 90 T 450 100"
                      stroke="#00d084"
                      strokeWidth="3"
                      fill="none"
                    />
                    <circle cx="50" cy="100" r="8" fill="#00d084" opacity="0.5" />
                    <circle cx="450" cy="100" r="8" fill="#00d084" opacity="0.5" />

                    {/* Labels */}
                    <text
                      x="50"
                      y="130"
                      fontSize="12"
                      fill="#c4c7c8"
                      textAnchor="middle"
                    >
                      Origin
                    </text>
                    <text
                      x="450"
                      y="130"
                      fontSize="12"
                      fill="#c4c7c8"
                      textAnchor="middle"
                    >
                      Destination
                    </text>

                    {/* Legend */}
                    <line x1="50" y1="160" x2="70" y2="160" stroke="#ff6b6b" strokeDasharray="5,5" strokeWidth="2" />
                    <text x="80" y="165" fontSize="12" fill="#c4c7c8">
                      Current
                    </text>

                    <line x1="250" y1="160" x2="270" y2="160" stroke="#00d084" strokeWidth="2" />
                    <text x="280" y="165" fontSize="12" fill="#c4c7c8">
                      Optimized
                    </text>
                  </svg>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="glass-panel p-4 rounded-lg border border-white/10">
                    <div className="text-sm text-on-surface-variant mb-2">
                      Time Saved
                    </div>
                    <div className="text-2xl font-bold text-emerald-400">
                      +15 min
                    </div>
                  </div>
                  <div className="glass-panel p-4 rounded-lg border border-white/10">
                    <div className="text-sm text-on-surface-variant mb-2">
                      Risk Reduction
                    </div>
                    <div className="text-2xl font-bold text-cyan-400">
                      -42%
                    </div>
                  </div>
                  <div className="glass-panel p-4 rounded-lg border border-white/10">
                    <div className="text-sm text-on-surface-variant mb-2">
                      Confidence
                    </div>
                    <div className="text-2xl font-bold text-primary">94%</div>
                  </div>
                </div>

                {/* Terminal */}
                <div className="space-y-2">
                  <h3 className="text-body-md font-semibold text-on-surface">
                    Processing
                  </h3>
                  <div className="bg-surface-container-lowest border border-white/10 rounded-lg p-4 font-mono text-sm">
                    <div className="text-outline">
                      $ computing optimal path...
                    </div>
                    {isComputing && (
                      <motion.div
                        animate={{ opacity: [0.5, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="text-outline"
                      >
                        ⟳ optimizing routes
                      </motion.div>
                    )}
                    {isComplete && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-emerald-400"
                      >
                        ✓ Route found
                      </motion.div>
                    )}
                    <div className="text-outline mt-2">
                      Shipment: {shipmentId}
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="space-y-2">
                  <h3 className="text-body-md font-semibold text-on-surface">
                    Optimization Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {[
                      'Avoid Highway I-70 during peak hours (3-6 PM)',
                      'Alternative route saves fuel costs by $45',
                      'New route has lower weather impact probability',
                    ].map((suggestion, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg bg-surface-container border border-white/10"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-body-md text-on-surface-variant">
                          {suggestion}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-white/10">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-white/20 rounded-lg text-on-surface hover:border-white/40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={isComputing}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  Apply Reroute
                </button>
              </div>
            </GlassPanel>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
