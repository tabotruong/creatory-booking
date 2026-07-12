'use client'

import { CameraSettings as CameraSettingsType } from '@/lib/types'
import Toggle from '../ui/Toggle'
import Input from '../ui/Input'
import Select from '../ui/Select'

interface CameraSettingsProps {
  settings: CameraSettingsType
  onChange: (settings: CameraSettingsType) => void
}

export default function CameraSettingsForm({ settings, onChange }: CameraSettingsProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-white">Camera Setting</h4>

      <div className="space-y-3">
        <Toggle
          label="Format thẻ"
          checked={settings.cardFormat}
          onChange={(v) => onChange({ ...settings, cardFormat: v })}
        />

        <Toggle
          label="PP"
          checked={settings.pp}
          onChange={(v) => onChange({ ...settings, pp: v })}
        />

        <Toggle
          label="Aperture"
          checked={settings.aputure}
          onChange={(v) => onChange({ ...settings, aputure: v })}
        />

        <Toggle
          label="Resolution 4K"
          checked={settings.resolution === '4K'}
          onChange={(v) => onChange({ ...settings, resolution: v ? '4K' : 'FullHD' })}
        />

        <Toggle
          label="FPS 60"
          checked={settings.fps === 60}
          onChange={(v) => onChange({ ...settings, fps: v ? 60 : 30 })}
        />

        <Toggle
          label="ISO"
          checked={settings.iso > 0}
          onChange={(v) => onChange({ ...settings, iso: v ? 800 : 0 })}
        />

        <Toggle
          label="Shutter"
          checked={settings.shutterSpeed !== 'Auto' && settings.shutterSpeed !== ''}
          onChange={(v) => onChange({ ...settings, shutterSpeed: v ? '1/50' : 'Auto' })}
        />

        <Toggle
          label="WB"
          checked={settings.wb !== 'Auto'}
          onChange={(v) => onChange({ ...settings, wb: v ? '5600K' : 'Auto' })}
        />

        <Toggle
          label="Rec Level"
          checked={settings.recLevel > 0}
          onChange={(v) => onChange({ ...settings, recLevel: v ? 50 : 0 })}
        />
      </div>
    </div>
  )
}
