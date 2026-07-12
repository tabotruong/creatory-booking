'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import Toggle from '../ui/Toggle'
import Counter from '../ui/Counter'
import PlatformCheckbox from '../ui/PlatformCheckbox'
import { useStore } from '@/lib/store'
import { MC_LIST, PLATFORMS_LIST, CONTENT_TYPES, SOW_TYPES } from '@/lib/constants'
import { Booking, Platform, ContentType, SOWType } from '@/lib/types'
import { cn } from '@/lib/utils'

interface BookingFormProps {
  isOpen: boolean
  onClose: () => void
  editBooking?: Booking
}

export default function BookingForm({ isOpen, onClose, editBooking }: BookingFormProps) {
  const user = useStore((state) => state.user)
  const addBooking = useStore((state) => state.addBooking)
  const updateBooking = useStore((state) => state.updateBooking)

  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    mcName: editBooking?.mcName || '',
    brandName: editBooking?.brandName || '',
    contentName: editBooking?.contentName || '',
    type: editBooking?.type || ('' as ContentType | ''),
    sow: editBooking?.sow || ('' as SOWType | ''),
    platforms: editBooking?.platforms || ([] as Platform[]),
    date: editBooking?.date || '',
    startTime: editBooking?.startTime || '09:00',
    endTime: editBooking?.endTime || '12:00',
    cameraCount: editBooking?.cameraCount || 1,
    micCount: editBooking?.micCount || 1,
    hasTikTokCamera: editBooking?.hasTikTokCamera || false,
    hasActionCam: editBooking?.hasActionCam || false,
    hasGimbal: editBooking?.hasGimbal || false,
    hasHandheldLight: editBooking?.hasHandheldLight || false,
    location: editBooking?.location || '',
    notes: editBooking?.notes || '',
  })

  // Reset form when editBooking changes
  useEffect(() => {
    if (editBooking) {
      setStep(0)
      setFormData({
        mcName: editBooking.mcName || '',
        brandName: editBooking.brandName || '',
        contentName: editBooking.contentName || '',
        type: editBooking.type || ('' as ContentType | ''),
        sow: editBooking.sow || ('' as SOWType | ''),
        platforms: editBooking.platforms || [],
        date: editBooking.date || '',
        startTime: editBooking.startTime || '09:00',
        endTime: editBooking.endTime || '12:00',
        cameraCount: editBooking.cameraCount || 1,
        micCount: editBooking.micCount || 1,
        hasTikTokCamera: editBooking.hasTikTokCamera || false,
        hasActionCam: editBooking.hasActionCam || false,
        hasGimbal: editBooking.hasGimbal || false,
        hasHandheldLight: editBooking.hasHandheldLight || false,
        location: editBooking.location || '',
        notes: editBooking.notes || '',
      })
    } else if (isOpen) {
      // Reset to empty when creating new
      setStep(0)
      setFormData({
        mcName: '',
        brandName: '',
        contentName: '',
        type: '' as ContentType | '',
        sow: '' as SOWType | '',
        platforms: [],
        date: '',
        startTime: '09:00',
        endTime: '12:00',
        cameraCount: 1,
        micCount: 1,
        hasTikTokCamera: false,
        hasActionCam: false,
        hasGimbal: false,
        hasHandheldLight: false,
        location: '',
        notes: '',
      })
    }
  })

  const handlePlatformToggle = (platform: Platform) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }))
  }

  const handleSubmit = () => {
    if (!user) return

    const bookingData = {
      ...formData,
      type: formData.type as ContentType,
      sow: formData.sow as SOWType,
      status: 'pending' as const,
      assignedCameramen: editBooking?.assignedCameramen || [],
      createdBy: user.id,
      createdByName: user.name,
      isModified: false,
    }

    if (editBooking) {
      updateBooking(editBooking.id, bookingData)
    } else {
      addBooking(bookingData)
    }

    onClose()
    setStep(0)
    setFormData({
      mcName: '',
      brandName: '',
      contentName: '',
      type: '',
      sow: '',
      platforms: [],
      date: '',
      startTime: '09:00',
      endTime: '12:00',
      cameraCount: 1,
      micCount: 1,
      hasTikTokCamera: false,
      hasActionCam: false,
      hasGimbal: false,
      hasHandheldLight: false,
      location: '',
      notes: '',
    })
  }

  const isStepValid = (s: number) => {
    switch (s) {
      case 0:
        return formData.mcName && formData.contentName && formData.type && formData.sow && formData.platforms.length > 0
      case 1:
        return formData.date && formData.startTime && formData.endTime && formData.location
      default:
        return true
    }
  }

  const steps = [
    { title: 'Thông tin nội dung', description: 'MC, tên content, loại hình' },
    { title: 'Lịch trình & thiết bị', description: 'Ngày giờ, camera, micro' },
    { title: 'Xác nhận', description: 'Kiểm tra thông tin' },
  ]

  const today = new Date().toISOString().split('T')[0]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editBooking ? 'Sửa Booking' : 'Tạo Booking Mới'} size="lg">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  i <= step
                    ? 'bg-brand-pink text-white'
                    : 'bg-brand-elevated text-brand-text-secondary'
                )}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    'w-16 sm:w-24 h-0.5 mx-2',
                    i < step ? 'bg-brand-pink' : 'bg-brand-border'
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-brand-text-secondary">
          {steps.map((s, i) => (
            <span key={i} className={i === step ? 'text-brand-pink' : ''}>
              {s.title}
            </span>
          ))}
        </div>
      </div>

      {/* Step 0: Content Info */}
      {step === 0 && (
        <div className="space-y-4 animate-fade-in">
          <Select
            label="Tên MC"
            value={formData.mcName}
            onChange={(e) => setFormData({ ...formData, mcName: e.target.value })}
            options={MC_LIST.map((mc) => ({ value: mc, label: mc }))}
            required
          />

          {formData.mcName === 'Brand' && (
            <Input
              label="Tên Brand"
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              placeholder="Tên brand"
              required
            />
          )}

          <Input
            label="Tên Content"
            value={formData.contentName}
            onChange={(e) => setFormData({ ...formData, contentName: e.target.value })}
            placeholder="Nhập tên nội dung"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Loại content"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ContentType })}
              options={CONTENT_TYPES.map((t) => ({ value: t, label: t }))}
              required
            />
            <Select
              label="SOW"
              value={formData.sow}
              onChange={(e) => setFormData({ ...formData, sow: e.target.value as SOWType })}
              options={SOW_TYPES.map((s) => ({ value: s, label: s }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-2">
              Nền tảng <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS_LIST.map((platform) => (
                <PlatformCheckbox
                  key={platform}
                  platform={platform}
                  selected={formData.platforms.includes(platform)}
                  onChange={() => handlePlatformToggle(platform)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Schedule & Equipment */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <Input
            label="Ngày quay"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            min={today}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Giờ bắt đầu"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
            <Input
              label="Giờ kết thúc"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Counter
              label="Số Camera (16:9)"
              value={formData.cameraCount}
              onChange={(v) => setFormData({ ...formData, cameraCount: v })}
              min={1}
              max={10}
            />
            <Counter
              label="Số Microphone"
              value={formData.micCount}
              onChange={(v) => setFormData({ ...formData, micCount: v })}
              min={1}
              max={10}
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-brand-text-secondary">Thiết bị bổ sung</p>
            <div className="grid grid-cols-2 gap-3">
              <Toggle
                label="Camera 9:16 TikTok"
                checked={formData.hasTikTokCamera}
                onChange={(v) => setFormData({ ...formData, hasTikTokCamera: v })}
              />
              <Toggle
                label="Action Cam"
                checked={formData.hasActionCam}
                onChange={(v) => setFormData({ ...formData, hasActionCam: v })}
              />
              <Toggle
                label="Gimbal"
                checked={formData.hasGimbal}
                onChange={(v) => setFormData({ ...formData, hasGimbal: v })}
              />
              <Toggle
                label="Đèn cầm tay"
                checked={formData.hasHandheldLight}
                onChange={(v) => setFormData({ ...formData, hasHandheldLight: v })}
              />
            </div>
          </div>

          <Input
            label="Địa điểm"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Studio A, Studio B, Outdoor..."
            required
          />

          <Textarea
            label="Ghi chú"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Yêu cầu đặc biệt, lưu ý..."
          />
        </div>
      )}

      {/* Step 2: Summary */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 bg-brand-elevated rounded-lg space-y-3">
            <h4 className="font-semibold text-white">Thông tin nội dung</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-brand-text-secondary">MC:</div>
              <div className="text-white">{formData.mcName === 'Brand' ? formData.brandName : formData.mcName}</div>
              <div className="text-brand-text-secondary">Content:</div>
              <div className="text-white">{formData.contentName}</div>
              <div className="text-brand-text-secondary">Loại hình:</div>
              <div className="text-white">{formData.type} - {formData.sow}</div>
              <div className="text-brand-text-secondary">Nền tảng:</div>
              <div className="text-white">{formData.platforms.join(', ')}</div>
            </div>
          </div>

          <div className="p-4 bg-brand-elevated rounded-lg space-y-3">
            <h4 className="font-semibold text-white">Lịch trình</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-brand-text-secondary">Ngày:</div>
              <div className="text-white">{formData.date}</div>
              <div className="text-brand-text-secondary">Giờ:</div>
              <div className="text-white">{formData.startTime} - {formData.endTime}</div>
              <div className="text-brand-text-secondary">Địa điểm:</div>
              <div className="text-white">{formData.location}</div>
            </div>
          </div>

          <div className="p-4 bg-brand-elevated rounded-lg space-y-3">
            <h4 className="font-semibold text-white">Thiết bị</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-brand-text-secondary">Camera:</div>
              <div className="text-white">{formData.cameraCount}</div>
              <div className="text-brand-text-secondary">Micro:</div>
              <div className="text-white">{formData.micCount}</div>
              <div className="text-brand-text-secondary">Bổ sung:</div>
              <div className="text-white">
                {[
                  formData.hasTikTokCamera && 'TikTok Camera',
                  formData.hasActionCam && 'Action Cam',
                  formData.hasGimbal && 'Gimbal',
                  formData.hasHandheldLight && 'Đèn cầm tay',
                ]
                  .filter(Boolean)
                  .join(', ') || 'Không'}
              </div>
            </div>
          </div>

          {formData.notes && (
            <div className="p-4 bg-brand-elevated rounded-lg">
              <h4 className="font-semibold text-white mb-2">Ghi chú</h4>
              <p className="text-sm text-brand-text-secondary">{formData.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between mt-6 pt-4 border-t border-brand-border">
        <Button
          variant="ghost"
          onClick={() => (step === 0 ? onClose() : setStep(step - 1))}
        >
          {step === 0 ? 'Hủy' : 'Quay lại'}
        </Button>
        {step < 2 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!isStepValid(step)}>
            Tiếp theo
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            <Check className="w-4 h-4 mr-1" />
            {editBooking ? 'Cập nhật' : 'Tạo Booking'}
          </Button>
        )}
      </div>
    </Modal>
  )
}
