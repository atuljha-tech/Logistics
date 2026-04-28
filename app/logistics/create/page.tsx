'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Send, Loader, CheckCircle2, AlertTriangle } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const INDIAN_CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Kolkata',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Ahmedabad',
]

export default function CreateShipment() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    sender_name: '',
    sender_phone: '',
    sender_address: '',
    sender_city: '',
    sender_pincode: '',
    receiver_name: '',
    receiver_phone: '',
    receiver_address: '',
    receiver_city: '',
    receiver_pincode: '',
    package_type: 'Electronics',
    weight: '',
    value: '',
    description: '',
    estimated_delivery: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch(`${API_BASE}/api/shipments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          window.location.href = '/logistics'
        }, 1800)
      } else {
        // Surface the real error from the backend
        const msg = data.error || 'Unknown error'
        if (msg.toLowerCase().includes('fetch failed') || msg.toLowerCase().includes('enotfound')) {
          setError(
            '🔌 Cannot reach the database (Supabase). The project URL in backend/.env may be wrong or the Supabase project does not exist. Please check SUPABASE_URL and SUPABASE_KEY in backend/.env and restart the backend.'
          )
        } else {
          setError(`Failed to create shipment: ${msg}`)
        }
      }
    } catch (err: unknown) {
      console.error('Error:', err)
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('fetch') || msg.includes('network') || msg.includes('ECONNREFUSED')) {
        setError(
          '🚫 Cannot reach the backend server. Make sure the backend is running on http://localhost:3001 by running: cd backend && npm run dev'
        )
      } else {
        setError(`Unexpected error: ${msg}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300'

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <Link href="/logistics" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-semibold">Back to Dashboard</span>
          </Link>
          <h1 className="text-h1 font-h1 text-on-surface mb-2">Create New Shipment</h1>
          <p className="text-body-md text-on-surface-variant">Fill in the details below to create a new shipment</p>
        </motion.div>

        {/* Success Banner */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-start gap-3 px-5 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
          >
            <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Shipment created successfully!</p>
              <p className="text-xs opacity-70 mt-0.5">Redirecting to logistics...</p>
            </div>
          </motion.div>
        )}

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-start gap-3 px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400"
          >
            <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Could not create shipment</p>
              <p className="text-xs opacity-80 mt-1 leading-relaxed">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="glass-panel p-8 rounded-2xl border border-white/5 space-y-8"
        >
          {/* Sender Section */}
          <div className="space-y-6">
            <h2 className="text-h3 font-h3 text-on-surface flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">1</span>
              Sender Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-body-md font-semibold text-on-surface mb-2">Full Name *</label>
                <input
                  type="text"
                  name="sender_name"
                  value={form.sender_name}
                  onChange={handleChange}
                  placeholder="e.g., Rahul Sharma"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-body-md font-semibold text-on-surface mb-2">Phone *</label>
                <input
                  type="tel"
                  name="sender_phone"
                  value={form.sender_phone}
                  onChange={handleChange}
                  placeholder="+91-XXXXX-XXXXX"
                  required
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-body-md font-semibold text-on-surface mb-2">Address *</label>
                <textarea
                  name="sender_address"
                  value={form.sender_address}
                  onChange={handleChange}
                  placeholder="Street address, building number, etc."
                  required
                  rows={3}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-body-md font-semibold text-on-surface mb-2">City *</label>
                <select
                  name="sender_city"
                  value={form.sender_city}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select City</option>
                  {INDIAN_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-body-md font-semibold text-on-surface mb-2">PIN Code *</label>
                <input
                  type="text"
                  name="sender_pincode"
                  value={form.sender_pincode}
                  onChange={handleChange}
                  placeholder="e.g., 400001"
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/5"></div>

          {/* Receiver Section */}
          <div className="space-y-6">
            <h2 className="text-h3 font-h3 text-on-surface flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">2</span>
              Receiver Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-body-md font-semibold text-on-surface mb-2">Full Name *</label>
                <input
                  type="text"
                  name="receiver_name"
                  value={form.receiver_name}
                  onChange={handleChange}
                  placeholder="e.g., Priya Verma"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-body-md font-semibold text-on-surface mb-2">Phone *</label>
                <input
                  type="tel"
                  name="receiver_phone"
                  value={form.receiver_phone}
                  onChange={handleChange}
                  placeholder="+91-XXXXX-XXXXX"
                  required
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-body-md font-semibold text-on-surface mb-2">Address *</label>
                <textarea
                  name="receiver_address"
                  value={form.receiver_address}
                  onChange={handleChange}
                  placeholder="Street address, building number, etc."
                  required
                  rows={3}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-body-md font-semibold text-on-surface mb-2">City *</label>
                <select
                  name="receiver_city"
                  value={form.receiver_city}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select City</option>
                  {INDIAN_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-body-md font-semibold text-on-surface mb-2">PIN Code *</label>
                <input
                  type="text"
                  name="receiver_pincode"
                  value={form.receiver_pincode}
                  onChange={handleChange}
                  placeholder="e.g., 700001"
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/5"></div>

          {/* Package Section */}
          <div className="space-y-6">
            <h2 className="text-h3 font-h3 text-on-surface flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">3</span>
              Package Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-body-md font-semibold text-on-surface mb-2">Package Type *</label>
                <select name="package_type" value={form.package_type} onChange={handleChange} className={inputClass}>
                  <option>Electronics</option>
                  <option>Documents</option>
                  <option>Clothing</option>
                  <option>Food Items</option>
                  <option>Books</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-body-md font-semibold text-on-surface mb-2">Weight (kg) *</label>
                <input
                  type="number"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  placeholder="e.g., 2.5"
                  step="0.1"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-body-md font-semibold text-on-surface mb-2">Estimated Delivery *</label>
                <input
                  type="date"
                  name="estimated_delivery"
                  value={form.estimated_delivery}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-body-md font-semibold text-on-surface mb-2">Value (₹)</label>
                <input
                  type="number"
                  name="value"
                  value={form.value}
                  onChange={handleChange}
                  placeholder="e.g., 5000"
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-body-md font-semibold text-on-surface mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="What's in this package? (optional)"
                  rows={2}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-primary via-primary to-primary/80 text-on-primary rounded-xl font-semibold hover:opacity-90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Create Shipment
                </>
              )}
            </button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  )
}
