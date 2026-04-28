'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { GlassPanel } from '@/components/glass-panel'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { Download } from 'lucide-react'

const delayTrendsData = [
  { date: 'Jan 10', delays: 3, onTime: 42 },
  { date: 'Jan 11', delays: 2, onTime: 50 },
  { date: 'Jan 12', delays: 5, onTime: 43 },
  { date: 'Jan 13', delays: 1, onTime: 60 },
  { date: 'Jan 14', delays: 4, onTime: 51 },
  { date: 'Jan 15', delays: 2, onTime: 56 },
  { date: 'Jan 16', delays: 3, onTime: 59 },
]

const riskDistributionData = [
  { name: 'Low', value: 45, color: '#00d084' },
  { name: 'Medium', value: 35, color: '#fbbf24' },
  { name: 'High', value: 20, color: '#ff6b6b' },
]

const disruptionCausesData = [
  { cause: 'Weather', incidents: 23 },
  { cause: 'Traffic', incidents: 18 },
  { cause: 'Equipment', incidents: 12 },
  { cause: 'Other', incidents: 8 },
]

const optimizationImpactData = [
  { date: 'Week 1', timeSaved: 45, costSaved: 120 },
  { date: 'Week 2', timeSaved: 58, costSaved: 155 },
  { date: 'Week 3', timeSaved: 72, costSaved: 195 },
  { date: 'Week 4', timeSaved: 85, costSaved: 240 },
  { date: 'Week 5', timeSaved: 92, costSaved: 285 },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-lowest border border-white/20 rounded p-2 text-xs">
        <p className="text-on-surface-variant">{payload[0].payload.date || payload[0].payload.cause}</p>
        <p className="text-cyan-400">{payload[0].name}: {payload[0].value}</p>
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d')

  const metrics = [
    { label: 'Total Shipments', value: '1,247', change: '+12.5%' },
    { label: 'Avg Optimization Gain', value: '18.5 min', change: '+23%' },
    { label: 'Risk Prediction Accuracy', value: '94.2%', change: '+3.1%' },
    { label: 'Cost Savings', value: '$45,200', change: '+18.7%' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-h1 text-on-surface">Analytics & Insights</h1>
          <p className="text-body-md text-on-surface-variant mt-2">
            Monitor your supply chain performance and trends
          </p>
        </div>

        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="glass-panel px-4 py-3 rounded-lg border border-outline-variant text-on-surface outline-none text-sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button className="glass-panel px-6 py-3 rounded-lg border border-white/20 text-on-surface hover:border-white/40 transition-colors flex items-center gap-2 font-label-caps text-xs uppercase">
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassPanel className="p-6">
              <p className="text-xs text-on-surface-variant font-label-caps uppercase mb-3">
                {metric.label}
              </p>
              <div className="flex items-baseline justify-between">
                <p className="text-h2 font-h2 text-on-surface">{metric.value}</p>
                <span className="text-xs text-emerald-400">{metric.change}</span>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delay Trends */}
        <GlassPanel className="p-6">
          <h3 className="text-h3 font-h3 text-on-surface mb-6">Delay Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={delayTrendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444748" />
              <XAxis dataKey="date" stroke="#c4c7c8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#c4c7c8" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="delays"
                stroke="#ff6b6b"
                strokeWidth={2}
                dot={{ fill: '#ff6b6b', r: 4 }}
                activeDot={{ r: 6 }}
                name="Delayed"
              />
              <Line
                type="monotone"
                dataKey="onTime"
                stroke="#00d084"
                strokeWidth={2}
                dot={{ fill: '#00d084', r: 4 }}
                activeDot={{ r: 6 }}
                name="On-Time"
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassPanel>

        {/* Risk Distribution */}
        <GlassPanel className="p-6">
          <h3 className="text-h3 font-h3 text-on-surface mb-6">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {riskDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {riskDistributionData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-on-surface-variant">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Top Disruption Causes */}
        <GlassPanel className="p-6">
          <h3 className="text-h3 font-h3 text-on-surface mb-6">Top Disruption Causes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={disruptionCausesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444748" />
              <XAxis dataKey="cause" stroke="#c4c7c8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#c4c7c8" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="incidents" fill="#fbbf24" radius={[8, 8, 0, 0]} name="Incidents" />
            </BarChart>
          </ResponsiveContainer>
        </GlassPanel>

        {/* Optimization Impact */}
        <GlassPanel className="p-6">
          <h3 className="text-h3 font-h3 text-on-surface mb-6">Optimization Impact</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={optimizationImpactData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444748" />
              <XAxis dataKey="date" stroke="#c4c7c8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#c4c7c8" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="timeSaved"
                stackId="1"
                stroke="#00d084"
                fill="#00d084"
                fillOpacity={0.3}
                name="Time Saved (min)"
              />
              <Area
                type="monotone"
                dataKey="costSaved"
                stackId="1"
                stroke="#fbbf24"
                fill="#fbbf24"
                fillOpacity={0.3}
                name="Cost Saved ($)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassPanel>
      </div>

      {/* Summary Stats */}
      <GlassPanel className="p-8">
        <h3 className="text-h3 font-h3 text-on-surface mb-6">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-on-surface-variant mb-2">On-Time Delivery Rate</p>
            <div className="flex items-center gap-3">
              <p className="text-h2 font-h2 text-emerald-400">94%</p>
              <span className="text-xs text-emerald-400">↑ 3.2%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant mb-2">Avg Route Optimization Gain</p>
            <div className="flex items-center gap-3">
              <p className="text-h2 font-h2 text-cyan-400">18.5 min</p>
              <span className="text-xs text-cyan-400">↑ 23%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant mb-2">Total Cost Savings (MTD)</p>
            <div className="flex items-center gap-3">
              <p className="text-h2 font-h2 text-primary">$45.2K</p>
              <span className="text-xs text-primary">↑ 18.7%</span>
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  )
}
