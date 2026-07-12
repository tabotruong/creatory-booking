'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar, Header, MobileNav } from '@/components/layout'
import { Toast } from '@/components/ui'
import { useStore } from '@/lib/store'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user = useStore((state) => state.user)
  const [showMobileNav, setShowMobileNav] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect to login if no user (only after mounting)
  useEffect(() => {
    if (mounted && !user) {
      router.push('/login')
    }
  }, [mounted, user, router])

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="w-12 h-12 rounded-full bg-brand-pink/20 border-2 border-brand-pink border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header
          title="Creatory"
          onMenuClick={() => setShowMobileNav(true)}
          showMenuButton
        />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      {/* Mobile Nav */}
      <MobileNav isOpen={showMobileNav} onClose={() => setShowMobileNav(false)} />

      {/* Toast */}
      <Toast />
    </div>
  )
}