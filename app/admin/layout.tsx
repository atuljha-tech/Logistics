import React from 'react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { AdminTopBar } from '@/components/admin-top-bar'

export const metadata = {
  title: 'Admin Dashboard - SmartLogistics',
  description: 'Administrative control panel',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <AdminTopBar />
      <main className="md:ml-64 pt-24 pb-8 px-4 md:px-8">
        {children}
      </main>
    </div>
  )
}
