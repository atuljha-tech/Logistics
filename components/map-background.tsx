'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export const MapBackground: React.FC = () => {
  return (
    <motion.div className="fixed inset-0 -z-20 overflow-hidden">
      {/* Main Map Image */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Placeholder gradient block until the user uploads world-map-bg.svg */}
        <div className="w-full h-full bg-gradient-to-tr from-surface-container-high to-surface-container" />
      </motion.div>

      {/* Animated Gradient Overlays */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Animated Logistics Points - Top Right */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 border-2 border-primary/20 rounded-none"
        animate={{
          rotate: 360,
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Animated Logistics Points - Bottom Left */}
      <motion.div
        className="absolute bottom-32 left-20 w-24 h-24 border border-primary/20 rounded-none"
        animate={{
          rotate: -360,
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Animated Flow Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <motion.line
          x1="10%"
          y1="20%"
          x2="90%"
          y2="80%"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="10 5"
          animate={{
            strokeDashoffset: [-100, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="text-primary"
        />
        <motion.line
          x1="90%"
          y1="20%"
          x2="10%"
          y2="80%"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="10 5"
          animate={{
            strokeDashoffset: [100, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="text-primary"
        />
      </svg>
    </motion.div>
  )
}
