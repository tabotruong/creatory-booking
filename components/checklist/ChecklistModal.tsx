'use client'

import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import EquipmentChecklist from './EquipmentChecklist'
import CameraSettingsForm from './CameraSettings'
import MicSettingsForm from './MicSettings'
import { ChecklistItem, CameraSettings, MicSettings } from '@/lib/types'
import { DEFAULT_EQUIPMENT_CHECKLIST, DEFAULT_CAMERA_SETTINGS, DEFAULT_MIC_SETTINGS } from '@/lib/constants'

interface ChecklistModalProps {
  isOpen: boolean
  onClose: () => void
  bookingId: string
}

export default function ChecklistModal({ isOpen, onClose, bookingId }: ChecklistModalProps) {
  const [activeTab, setActiveTab] = useState<'equipment' | 'camera' | 'mic'>('equipment')
  const [equipmentItems, setEquipmentItems] = useState<ChecklistItem[]>(DEFAULT_EQUIPMENT_CHECKLIST())
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>(DEFAULT_CAMERA_SETTINGS())
  const [micSettings, setMicSettings] = useState<MicSettings>(DEFAULT_MIC_SETTINGS())
  const [checkedIn, setCheckedIn] = useState(false)
  const [checkedOut, setCheckedOut] = useState(false)

  const handleSubmit = () => {
    // Save checklist data (in real app, this would go to backend)
    console.log('Equipment:', equipmentItems)
    console.log('Camera:', cameraSettings)
    console.log('Mic:', micSettings)
    onClose()
  }

  const tabs = [
    { id: 'equipment' as const, label: 'Thiết bị', icon: '📦' },
    { id: 'camera' as const, label: 'Camera', icon: '📷' },
    { id: 'mic' as const, label: 'Micro', icon: '🎤' },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Checklist Thiết bị" size="lg">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-brand-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-brand-pink text-brand-pink'
                : 'border-transparent text-brand-text-secondary hover:text-white'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {activeTab === 'equipment' && (
          <EquipmentChecklist items={equipmentItems} onChange={setEquipmentItems} />
        )}
        {activeTab === 'camera' && (
          <CameraSettingsForm settings={cameraSettings} onChange={setCameraSettings} />
        )}
        {activeTab === 'mic' && (
          <MicSettingsForm settings={micSettings} onChange={setMicSettings} />
        )}
      </div>

      {/* Check-in/Check-out */}
      <div className="mt-6 pt-4 border-t border-brand-border space-y-3">
        <h4 className="font-medium text-white">Check-in / Check-out</h4>
        <div className="flex gap-3">
          <Button
            variant={checkedIn ? 'success' : 'secondary'}
            onClick={() => setCheckedIn(!checkedIn)}
            className="flex-1"
          >
            {checkedIn ? '✓' : ''} Check-in lúc {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </Button>
          <Button
            variant={checkedOut ? 'danger' : 'secondary'}
            onClick={() => setCheckedOut(!checkedOut)}
            className="flex-1"
            disabled={!checkedIn}
          >
            {checkedOut ? '✓' : ''} Check-out
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-brand-border">
        <Button variant="ghost" onClick={onClose}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Lưu Checklist
        </Button>
      </div>
    </Modal>
  )
}
