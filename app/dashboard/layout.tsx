import React from 'react'
import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/top-bar'

export const metadata = {
  title: 'Dashboard - SmartLogistics',
  description: 'Supply chain management dashboard',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar title="Dashboard" />
      <main className="md:ml-64 pt-24 pb-8 px-4 md:px-8">
        {children}
      </main>
    </div>
  )
}
