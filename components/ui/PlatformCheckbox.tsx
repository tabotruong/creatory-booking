'use client'

import { cn } from '@/lib/utils'

interface PlatformCheckboxProps {
  platform: string
  selected: boolean
  onChange: (selected: boolean) => void
}

const platformIcons: Record<string, string> = {
  Facebook: '📘',
  TikTok: '🎵',
  YouTube: '📺',
  Shopee: '🛒',
}

export default function PlatformCheckbox({ platform, selected, onChange }: PlatformCheckboxProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!selected)}
      className={cn(
        'px-4 py-2 rounded-lg border transition-all duration-200',
        selected
          ? 'bg-brand-pink/20 border-brand-pink text-white'
          : 'bg-brand-elevated border-brand-border text-brand-text-secondary hover:border-brand-pink/50'
      )}
    >
      <span className="mr-2">{platformIcons[platform] || '📱'}</span>
      {platform}
    </button>
  )
}
