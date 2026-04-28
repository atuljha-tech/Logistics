import React from 'react'
import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/top-bar'

export const metadata = {
  title: 'Supply Chain - SmartLogistics',
  description: 'AI-powered supply chain route optimization',
}

export default function SupplyChainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar title="Supply Chain" />
      <main className="md:ml-64 pt-24 pb-8 px-4 md:px-8">
        {children}
      </main>
    </div>
  )
}
