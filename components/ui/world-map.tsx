"use client"

import { useEffect, useRef, memo } from "react"
import { motion } from "framer-motion"

interface Point {
  lat: number
  lng: number
  label?: string
}

interface Dot {
  start: Point
  end: Point
}

interface WorldMapProps {
  dots?: Dot[]
  lineColor?: string
}

// Project lat/lng to SVG x/y on a 800x400 equirectangular map
function project(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 180) / 360) * 800
  const y = ((90 - lat) / 180) * 400
  return { x, y }
}

// Build a curved SVG path between two points
function getCurvedPath(start: Point, end: Point): string {
  const s = project(start.lat, start.lng)
  const e = project(end.lat, end.lng)
  const mx = (s.x + e.x) / 2
  const my = Math.min(s.y, e.y) - Math.abs(e.x - s.x) * 0.25
  return `M ${s.x} ${s.y} Q ${mx} ${my} ${e.x} ${e.y}`
}

// Dotted world map as inline SVG paths (simplified continents)
const WORLD_PATHS = [
  // North America
  "M 80 80 L 85 75 L 100 70 L 120 68 L 140 72 L 155 80 L 160 95 L 155 110 L 145 125 L 130 140 L 115 155 L 100 165 L 90 160 L 80 145 L 75 130 L 72 110 L 75 95 Z",
  // South America
  "M 120 175 L 130 170 L 145 172 L 155 180 L 160 200 L 158 225 L 150 250 L 138 265 L 125 270 L 115 260 L 108 240 L 105 215 L 108 195 Z",
  // Europe
  "M 370 60 L 385 55 L 400 58 L 415 62 L 420 75 L 410 85 L 395 88 L 380 85 L 368 78 Z",
  // Africa
  "M 370 110 L 390 105 L 410 108 L 425 120 L 430 145 L 425 175 L 415 200 L 400 215 L 385 218 L 370 210 L 358 190 L 352 165 L 355 140 L 362 120 Z",
  // Asia
  "M 430 55 L 460 48 L 500 45 L 540 50 L 570 58 L 590 70 L 600 85 L 590 100 L 570 110 L 545 115 L 520 112 L 495 108 L 470 105 L 450 95 L 435 80 Z",
  // India subcontinent
  "M 490 110 L 505 108 L 515 115 L 518 130 L 512 148 L 500 155 L 488 148 L 483 132 L 485 118 Z",
  // Southeast Asia
  "M 560 110 L 580 108 L 595 115 L 598 128 L 588 138 L 572 140 L 558 132 L 555 120 Z",
  // Australia
  "M 580 230 L 610 222 L 640 225 L 658 238 L 660 258 L 648 275 L 628 282 L 605 278 L 585 265 L 575 248 Z",
  // Japan
  "M 620 80 L 628 76 L 635 80 L 633 90 L 624 92 L 618 87 Z",
]

function AnimatedPath({
  dot,
  lineColor,
  index,
}: {
  dot: Dot
  lineColor: string
  index: number
}) {
  const path = getCurvedPath(dot.start, dot.end)
  const startPt = project(dot.start.lat, dot.start.lng)
  const endPt = project(dot.end.lat, dot.end.lng)

  return (
    <g>
      {/* Static dim path */}
      <path
        d={path}
        fill="none"
        stroke={lineColor}
        strokeWidth="0.8"
        strokeOpacity="0.15"
        strokeDasharray="4 4"
      />

      {/* Animated traveling dash */}
      <motion.path
        d={path}
        fill="none"
        stroke={lineColor}
        strokeWidth="1.2"
        strokeOpacity="0.7"
        strokeLinecap="round"
        strokeDasharray="12 200"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -400 }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "linear",
          delay: index * 0.7,
        }}
      />

      {/* Origin dot */}
      <motion.circle
        cx={startPt.x}
        cy={startPt.y}
        r="2.5"
        fill={lineColor}
        opacity="0.9"
        initial={{ scale: 0 }}
        animate={{ scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
      />
      {/* Origin pulse ring */}
      <motion.circle
        cx={startPt.x}
        cy={startPt.y}
        r="2.5"
        fill="none"
        stroke={lineColor}
        strokeWidth="1"
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
      />

      {/* Destination dot */}
      <motion.circle
        cx={endPt.x}
        cy={endPt.y}
        r="2.5"
        fill={lineColor}
        opacity="0.9"
        initial={{ scale: 0 }}
        animate={{ scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 + 0.5 }}
      />
      <motion.circle
        cx={endPt.x}
        cy={endPt.y}
        r="2.5"
        fill="none"
        stroke={lineColor}
        strokeWidth="1"
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 + 0.5 }}
      />
    </g>
  )
}

function WorldMapInner({ dots = [], lineColor = "#0ea5e9" }: WorldMapProps) {
  return (
    <svg
      viewBox="0 0 800 400"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Continent outlines as dots */}
      {WORLD_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.5"
          strokeDasharray="2 3"
        />
      ))}

      {/* Grid lines (subtle) */}
      {[-60, -30, 0, 30, 60].map((lat) => {
        const y = ((90 - lat) / 180) * 400
        return (
          <line
            key={lat}
            x1="0" y1={y} x2="800" y2={y}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.5"
          />
        )
      })}
      {[-120, -60, 0, 60, 120].map((lng) => {
        const x = ((lng + 180) / 360) * 800
        return (
          <line
            key={lng}
            x1={x} y1="0" x2={x} y2="400"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.5"
          />
        )
      })}

      {/* Animated connection lines */}
      {dots.map((dot, i) => (
        <AnimatedPath key={i} dot={dot} lineColor={lineColor} index={i} />
      ))}
    </svg>
  )
}

export const WorldMap = memo(WorldMapInner)
