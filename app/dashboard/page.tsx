'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Video, Clock, CheckCircle, AlertCircle, Plus, Calendar } from 'lucide-react'
import { useStore } from '@/lib/store'
import { BookingList } from '@/components/booking'
import { BookingDetail, BookingForm, CameramanSelector } from '@/components/booking'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Booking } from '@/lib/types'
import { isRecording, cn } from '@/lib/utils'

export default function DashboardPage() {
  const router = useRouter()
  const user = useStore((state) => state.user)
  const bookings = useStore((state) => state.bookings)

  const [showDetail, setShowDetail] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [assignedCameramen, setAssignedCameramen] = useState<string[]>([])

  const isManager = user?.role === 'manager'
  const isContentTeam = user?.role === 'content_team'

  // Stats
  const totalBookings = bookings.length
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length
  const approvedBookings = bookings.filter((b) => b.status === 'approved').length
  const recordingNow = bookings.filter((b) => isRecording(b)).length

  // Pending bookings for manager to approve
  const pendingForApproval = isManager
    ? bookings.filter((b) => b.status === 'pending')
    : []

  const handleApproveClick = (booking: Booking) => {
    setSelectedBooking(booking)
    setAssignedCameramen(booking.assignedCameramen || [])
    setShowApproveModal(true)
  }

  const handleApprove = () => {
    if (!selectedBooking) return

    if (assignedCameramen.length < selectedBooking.cameraCount) {
      return
    }

    const store = useStore.getState()
    store.updateBooking(selectedBooking.id, {
      assignedCameramen,
      status: 'approved',
    })

    setShowApproveModal(false)
    setSelectedBooking(null)
    setAssignedCameramen([])
  }

  const stats = [
    { label: 'Tổng booking', value: totalBookings, icon: Video, color: 'text-brand-pink' },
    { label: 'Chờ duyệt', value: pendingBookings, icon: Clock, color: 'text-brand-blue' },
    { label: 'Đã duyệt', value: approvedBookings, icon: CheckCircle, color: 'text-brand-green' },
    { label: 'Đang quay', value: recordingNow, icon: AlertCircle, color: 'text-red-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-brand-surface border border-brand-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={cn('w-5 h-5', stat.color)} />
            </div>
            <p className="text-2xl font-bold font-display text-white">{stat.value}</p>
            <p className="text-sm text-brand-text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Pending Approvals (Manager) */}
      {isManager && pendingForApproval.length > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
          <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            Cần duyệt ({pendingForApproval.length})
          </h3>
          <div className="space-y-2">
            {pendingForApproval.slice(0, 3).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between bg-brand-surface rounded-lg p-3"
              >
                <div>
                  <p className="font-medium text-white">{booking.contentName}</p>
                  <p className="text-sm text-brand-text-secondary">
                    {booking.date} • {booking.cameraCount} camera
                  </p>
                </div>
                <Button size="sm" onClick={() => handleApproveClick(booking)}>
                  Duyệt
                </Button>
              </div>
            ))}
          </div>
          {pendingForApproval.length > 3 && (
            <p className="text-sm text-brand-text-secondary mt-2">
              Và {pendingForApproval.length - 3} booking khác...
            </p>
          )}
        </div>
      )}

      {/* Quick Actions */}
      {(isManager || isContentTeam) && (
        <div className="flex gap-3">
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Tạo Booking
          </Button>
          <Button variant="secondary" onClick={() => router.push('/dashboard/calendar')}>
            <Calendar className="w-4 h-4 mr-1" />
            Xem lịch 2 tuần
          </Button>
        </div>
      )}

      {/* Recent Bookings */}
      <div>
        <h2 className="text-lg font-semibold font-display text-white mb-4">Booking gần đây</h2>
        <BookingList bookings={bookings} showCreateButton={false} />
      </div>

      {/* Modals */}
      <BookingForm isOpen={showForm} onClose={() => setShowForm(false)} />

      <BookingDetail
        booking={selectedBooking}
        isOpen={showDetail}
        onClose={() => {
          setShowDetail(false)
          setSelectedBooking(null)
        }}
        onEdit={(booking) => {
          setShowDetail(false)
          setSelectedBooking(booking)
          setShowForm(true)
        }}
      />

      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Phân công Cameraman"
        size="md"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="p-4 bg-brand-elevated rounded-lg">
              <h3 className="font-medium text-white">{selectedBooking.contentName}</h3>
              <p className="text-sm text-brand-text-secondary">
                {selectedBooking.mcName === 'Brand' ? selectedBooking.brandName : selectedBooking.mcName}
              </p>
              <p className="text-sm text-brand-text-secondary">
                {selectedBooking.date} • {selectedBooking.startTime} - {selectedBooking.endTime}
              </p>
            </div>

            <CameramanSelector
              selectedCameramen={assignedCameramen}
              onChange={setAssignedCameramen}
              requiredCount={selectedBooking.cameraCount}
            />

            <div className="flex gap-3 justify-end pt-4 border-t border-brand-border">
              <Button variant="ghost" onClick={() => setShowApproveModal(false)}>
                Hủy
              </Button>
              <Button
                variant="success"
                onClick={handleApprove}
                disabled={assignedCameramen.length < selectedBooking.cameraCount}
              >
                Duyệt & Phân công
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}