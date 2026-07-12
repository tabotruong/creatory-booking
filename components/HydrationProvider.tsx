'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'

export default function HydrationProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Trigger rehydration
    useStore.persist.rehydrate()
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="w-12 h-12 rounded-full bg-brand-pink/20 border-2 border-brand-pink border-t-transparent animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
