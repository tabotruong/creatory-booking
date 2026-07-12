'use client'

import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'pending' | 'approved' | 'recording' | 'modified' | 'rejected'
  size?: 'sm' | 'md'
  className?: string
  showDot?: boolean
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  showDot = false,
}: BadgeProps) {
  const variants = {
    default: 'bg-brand-elevated text-brand-text-secondary border-brand-border',
    pending: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    recording: 'bg-red-500/20 text-red-400 border-red-500/30',
    modified: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            'w-2 h-2 rounded-full',
            variant === 'recording' && 'animate-pulse-recording bg-red-500',
            variant === 'pending' && 'bg-blue-500',
            variant === 'approved' && 'bg-green-500',
            variant === 'modified' && 'bg-orange-500',
            variant === 'rejected' && 'bg-red-500',
            variant === 'default' && 'bg-gray-500'
          )}
        />
      )}
      {children}
    </span>
  )
}
