import type { Metadata } from 'next'

import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Space_Grotesk, Inter } from 'next/font/google'

// Initialize fonts
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ["400", "500", "600", "700"] })
const inter = Inter({ subsets: ['latin'], weight: ["400", "500"] })

export const metadata: Metadata = {
  title: 'VoyagerX - Redefining Travel with AI & Blockchain',
  description: 'Effortless planning, secure bookings, and limitless exploration — tailored just for you.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

import { MapBackground } from '@/components/map-background'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="dark scroll-smooth"
      style={{ '--font-heading': spaceGrotesk.style.fontFamily, '--font-body': inter.style.fontFamily } as React.CSSProperties}
    >
      <body
        suppressHydrationWarning
        className="font-body-md antialiased bg-background text-on-background overflow-x-hidden selection:bg-surface-variant selection:text-primary"
      >
        <MapBackground />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
