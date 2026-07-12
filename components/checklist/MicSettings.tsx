'use client'

import { MicSettings } from '@/lib/types'
import Toggle from '../ui/Toggle'
import Input from '../ui/Input'

interface MicSettingsProps {
  settings: MicSettings
  onChange: (settings: MicSettings) => void
}

export default function MicSettingsForm({ settings, onChange }: MicSettingsProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-white">Micro Setting</h4>

      <div className="grid grid-cols-2 gap-4">
        <Toggle
          label="Stereo Mode"
          checked={settings.stereoMode}
          onChange={(v) => onChange({ ...settings, stereoMode: v })}
        />

        <Toggle
          label="Record"
          checked={settings.recordStatus}
          onChange={(v) => onChange({ ...settings, recordStatus: v })}
        />

        <Toggle
          label="Gain"
          checked={settings.gain > 0}
          onChange={(v) => onChange({ ...settings, gain: v ? 50 : 0 })}
        />
      </div>
    </div>
  )
}
