'use client'

import { useEffect } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function Toast() {
  const toast = useStore((state) => state.toast)
  const hideToast = useStore((state) => state.hideToast)

  if (!toast) return null

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-brand-green" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-brand-blue" />,
  }

  const backgrounds = {
    success: 'bg-green-500/20 border-green-500/50',
    error: 'bg-red-500/20 border-red-500/50',
    info: 'bg-blue-500/20 border-blue-500/50',
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-md',
          backgrounds[toast.type]
        )}
      >
        {icons[toast.type]}
        <span className="text-white font-medium">{toast.message}</span>
        <button
          onClick={hideToast}
          className="p-1 rounded hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-brand-text-secondary" />
        </button>
      </div>
    </div>
  )
}
