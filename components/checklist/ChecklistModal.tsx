'use client'

import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Textarea from '../ui/Textarea'
import EquipmentChecklist from './EquipmentChecklist'
import CameraSettingsForm from './CameraSettings'
import MicSettingsForm from './MicSettings'
import { ChecklistItem, CameraSettings, MicSettings } from '@/lib/types'
import { useStore } from '@/lib/store'
import { DEFAULT_EQUIPMENT_CHECKLIST, DEFAULT_CAMERA_SETTINGS, DEFAULT_MIC_SETTINGS } from '@/lib/constants'

interface ChecklistModalProps {
  isOpen: boolean
  onClose: () => void
  bookingId: string
}

export default function ChecklistModal({ isOpen, onClose, bookingId }: ChecklistModalProps) {
  const user = useStore((state) => state.user)
  const updateBooking = useStore((state) => state.updateBooking)
  const bookings = useStore((state) => state.bookings)

  const booking = bookings.find(b => b.id === bookingId)

  const [activeTab, setActiveTab] = useState<'equipment' | 'camera' | 'mic' | 'notes'>('equipment')
  const [equipmentItems, setEquipmentItems] = useState<ChecklistItem[]>(DEFAULT_EQUIPMENT_CHECKLIST())
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>(DEFAULT_CAMERA_SETTINGS())
  const [micSettings, setMicSettings] = useState<MicSettings>(DEFAULT_MIC_SETTINGS())
  const [checkInTime, setCheckInTime] = useState<string | null>(null)
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'checkin' | 'checkout' | null>(null)
  const [notes, setNotes] = useState(booking?.checklistNotes?.[user?.name || ''] || '')

  const handleSubmit = () => {
    if (user && booking) {
      // Save notes to booking
      const newChecklistNotes = {
        ...booking.checklistNotes,
        [user.name]: notes,
      }
      updateBooking(bookingId, { checklistNotes: newChecklistNotes })
    }
    onClose()
  }

  const handleCheckInClick = () => {
    setConfirmAction('checkin')
    setShowConfirmModal(true)
  }

  const handleCheckOutClick = () => {
    setConfirmAction('checkout')
    setShowConfirmModal(true)
  }

  const confirmActionHandler = () => {
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    if (confirmAction === 'checkin') {
      setCheckInTime(now)
    } else if (confirmAction === 'checkout') {
      setCheckOutTime(now)
    }
    setShowConfirmModal(false)
    setConfirmAction(null)
  }

  const tabs = [
    { id: 'equipment' as const, label: 'Thiết bị' },
    { id: 'camera' as const, label: 'Camera Setting' },
    { id: 'mic' as const, label: 'Micro' },
    { id: 'notes' as const, label: 'Ghi chú' },
  ]

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Checklist Thiết bị" size="lg">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-brand-border">
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
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <p className="text-sm text-brand-text-secondary">
                Ghi lại các vấn đề hoặc lưu ý trong quá trình quay để Manager tiện theo dõi.
              </p>
              <Textarea
                label="Ghi chú / Vấn đề"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="VD: Ánh sáng yếu buổi sáng, mic có tiếng réo..."
                rows={6}
              />
            </div>
          )}
        </div>

        {/* Check-in/Check-out */}
        <div className="mt-6 pt-4 border-t border-brand-border space-y-3">
          <h4 className="font-medium text-white">Check-in / Check-out</h4>
          <div className="flex gap-3">
            <Button
              variant={checkInTime ? 'success' : 'secondary'}
              onClick={handleCheckInClick}
              className="flex-1"
            >
              {checkInTime ? `✓ Check-in: ${checkInTime}` : 'Check-in'}
            </Button>
            <Button
              variant={checkOutTime ? 'danger' : 'secondary'}
              onClick={handleCheckOutClick}
              className="flex-1"
              disabled={!checkInTime}
            >
              {checkOutTime ? `✓ Check-out: ${checkOutTime}` : 'Check-out'}
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

      {/* Confirm Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={confirmAction === 'checkin' ? 'Xác nhận Check-in' : 'Xác nhận Check-out'}
        size="sm"
      >
        <p className="text-brand-text-secondary mb-6">
          {confirmAction === 'checkin'
            ? `Xác nhận check-in lúc ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}?`
            : `Xác nhận check-out lúc ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}?`}
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setShowConfirmModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={confirmActionHandler}>
            Xác nhận
          </Button>
        </div>
      </Modal>
    </>
  )
}
