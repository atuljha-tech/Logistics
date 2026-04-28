import React from 'react'
import { UserSidebar } from '@/components/user-sidebar'
import { UserTopBar } from '@/components/user-top-bar'

export const metadata = {
  title: 'My Dashboard - SmartLogistics',
}

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <UserSidebar />
      <UserTopBar />
      <main className="md:ml-64 pt-24 pb-8 px-4 md:px-8">
        {children}
      </main>
    </div>
  )
}
