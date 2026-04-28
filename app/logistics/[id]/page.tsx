'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Package, Calendar, Loader, AlertCircle, Save } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Shipment {
  id: string
  tracking_id: string
  sender_name: string
  receiver_name: string
  sender_address: string
  receiver_address: string
  sender_city: string
  receiver_city: string
  sender_pincode: string
  receiver_pincode: string
  package_type: string
  weight: number
  value?: number
  description?: string
  status: string
  current_location: string
  assigned_agent?: string
  vehicle_number?: string
  estimated_delivery: string
  created_at: string
  events?: ShipmentEvent[]
}

interface ShipmentEvent {
  id: string
  status: string
  location: string
  occurred_at: string
  description?: string
  agent_name?: string
}

export default function ShipmentDetails() {
  const params = useParams()
  const id = params.id as string
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [formData, setFormData] = useState({
    status: '',
    current_location: '',
    assigned_agent: '',
    vehicle_number: '',
  })

  useEffect(() => {
    fetchShipment()
  }, [id])

  const fetchShipment = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/shipments/${id}`)
      const data = await res.json()
      if (data.success) {
        setShipment(data.data)
        setFormData({
          status: data.data.status,
          current_location: data.data.current_location,
          assigned_agent: data.data.assigned_agent || '',
          vehicle_number: data.data.vehicle_number || '',
        })
      }
    } catch (error) {
      console.error('Error fetching shipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/shipments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchShipment()
        setEditMode(false)
        alert('Shipment updated successfully!')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to update shipment')
    } finally {
      setUpdateLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center">
        <Loader className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-surface-container rounded-lg p-12 text-center border border-outline-variant">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-on-surface-variant">Shipment not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/logistics" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-on-surface mb-2">Shipment Details</h1>
              <p className="text-sm font-mono text-primary">{shipment.tracking_id}</p>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-all"
            >
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`bg-surface-container rounded-lg p-6 mb-8 border border-outline-variant`}>
          <p className="text-sm text-on-surface-variant mb-2">Current Status</p>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-on-surface">{shipment.status}</h2>
            <span className={`px-4 py-2 rounded-full font-medium ${getStatusColor(shipment.status)}`}>
              {shipment.status}
            </span>
          </div>
        </div>

        {/* Edit Form */}
        {editMode && (
          <form onSubmit={handleUpdate} className="bg-surface-container rounded-lg p-6 mb-8 border border-outline-variant space-y-4">
            <h3 className="text-lg font-semibold text-on-surface">Update Shipment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-outline-variant rounded-lg text-on-surface outline-none focus:border-primary"
                >
                  <option>Pending</option>
                  <option>In Transit</option>
                  <option>Out for Delivery</option>
                  <option>Delivered</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Location</label>
                <input
                  type="text"
                  value={formData.current_location}
                  onChange={(e) => setFormData({ ...formData, current_location: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-outline-variant rounded-lg text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Assigned Agent</label>
                <input
                  type="text"
                  value={formData.assigned_agent}
                  onChange={(e) => setFormData({ ...formData, assigned_agent: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-outline-variant rounded-lg text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Vehicle Number</label>
                <input
                  type="text"
                  value={formData.vehicle_number}
                  onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-outline-variant rounded-lg text-on-surface outline-none focus:border-primary"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={updateLoading}
              className="w-full px-4 py-2 bg-primary text-on-primary rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {updateLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        )}

        {/* Sender & Receiver */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-surface-container rounded-lg p-6 border border-outline-variant">
            <h3 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              From
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-on-surface-variant mb-1">Name</p>
                <p className="font-medium text-on-surface">{shipment.sender_name}</p>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant mb-1">Address</p>
                <p className="text-sm text-on-surface">{shipment.sender_address}</p>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant mb-1">City & PIN</p>
                <p className="text-sm text-on-surface">
                  {shipment.sender_city}, {shipment.sender_pincode}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container rounded-lg p-6 border border-outline-variant">
            <h3 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              To
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-on-surface-variant mb-1">Name</p>
                <p className="font-medium text-on-surface">{shipment.receiver_name}</p>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant mb-1">Address</p>
                <p className="text-sm text-on-surface">{shipment.receiver_address}</p>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant mb-1">City & PIN</p>
                <p className="text-sm text-on-surface">
                  {shipment.receiver_city}, {shipment.receiver_pincode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Package Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface-container rounded-lg p-4 border border-outline-variant">
            <p className="text-sm text-on-surface-variant mb-1">Package Type</p>
            <p className="font-medium text-on-surface">{shipment.package_type}</p>
          </div>
          <div className="bg-surface-container rounded-lg p-4 border border-outline-variant">
            <p className="text-sm text-on-surface-variant mb-1">Weight</p>
            <p className="font-medium text-on-surface">{shipment.weight} kg</p>
          </div>
          <div className="bg-surface-container rounded-lg p-4 border border-outline-variant">
            <p className="text-sm text-on-surface-variant mb-1">Value</p>
            <p className="font-medium text-on-surface">₹{shipment.value || 'N/A'}</p>
          </div>
          <div className="bg-surface-container rounded-lg p-4 border border-outline-variant">
            <p className="text-sm text-on-surface-variant mb-1">Est. Delivery</p>
            <p className="font-medium text-on-surface">{new Date(shipment.estimated_delivery).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Timeline */}
        {shipment.events && shipment.events.length > 0 && (
          <div className="bg-surface-container rounded-lg p-6 border border-outline-variant">
            <h3 className="text-lg font-semibold text-on-surface mb-6">Tracking Timeline</h3>
            <div className="space-y-4">
              {shipment.events.map((event, idx) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mt-2" />
                    {idx < shipment.events!.length - 1 && <div className="w-0.5 h-16 bg-primary/20 my-2" />}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium text-on-surface">{event.status}</p>
                    <p className="text-sm text-on-surface-variant">{event.location}</p>
                    {event.description && <p className="text-sm text-on-surface-variant mt-1">{event.description}</p>}
                    <p className="text-xs text-on-surface-variant mt-2">
                      {new Date(event.occurred_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
