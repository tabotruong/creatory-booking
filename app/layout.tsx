import type { Metadata } from 'next'
import './globals.css'
import HydrationProvider from '@/components/HydrationProvider'

export const metadata: Metadata = {
  title: 'Creatory - Booking Lịch Quay',
  description: 'Hệ thống đặt lịch quay cho Creatory Studio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className="font-body antialiased">
        <HydrationProvider>
          {children}
        </HydrationProvider>
      </body>
    </html>
  )
}
