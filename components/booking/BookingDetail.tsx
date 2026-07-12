'use client'

import { useState } from 'react'
import {
  Video,
  MapPin,
  Clock,
  Users,
  Mic,
  Camera,
  Calendar,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Camera as CameraIcon,
  Lightbulb,
  Move3D,
  Smartphone,
  Aperture,
  Building2,
  UserPlus,
} from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { useStore } from '@/lib/store'
import { Booking } from '@/lib/types'
import { formatDate, getStatusConfig, isRecording, cn } from '@/lib/utils'
import { CAMERAMEN_LIST } from '@/lib/constants'
import { useRouter } from 'next/navigation'

interface BookingDetailProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
  onEdit: (booking: Booking) => void
}

interface InfoRowProps {
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
  highlight?: boolean
}

function InfoRow({ label, value, icon, highlight }: InfoRowProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 py-2 border-b border-brand-border/50 last:border-b-0 rounded px-2 -mx-2 transition-colors',
        highlight && 'bg-orange-500/20 border-l-2 border-l-orange-500'
      )}
    >
      {icon && <div className="text-brand-pink mt-0.5 flex-shrink-0">{icon}</div>}
      <div className="flex-1 grid grid-cols-2 gap-2">
        <div className="text-sm text-brand-text-secondary">
          {label}
          {highlight && <span className="ml-1 text-xs text-orange-400">(đã thay đổi)</span>}
        </div>
        <div className={cn('text-sm', highlight ? 'text-orange-300 font-medium' : 'text-white')}>{value}</div>
      </div>
    </div>
  )
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 rounded-lg bg-brand-pink/20 flex items-center justify-center text-brand-pink">
        {icon}
      </div>
      <h4 className="font-semibold text-white font-display">{title}</h4>
    </div>
  )
}

export default function BookingDetail({ booking, isOpen, onClose, onEdit }: BookingDetailProps) {
  const router = useRouter()
  const user = useStore((state) => state.user)
  const bookings = useStore((state) => state.bookings)
  const updateBooking = useStore((state) => state.updateBooking)
  const deleteBooking = useStore((state) => state.deleteBooking)
  const approveBooking = useStore((state) => state.approveBooking)
  const rejectBooking = useStore((state) => state.rejectBooking)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedCameramen, setSelectedCameramen] = useState<string[]>([])
  const [showCameramanDropdown, setShowCameramanDropdown] = useState(false)

  if (!booking) return null

  const config = getStatusConfig(booking)
  const recording = isRecording(booking)
  const isManager = user?.role === 'manager'
  const isContentTeam = user?.role === 'content_team' || user?.role === 'producer'
  const canEdit = isManager || isContentTeam // Tất cả các role đều có thể sửa
  const canDelete = isManager || (isContentTeam && booking.status === 'pending')
  const canApprove = isManager && booking.status === 'pending'
  const canReject = isManager && booking.status === 'pending'
  const canAssignCameraman = isManager && booking.status === 'approved'

  // Helper to check if field was changed
  const isFieldChanged = (field: string): boolean => {
    return booking.isModified && (booking.changedFields?.includes(field) ?? false)
  }

  const handleApprove = () => {
    approveBooking(booking.id)
    onClose()
  }

  const handleReject = () => {
    rejectBooking(booking.id)
    onClose()
  }

  const handleConfirm = () => {
    updateBooking(booking.id, { isModified: false })
    onClose()
  }

  const handleDelete = () => {
    deleteBooking(booking.id)
    setShowDeleteConfirm(false)
    onClose()
  }

  const handleEdit = () => {
    onEdit(booking)
    onClose()
  }

  const handleToggleCameraman = (name: string) => {
    setSelectedCameramen(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    )
  }

  const handleAssignCameraman = () => {
    updateBooking(booking.id, { assignedCameramen: selectedCameramen })
    setShowCameramanDropdown(false)
  }

  // Check cameraman conflict
  const getCameramanConflict = (cameramanName: string): string | null => {
    const conflictingBooking = bookings.find(b => {
      if (b.id === booking.id) return false
      if (!b.assignedCameramen.includes(cameramanName)) return false
      if (b.date !== booking.date) return false
      const bStart = b.startTime.replace(':', '')
      const bEnd = b.endTime.replace(':', '')
      const newStart = booking.startTime.replace(':', '')
      const newEnd = booking.endTime.replace(':', '')
      return (newStart < bEnd && newEnd > bStart)
    })
    return conflictingBooking ? conflictingBooking.contentName : null
  }

  const handleToggleCameramanWithConflict = (name: string) => {
    if (!selectedCameramen.includes(name) && getCameramanConflict(name)) {
      return
    }
    handleToggleCameraman(name)
  }

  // Equipment list for display
  const equipment = []
  if (booking.cameraCount) equipment.push({ label: `Camera: ${booking.cameraCount} cái`, enabled: true })
  if (booking.micCount) equipment.push({ label: `Microphone: ${booking.micCount} cái`, enabled: true })
  if (booking.hasTikTokCamera) equipment.push({ label: 'Camera 9:16 TikTok', enabled: true })
  if (booking.hasActionCam) equipment.push({ label: 'Action Cam', enabled: true })
  if (booking.hasGimbal) equipment.push({ label: 'Gimbal', enabled: true })
  if (booking.hasHandheldLight) equipment.push({ label: 'Đèn cầm tay', enabled: true })

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết Booking - Review đầy đủ" size="lg">
        <div className="space-y-6">
          {/* Status Banner */}
          <div className={cn('p-4 rounded-lg', config.boxBg)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {recording && (
                  <span className="w-3 h-3 bg-red-500 rounded-full recording-dot" />
                )}
                <Badge
                  variant={
                    booking.isModified
                      ? 'modified'
                      : recording
                      ? 'recording'
                      : booking.status === 'approved'
                      ? 'approved'
                      : booking.status === 'pending'
                      ? 'pending'
                      : 'rejected'
                  }
                  showDot
                >
                  {config.label}
                </Badge>
                {booking.isModified && (
                  <span className="text-sm text-orange-400">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    Có thay đổi chưa xác nhận
                  </span>
                )}
              </div>
              {recording && (
                <span className="text-sm font-medium text-red-400 animate-pulse">
                  ● LIVE
                </span>
              )}
            </div>
          </div>

          {/* SECTION 1: Thông tin nội dung */}
          <div className="p-4 bg-brand-elevated rounded-lg">
            <SectionTitle icon={<Video className="w-4 h-4" />} title="Thông tin nội dung" />
            <InfoRow
              label="Tên MC"
              value={booking.mcName}
              icon={<Users className="w-4 h-4" />}
              highlight={isFieldChanged('mcName')}
            />
            {booking.mcName === 'Brand' && booking.brandName && (
              <InfoRow
                label="Brand Name"
                value={booking.brandName}
                icon={<Building2 className="w-4 h-4" />}
                highlight={isFieldChanged('brandName')}
              />
            )}
            <InfoRow
              label="Tên Content"
              value={<span className="font-medium">{booking.contentName}</span>}
              icon={<Video className="w-4 h-4" />}
              highlight={isFieldChanged('contentName')}
            />
            <InfoRow
              label="Loại content"
              value={
                <span className="px-2 py-0.5 rounded bg-brand-blue/20 text-blue-400">
                  {booking.type}
                </span>
              }
              icon={<Aperture className="w-4 h-4" />}
              highlight={isFieldChanged('type')}
            />
            <InfoRow
              label="SOW"
              value={
                <span className="px-2 py-0.5 rounded bg-brand-purple/20 text-purple-400">
                  {booking.sow}
                </span>
              }
              icon={<Camera className="w-4 h-4" />}
              highlight={isFieldChanged('sow')}
            />
            <InfoRow
              label="Nền tảng"
              value={
                <div className="flex flex-wrap gap-1.5">
                  {booking.platforms.map((platform) => (
                    <Badge key={platform} variant="default">{platform}</Badge>
                  ))}
                </div>
              }
              highlight={isFieldChanged('platforms')}
            />
          </div>

          {/* SECTION 2: Lịch trình */}
          <div className="p-4 bg-brand-elevated rounded-lg">
            <SectionTitle icon={<Calendar className="w-4 h-4" />} title="Lịch trình" />
            <InfoRow
              label="Ngày quay"
              value={formatDate(booking.date)}
              icon={<Calendar className="w-4 h-4" />}
              highlight={isFieldChanged('date')}
            />
            <InfoRow
              label="Giờ bắt đầu"
              value={booking.startTime}
              icon={<Clock className="w-4 h-4" />}
              highlight={isFieldChanged('startTime')}
            />
            <InfoRow
              label="Giờ kết thúc"
              value={booking.endTime}
              icon={<Clock className="w-4 h-4" />}
              highlight={isFieldChanged('endTime')}
            />
            <InfoRow
              label="Địa điểm"
              value={booking.location}
              icon={<MapPin className="w-4 h-4" />}
              highlight={isFieldChanged('location')}
            />
            {booking.notes && (
              <div
                className={cn(
                  'mt-3 pt-3 border-t border-brand-border rounded',
                  isFieldChanged('notes') && 'bg-orange-500/20 p-2 border-l-2 border-l-orange-500'
                )}
              >
                <p className="text-sm text-brand-text-secondary mb-1">Ghi chú:</p>
                <p className={cn('text-sm', isFieldChanged('notes') ? 'text-orange-300' : 'text-white')}>
                  {booking.notes}
                </p>
              </div>
            )}
          </div>

          {/* SECTION 3: Thiết bị - Chi tiết đầy đủ */}
          <div className="p-4 bg-brand-elevated rounded-lg">
            <SectionTitle icon={<CameraIcon className="w-4 h-4" />} title="Thiết bị" />
            <InfoRow
              label="Số Camera"
              value={<span className="text-brand-pink font-semibold">{booking.cameraCount} cái</span>}
              icon={<Camera className="w-4 h-4" />}
              highlight={isFieldChanged('cameraCount')}
            />
            <InfoRow
              label="Số Microphone"
              value={<span className="text-brand-pink font-semibold">{booking.micCount} cái</span>}
              icon={<Mic className="w-4 h-4" />}
              highlight={isFieldChanged('micCount')}
            />

            {/* Thiết bị bổ sung với toggle hiển thị */}
            <div className="mt-4">
              <p className="text-sm text-brand-text-secondary mb-3">Thiết bị bổ sung:</p>
              <div className="grid grid-cols-2 gap-3">
                <div className={isFieldChanged('hasTikTokCamera') ? 'ring-2 ring-orange-500 rounded-lg' : ''}>
                  <EquipmentItem
                    icon={<Smartphone className="w-4 h-4" />}
                    label="Camera 9:16 TikTok"
                    enabled={booking.hasTikTokCamera}
                  />
                </div>
                <div className={isFieldChanged('hasActionCam') ? 'ring-2 ring-orange-500 rounded-lg' : ''}>
                  <EquipmentItem
                    icon={<CameraIcon className="w-4 h-4" />}
                    label="Action Cam"
                    enabled={booking.hasActionCam}
                  />
                </div>
                <div className={isFieldChanged('hasGimbal') ? 'ring-2 ring-orange-500 rounded-lg' : ''}>
                  <EquipmentItem
                    icon={<Move3D className="w-4 h-4" />}
                    label="Gimbal"
                    enabled={booking.hasGimbal}
                  />
                </div>
                <div className={isFieldChanged('hasHandheldLight') ? 'ring-2 ring-orange-500 rounded-lg' : ''}>
                  <EquipmentItem
                    icon={<Lightbulb className="w-4 h-4" />}
                    label="Đèn cầm tay"
                    enabled={booking.hasHandheldLight}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Cameraman */}
          <div className="p-4 bg-brand-elevated rounded-lg">
            <SectionTitle icon={<Users className="w-4 h-4" />} title="Cameraman được phân công" />

            {/* Hiển thị cameraman đã assign */}
            {booking.assignedCameramen.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {booking.assignedCameramen.map((name, idx) => (
                  <Badge key={name} variant="approved">
                    {idx + 1}. {name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Dropdown phân công cameraman (chỉ khi manager && approved) */}
            {canAssignCameraman && (
              <div className="border-t border-brand-border pt-4">
                {!showCameramanDropdown ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedCameramen(booking.assignedCameramen)
                      setShowCameramanDropdown(true)
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Phân công Cameraman
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-brand-text-secondary">Chọn Cameraman (màu chìm = đã có lịch trùng):</p>
                    <div className="flex flex-wrap gap-2">
                      {CAMERAMEN_LIST.map((name) => {
                        const conflict = getCameramanConflict(name)
                        const isDisabled = !!conflict && !selectedCameramen.includes(name)
                        return (
                          <button
                            key={name}
                            onClick={() => handleToggleCameramanWithConflict(name)}
                            disabled={!!isDisabled}
                            className={cn(
                              'relative px-3 py-1.5 rounded-lg border text-sm font-medium transition-all',
                              selectedCameramen.includes(name)
                                ? 'bg-brand-pink/20 border-brand-pink text-white'
                                : isDisabled
                                ? 'bg-brand-dark/50 border-brand-border text-brand-text-secondary/40 cursor-not-allowed'
                                : 'bg-brand-dark border-brand-border text-brand-text-secondary hover:border-brand-pink/50'
                            )}
                          >
                            <span className={cn(isDisabled && 'line-through opacity-50')}>{name}</span>
                            {conflict && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-[10px] text-white flex items-center justify-center" title={`Trùng: ${conflict}`}>
                                !
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAssignCameraman}
                        disabled={selectedCameramen.length === 0}
                      >
                        Cập nhật
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCameramanDropdown(false)}
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Thông báo chưa có cameraman */}
            {booking.assignedCameramen.length === 0 && !canAssignCameraman && (
              <p className="text-sm text-brand-text-secondary italic">
                Chưa có cameraman được phân công
              </p>
            )}
          </div>

          {/* Meta */}
          <div className="text-xs text-brand-text-secondary border-t border-brand-border pt-4 space-y-1">
            <p>Tạo bởi: <span className="text-white">{booking.createdByName}</span></p>
            <p>Tạo lúc: <span className="text-white">{formatDate(booking.createdAt.split('T')[0])} {booking.createdAt.split('T')[1]?.substring(0, 5) || ''}</span></p>
            {booking.updatedAt !== booking.createdAt && (
              <p>Cập nhật lúc: <span className="text-white">{formatDate(booking.updatedAt.split('T')[0])} {booking.updatedAt.split('T')[1]?.substring(0, 5) || ''}</span></p>
            )}
          </div>

          {/* Changed fields note - shown when booking is modified */}
          {booking.isModified && booking.changedFields && booking.changedFields.length > 0 && (
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-sm font-medium text-orange-400 mb-2">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Các thay đổi đã thực hiện:
              </p>
              <ul className="text-sm text-white space-y-1">
                {booking.changedFields.map((field) => (
                  <li key={field}>• {field}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-brand-border">
            {booking.isModified && (isManager || isContentTeam) && (
              <Button variant="success" onClick={handleConfirm}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Xác nhận thay đổi
              </Button>
            )}
            {canApprove && (
              <Button variant="success" onClick={handleApprove}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Duyệt
              </Button>
            )}
            {canReject && (
              <Button variant="danger" onClick={handleReject}>
                <XCircle className="w-4 h-4 mr-1" />
                Từ chối
              </Button>
            )}
            {canEdit && (
              <Button variant="secondary" onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-1" />
                Sửa
              </Button>
            )}
            {canDelete && (
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 className="w-4 h-4 mr-1" />
                Xóa
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Xác nhận xóa"
        size="sm"
      >
        <p className="text-brand-text-secondary mb-6">
          Bạn có chắc chắn muốn xóa booking "{booking.contentName}"? Hành động này không thể hoàn tác.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Xóa
          </Button>
        </div>
      </Modal>
    </>
  )
}

// Component con hiển thị thiết bị có icon on/off rõ ràng
function EquipmentItem({ icon, label, enabled }: { icon: React.ReactNode; label: string; enabled: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 p-3 rounded-lg border transition-all',
        enabled
          ? 'bg-brand-pink/20 border-brand-pink/50 text-white'
          : 'bg-brand-dark border-brand-border text-brand-text-secondary'
      )}
    >
      <div className="flex items-center gap-2">
        <span className={cn(enabled ? 'text-brand-pink' : 'text-brand-text-secondary')}>{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {/* Status indicator thay cho toggle */}
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            'px-2 py-0.5 rounded-full text-xs font-bold',
            enabled ? 'bg-brand-pink text-white' : 'bg-brand-border text-brand-text-secondary'
          )}
        >
          {enabled ? 'YES' : 'NO'}
        </span>
      </div>
    </div>
  )
}
