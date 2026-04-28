'use client'

import React, { useState } from 'react'
import { GlassPanel } from '@/components/glass-panel'
import { mockUser } from '@/lib/data'
import { Bell, Lock, User, Database, LogOut, Save, Copy, Trash2, Send, CreditCard } from 'lucide-react'

type SettingsTab = 'profile' | 'notifications' | 'api-keys' | 'team' | 'billing'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,
    darkMode: true,
    twoFactor: true,
    riskThreshold: 50,
    webhookUrl: 'https://api.example.com/webhooks',
  })
  const [riskThreshold, setRiskThreshold] = useState(50)

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'api-keys', label: 'API Keys', icon: <Database className="w-4 h-4" /> },
    { id: 'team', label: 'Team', icon: <User className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-h1 font-h1 text-on-surface">Settings</h1>
        <p className="text-body-md text-on-surface-variant mt-2">
          Manage your account, team, and system preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="flex gap-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <GlassPanel className="p-8">
            <h3 className="text-h3 font-h3 text-on-surface mb-6">Profile Information</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full glass-panel border border-white/10" />
                <button className="px-4 py-2 bg-surface-container hover:bg-surface-container-high rounded-lg text-on-surface text-sm transition-colors">
                  Change Avatar
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-body-md font-semibold text-on-surface mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue={mockUser.name}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-body-md font-semibold text-on-surface mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={mockUser.email}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-body-md font-semibold text-on-surface mb-2">Company</label>
                  <input
                    type="text"
                    placeholder="SmartLogistics Inc."
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <button className="mt-6 px-6 py-3 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <GlassPanel className="p-8">
            <h3 className="text-h3 font-h3 text-on-surface mb-6">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { label: 'Email Alerts', desc: 'Receive notifications via email' },
                { label: 'SMS Alerts', desc: 'Get critical alerts via SMS' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-surface-container rounded-lg border border-white/10">
                  <div>
                    <p className="font-semibold text-on-surface">{item.label}</p>
                    <p className="text-xs text-on-surface-variant mt-1">{item.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded cursor-pointer" />
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <label className="block text-body-md font-semibold text-on-surface mb-4">Risk Threshold</label>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={riskThreshold}
                  onChange={(e) => setRiskThreshold(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-on-surface-variant">Alert when risk score exceeds {riskThreshold}%</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <label className="block text-body-md font-semibold text-on-surface mb-2">Webhook URL</label>
              <input
                type="text"
                defaultValue={settings.webhookUrl}
                placeholder="https://api.example.com/webhooks"
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant font-mono text-sm outline-none focus:border-primary/50 transition-colors"
              />
              <p className="text-xs text-on-surface-variant mt-2">Receive real-time events via webhook</p>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === 'api-keys' && (
        <div className="space-y-6">
          <GlassPanel className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-h3 font-h3 text-on-surface">API Keys</h3>
              <button className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                Generate API Key
              </button>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Production', prefix: 'sk_live_xxxx...', created: '2024-01-15', lastUsed: '2 hours ago' },
                { name: 'Development', prefix: 'sk_test_xxxx...', created: '2024-01-10', lastUsed: 'Never' },
              ].map((key, i) => (
                <div key={i} className="p-4 bg-surface-container rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-on-surface">{key.name}</p>
                      <p className="text-sm font-mono text-primary mt-1">{key.prefix}</p>
                    </div>
                    <button className="p-2 hover:bg-surface-container-high rounded transition-colors">
                      <Trash2 className="w-4 h-4 text-error" />
                    </button>
                  </div>
                  <div className="flex gap-4 text-xs text-on-surface-variant">
                    <span>Created: {key.created}</span>
                    <span>Last used: {key.lastUsed}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <h4 className="text-body-md font-semibold text-on-surface mb-4">cURL Example</h4>
              <div className="bg-surface-container-lowest border border-white/10 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs font-mono text-outline">
                  <span className="text-emerald-400">$</span> curl -H "Authorization: Bearer sk_live_xxxx" \
                  https://api.smartlogistics.com/v1/shipments
                </pre>
              </div>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <GlassPanel className="p-8">
            <h3 className="text-h3 font-h3 text-on-surface mb-6">Team Members</h3>

            <div className="mb-8 pb-8 border-b border-white/10">
              <label className="block text-body-md font-semibold text-on-surface mb-3">Invite Member</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="member@company.com"
                  className="flex-1 px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary/50 transition-colors"
                />
                <button className="px-6 py-3 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Send Invite
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { name: mockUser.name, email: mockUser.email, role: 'Admin' },
                { name: 'Sarah Chen', email: 'sarah@company.com', role: 'Manager' },
                { name: 'John Smith', email: 'john@company.com', role: 'Viewer' },
              ].map((member, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-surface-container rounded-lg border border-white/10">
                  <div>
                    <p className="font-semibold text-on-surface">{member.name}</p>
                    <p className="text-xs text-on-surface-variant">{member.email}</p>
                  </div>
                  <select
                    defaultValue={member.role}
                    className="px-3 py-2 bg-surface-container-low border border-white/10 rounded text-on-surface text-sm outline-none"
                  >
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Viewer</option>
                  </select>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <GlassPanel className="p-8">
            <h3 className="text-h3 font-h3 text-on-surface mb-6">Billing</h3>

            <div className="mb-8 p-6 bg-surface-container rounded-lg border border-white/10">
              <p className="text-sm text-on-surface-variant mb-2">Current Plan</p>
              <p className="text-h2 font-h2 text-on-surface">Pro</p>
              <p className="text-sm text-on-surface-variant mt-2">$299/month</p>
              <button className="mt-4 px-6 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                Manage Subscription
              </button>
            </div>

            <div className="mb-8 pb-8 border-b border-white/10">
              <h4 className="text-body-md font-semibold text-on-surface mb-4">Usage</h4>
              <div className="space-y-3">
                {[
                  { label: 'Shipments', used: 1247, limit: 5000 },
                  { label: 'API Calls', used: 45230, limit: 100000 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-on-surface">{item.label}</span>
                      <span className="text-on-surface-variant">{item.used} / {item.limit}</span>
                    </div>
                    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                        style={{ width: `${(item.used / item.limit) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-body-md font-semibold text-on-surface mb-4">Recent Invoices</h4>
              <div className="space-y-2">
                {[
                  { date: '2024-01-01', amount: '$299.00', status: 'Paid' },
                  { date: '2023-12-01', amount: '$299.00', status: 'Paid' },
                ].map((invoice, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-surface-container rounded border border-white/10">
                    <div className="text-sm">
                      <p className="text-on-surface">{invoice.date}</p>
                      <p className="text-on-surface-variant">{invoice.amount}</p>
                    </div>
                    <span className="text-xs text-emerald-400">{invoice.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>

          {/* Logout */}
          <GlassPanel className="p-8">
            <button className="w-full px-4 py-4 bg-error/10 border border-error/30 rounded-lg text-error hover:bg-error/20 transition-colors font-semibold flex items-center justify-center gap-2">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </GlassPanel>
        </div>
      )}
    </div>
  )
}
