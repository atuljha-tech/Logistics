'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const [name, setName] = useState('Sam Chen')
  const [email, setEmail] = useState('sam@smartlogistics.com')
  const [dept, setDept] = useState('Logistics')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-xl">
      <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-pepi-thin text-on-surface">My Profile</motion.h1>

      <div className="bg-surface-container-low border border-white/10 p-8 space-y-5">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
            {name[0]}
          </div>
          <div>
            <p className="text-xl font-pepi-thin text-on-surface">{name}</p>
            <p className="text-sm text-on-surface-variant">Operator · Joined Jan 2023</p>
          </div>
        </div>

        {[
          { label: 'Full Name', value: name, setter: setName },
          { label: 'Email', value: email, setter: setEmail },
          { label: 'Department', value: dept, setter: setDept },
        ].map(({ label, value, setter }) => (
          <div key={label}>
            <label className="text-xs text-on-surface-variant font-biotif-pro block mb-1">{label}</label>
            <input
              type="text"
              value={value}
              onChange={e => setter(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-container border border-white/10 text-on-surface text-sm outline-none focus:border-primary/40 transition-colors"
            />
          </div>
        ))}

        <button
          onClick={handleSave}
          className={`px-6 py-2.5 text-sm font-biotif-pro transition-colors ${saved ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30' : 'bg-primary text-on-primary hover:bg-primary/90'}`}
        >
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
