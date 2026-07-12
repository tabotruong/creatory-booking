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

  const checkedCount = items.filter((i) => i.checked).length
  const progress = Math.round((checkedCount / items.length) * 100)

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-brand-border rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-green transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-brand-text-secondary">
          {checkedCount}/{items.length}
        </span>
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border transition-all',
              item.checked
                ? 'bg-brand-green/20 border-brand-green text-white'
                : 'bg-brand-elevated border-brand-border text-brand-text-secondary hover:border-brand-pink/50'
            )}
          >
            <div
              className={cn(
                'w-6 h-6 rounded border-2 flex items-center justify-center transition-colors',
                item.checked
                  ? 'bg-brand-green border-brand-green'
                  : 'border-brand-border'
              )}
            >
              {item.checked && <Check className="w-4 h-4 text-white" />}
            </div>
            <span className="text-sm">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
