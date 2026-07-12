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
      <h4 className="font-medium text-white flex items-center gap-2">
        🎤 Mic Settings
      </h4>

      <div className="grid grid-cols-2 gap-4">
        <Toggle
          label="Stereo Mode"
          checked={settings.stereoMode}
          onChange={(v) => onChange({ ...settings, stereoMode: v })}
        />

        <Toggle
          label="Record Status"
          checked={settings.recordStatus}
          onChange={(v) => onChange({ ...settings, recordStatus: v })}
        />

        <Input
          label="Gain"
          type="number"
          min={0}
          max={100}
          value={settings.gain}
          onChange={(e) => onChange({ ...settings, gain: Number(e.target.value) })}
        />
      </div>
    </div>
  )
}
