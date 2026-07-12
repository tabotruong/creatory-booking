'use client'

import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CounterProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label?: string
  className?: string
}

export default function Counter({
  value,
  onChange,
  min = 0,
  max = 99,
  label,
  className,
}: CounterProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="block text-sm font-medium text-brand-text-secondary">
          {label}
          <span className="text-red-500 ml-1">*</span>
        </label>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className={cn(
            'w-10 h-10 flex items-center justify-center rounded-lg border border-brand-border bg-brand-elevated transition-colors',
            'hover:bg-brand-surface hover:border-brand-pink/50',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-elevated disabled:hover:border-brand-border'
          )}
        >
          <Minus className="w-4 h-4 text-white" />
        </button>
        <span className="w-12 text-center text-xl font-semibold text-white font-display">
          {value}
        </span>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className={cn(
            'w-10 h-10 flex items-center justify-center rounded-lg border border-brand-border bg-brand-elevated transition-colors',
            'hover:bg-brand-surface hover:border-brand-pink/50',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-elevated disabled:hover:border-brand-border'
          )}
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  )
}
