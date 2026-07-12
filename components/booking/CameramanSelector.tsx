'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CAMERAMEN_LIST } from '@/lib/constants'

interface CameramanSelectorProps {
  selectedCameramen: string[]
  onChange: (cameramen: string[]) => void
  requiredCount: number
}

export default function CameramanSelector({
  selectedCameramen,
  onChange,
  requiredCount,
}: CameramanSelectorProps) {
  const toggleCameraman = (name: string) => {
    if (selectedCameramen.includes(name)) {
      onChange(selectedCameramen.filter((n) => n !== name))
    } else {
      onChange([...selectedCameramen, name])
    }
  }

  const isValid = selectedCameramen.length >= requiredCount

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-brand-text-secondary">
          Chọn Cameraman <span className="text-red-500">*</span>
        </label>
        <span className="text-sm text-brand-text-secondary">
          {selectedCameramen.length} / {requiredCount} cần thiết
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {CAMERAMEN_LIST.map((name, index) => {
          const isSelected = selectedCameramen.includes(name)
          const selectionIndex = selectedCameramen.indexOf(name)

          return (
            <button
              key={name}
              type="button"
              onClick={() => toggleCameraman(name)}
              className={cn(
                'relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200',
                isSelected
                  ? 'bg-brand-pink/20 border-brand-pink text-white'
                  : 'bg-brand-elevated border-brand-border text-brand-text-secondary hover:border-brand-pink/50'
              )}
            >
              <span className="text-lg">{isSelected ? '✓' : ''}</span>
              <span className="font-medium">{name}</span>

              {/* Selection order badge */}
              {isSelected && selectionIndex >= 0 && (
                <span
                  className={cn(
                    'absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    selectionIndex === 0 && 'bg-brand-pink text-white',
                    selectionIndex === 1 && 'bg-brand-purple text-white',
                    selectionIndex === 2 && 'bg-brand-blue text-white',
                    selectionIndex === 3 && 'bg-brand-green text-white',
                    selectionIndex >= 4 && 'bg-brand-orange text-white'
                  )}
                >
                  {selectionIndex + 1}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {!isValid && (
        <p className="text-sm text-orange-400">
          Cần chọn ít nhất {requiredCount} cameraman để có thể duyệt booking
        </p>
      )}
    </div>
  )
}
