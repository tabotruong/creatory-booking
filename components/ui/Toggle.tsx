'use client'

import { cn } from '@/lib/utils'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
}

export default function Toggle({ checked, onChange, label, disabled, className }: ToggleProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {/* Toggle switch container */}
      <span
        onClick={(e) => {
          if (disabled) return
          e.preventDefault()
          onChange(!checked)
        }}
        className={cn(
          'relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-200 border border-transparent',
          checked ? 'bg-brand-pink' : 'bg-brand-border',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-4.5 h-4.5 w-[18px] h-[18px] bg-white rounded-full shadow-md transition-transform duration-200',
            checked && 'translate-x-[20px]'
          )}
          style={{
            width: '18px',
            height: '18px',
            transform: checked ? 'translateX(20px)' : 'translateX(0)',
          }}
        />
      </span>
      {label && (
        <span className="text-sm text-brand-text-secondary whitespace-nowrap">{label}</span>
      )}
    </label>
  )
}
