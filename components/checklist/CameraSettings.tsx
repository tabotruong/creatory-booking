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

      <div className="grid grid-cols-2 gap-4">
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

        <Select
          label="Resolution"
          value={settings.resolution}
          onChange={(e) => onChange({ ...settings, resolution: e.target.value as CameraSettingsType['resolution'] })}
          options={[
            { value: 'FullHD', label: 'FullHD' },
            { value: '3K', label: '3K' },
            { value: '4K', label: '4K' },
          ]}
        />

        <Select
          label="FPS"
          value={String(settings.fps)}
          onChange={(e) => onChange({ ...settings, fps: Number(e.target.value) as CameraSettingsType['fps'] })}
          options={[
            { value: '25', label: '25' },
            { value: '30', label: '30' },
            { value: '50', label: '50' },
            { value: '60', label: '60' },
          ]}
        />

        <Input
          label="ISO"
          type="number"
          min={0}
          max={12800}
          value={settings.iso}
          onChange={(e) => onChange({ ...settings, iso: Number(e.target.value) })}
        />

        <Input
          label="Shutter"
          value={settings.shutterSpeed}
          onChange={(e) => onChange({ ...settings, shutterSpeed: e.target.value })}
          placeholder="1/50"
        />

        <Input
          label="WB"
          value={settings.wb}
          onChange={(e) => onChange({ ...settings, wb: e.target.value })}
          placeholder="5600K"
        />
      </div>
    </div>
  )
}
