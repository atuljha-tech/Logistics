'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, TrendingUp, CheckCircle, Clock, Search, Loader } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Shipment {
  id: string
  tracking_id: string
  sender_name: string
  receiver_name: string
  status: string
  current_location: string
  estimated_delivery: string
  created_at: string
}

interface Statistics {
  total: number
  pending: number
  in_transit: number
  out_for_delivery: number
  delivered: number
}

export default function LogisticsDashboard() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [stats, setStats] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shipmentsRes, statsRes] = await Promise.all([
          fetch(`${API_BASE}/api/shipments?limit=50`),
          fetch(`${API_BASE}/api/statistics`),
        ])

        if (shipmentsRes.ok) {
          const data = await shipmentsRes.json()
          setShipments(data.data || [])
        }

        if (statsRes.ok) {
          const data = await statsRes.json()
          setStats(data.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch = s.tracking_id.includes(search) || 
                          s.sender_name.toLowerCase().includes(search.toLowerCase()) ||
                          s.receiver_name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || s.status === filter
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      case 'In Transit':
        return 'bg-blue-100 text-blue-800'
      case 'Out for Delivery':
        return 'bg-orange-100 text-orange-800'
      case 'Pending':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="w-5 h-5" />
      case 'In Transit':
        return <TrendingUp className="w-5 h-5" />
      case 'Out for Delivery':
        return <Package className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center">
        <Loader className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-on-surface mb-2">Dashboard</h1>
              <p className="text-on-surface-variant">Manage and track all shipments</p>
            </div>
            <Link
              href="/logistics/create"
              className="px-6 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Create Shipment
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-surface-container rounded-lg p-4 border border-outline-variant">
              <p className="text-sm text-on-surface-variant mb-1">Total Shipments</p>
              <p className="text-2xl font-bold text-on-surface">{stats.total}</p>
            </div>
            <div className="bg-surface-container rounded-lg p-4 border border-outline-variant">
              <p className="text-sm text-on-surface-variant mb-1">Pending</p>
              <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
            </div>
            <div className="bg-surface-container rounded-lg p-4 border border-outline-variant">
              <p className="text-sm text-on-surface-variant mb-1">In Transit</p>
              <p className="text-2xl font-bold text-blue-500">{stats.in_transit}</p>
            </div>
            <div className="bg-surface-container rounded-lg p-4 border border-outline-variant">
              <p className="text-sm text-on-surface-variant mb-1">Out for Delivery</p>
              <p className="text-2xl font-bold text-yellow-500">{stats.out_for_delivery}</p>
            </div>
            <div className="bg-surface-container rounded-lg p-4 border border-outline-variant">
              <p className="text-sm text-on-surface-variant mb-1">Delivered</p>
              <p className="text-2xl font-bold text-green-500">{stats.delivered}</p>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search by tracking ID, sender, or receiver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary transition-colors"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-on-surface outline-none focus:border-primary transition-colors"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Transit">In Transit</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        {/* Shipments Table */}
        <div className="bg-surface-container border border-outline-variant rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-container-high border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-on-surface">Tracking ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-on-surface">From → To</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-on-surface">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-on-surface">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-on-surface">Est. Delivery</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-on-surface">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.length > 0 ? (
                  filteredShipments.map((shipment) => (
                    <tr key={shipment.id} className="border-t border-outline-variant hover:bg-surface-container-high transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-primary">{shipment.tracking_id}</td>
                      <td className="px-6 py-4 text-sm text-on-surface">
                        <div>
                          <p className="font-medium">{shipment.sender_name}</p>
                          <p className="text-on-surface-variant text-xs">to {shipment.receiver_name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{shipment.current_location}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                          {getStatusIcon(shipment.status)}
                          {shipment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">
                        {new Date(shipment.estimated_delivery).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link href={`/logistics/${shipment.id}`} className="text-primary hover:underline font-medium">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">
                      No shipments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
