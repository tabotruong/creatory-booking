'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChecklistItem } from '@/lib/types'
import { EQUIPMENT_LIST } from '@/lib/constants'

interface EquipmentChecklistProps {
  items: ChecklistItem[]
  onChange: (items: ChecklistItem[]) => void
}

export default function EquipmentChecklist({ items, onChange }: EquipmentChecklistProps) {
  const toggleItem = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    )
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-brand-text-secondary mb-3">Tick chọn thiết bị cần mang theo:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border transition-all text-left',
              item.checked
                ? 'bg-brand-pink/20 border-brand-pink text-white'
                : 'bg-brand-elevated border-brand-border text-brand-text-secondary hover:border-brand-pink/50'
            )}
          >
            <div
              className={cn(
                'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0',
                item.checked
                  ? 'bg-brand-pink border-brand-pink'
                  : 'border-brand-border'
              )}
            >
              {item.checked && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
