'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Video, Clock, CheckCircle, AlertCircle, Plus, Calendar, History, ListChecks } from 'lucide-react'
import { useStore } from '@/lib/store'
import { BookingList } from '@/components/booking'
import { BookingDetail, BookingForm, CameramanSelector } from '@/components/booking'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Booking } from '@/lib/types'
import { isRecording, cn, getCurrentDateStr } from '@/lib/utils'

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
  const isCameraman = user?.role === 'cameraman'
  const isContentTeam = user?.role === 'content_team' || user?.role === 'producer'
  const today = getCurrentDateStr()

  // Stats - only for manager/content_team
  const totalBookings = bookings.length
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length
  const approvedBookings = bookings.filter((b) => b.status === 'approved').length
  const recordingNow = bookings.filter((b) => isRecording(b)).length

  // Pending bookings for manager to approve
  const pendingForApproval = isManager
    ? bookings.filter((b) => b.status === 'pending')
    : []

  // Cameraman view: my upcoming & my history
  const myBookings = useMemo(() => {
    if (!isCameraman || !user) return { upcoming: [], history: [] }
    const mine = bookings.filter((b) => b.assignedCameramen.includes(user.name))
    const upcoming = mine.filter((b) => b.date >= today).sort((a, b) =>
      (a.date + a.startTime).localeCompare(b.date + b.startTime)
    )
    const history = mine.filter((b) => b.date < today).sort((a, b) =>
      (b.date + b.startTime).localeCompare(a.date + a.startTime)
    )
    return { upcoming, history }
  }, [bookings, isCameraman, user, today])

  const handleApproveClick = (booking: Booking) => {
    setSelectedBooking(booking)
    setAssignedCameramen(booking.assignedCameramen || [])
    setShowApproveModal(true)
  }

  const handleApprove = () => {
    if (!selectedBooking) return

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

  // ============ CAMERAMAN VIEW ============
  if (isCameraman) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-semibold font-display text-white">
          Xin chào, {user?.name}
        </h2>

        {/* Upcoming bookings */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ListChecks className="w-5 h-5 text-brand-pink" />
            <h3 className="font-semibold text-white">
              Lịch được phân công ({myBookings.upcoming.length})
            </h3>
          </div>
          {myBookings.upcoming.length === 0 ? (
            <div className="text-center py-8 bg-brand-surface border border-brand-border rounded-xl">
              <p className="text-brand-text-secondary">Bạn chưa có lịch nào được phân công</p>
            </div>
          ) : (
            <BookingList bookings={myBookings.upcoming} showCreateButton={false} />
          )}
        </div>

        {/* History */}
        {myBookings.history.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <History className="w-5 h-5 text-brand-text-secondary" />
              <h3 className="font-semibold text-white">
                Lịch sử các buổi đã quay ({myBookings.history.length})
              </h3>
            </div>
            <BookingList bookings={myBookings.history} showCreateButton={false} />
          </div>
        )}

        <BookingDetail
          booking={selectedBooking}
          isOpen={showDetail}
          onClose={() => {
            setShowDetail(false)
            setSelectedBooking(null)
          }}
          onEdit={() => {}}
        />
      </div>
    )
  }

  // ============ MANAGER / CONTENT TEAM VIEW ============
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

      {/* Approve Modal - full booking details */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Duyệt Booking"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-4">
            {/* Full booking details */}
            <div className="p-4 bg-brand-elevated rounded-lg space-y-3">
              <h3 className="font-semibold text-white text-lg">{selectedBooking.contentName}</h3>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="text-brand-text-secondary">MC:</div>
                <div className="text-white">{selectedBooking.mcName === 'Brand' ? selectedBooking.brandName : selectedBooking.mcName}</div>

                <div className="text-brand-text-secondary">Loại content:</div>
                <div className="text-white">{selectedBooking.type}</div>

                <div className="text-brand-text-secondary">SOW:</div>
                <div className="text-white">{selectedBooking.sow}</div>

                <div className="text-brand-text-secondary">Nền tảng:</div>
                <div className="text-white">{selectedBooking.platforms.join(', ')}</div>

                <div className="text-brand-text-secondary">Ngày:</div>
                <div className="text-white">{selectedBooking.date}</div>

                <div className="text-brand-text-secondary">Giờ:</div>
                <div className="text-white">{selectedBooking.startTime} - {selectedBooking.endTime}</div>

                <div className="text-brand-text-secondary">Địa điểm:</div>
                <div className="text-white">{selectedBooking.location}</div>

                <div className="text-brand-text-secondary">Camera:</div>
                <div className="text-white">{selectedBooking.cameraCount}</div>

                <div className="text-brand-text-secondary">Micro:</div>
                <div className="text-white">{selectedBooking.micCount}</div>

                {selectedBooking.hasTikTokCamera && (
                  <>
                    <div className="text-brand-text-secondary">Thiết bị:</div>
                    <div className="text-white">Camera 9:16 TikTok</div>
                  </>
                )}
                {selectedBooking.hasActionCam && (
                  <>
                    <div className="text-brand-text-secondary">Thiết bị:</div>
                    <div className="text-white">Action Cam</div>
                  </>
                )}
                {selectedBooking.hasGimbal && (
                  <>
                    <div className="text-brand-text-secondary">Thiết bị:</div>
                    <div className="text-white">Gimbal</div>
                  </>
                )}
                {selectedBooking.hasHandheldLight && (
                  <>
                    <div className="text-brand-text-secondary">Thiết bị:</div>
                    <div className="text-white">Đèn cầm tay</div>
                  </>
                )}

                {selectedBooking.notes && (
                  <>
                    <div className="text-brand-text-secondary">Ghi chú:</div>
                    <div className="text-white">{selectedBooking.notes}</div>
                  </>
                )}

                <div className="text-brand-text-secondary">Người tạo:</div>
                <div className="text-white">{selectedBooking.createdByName}</div>
              </div>
            </div>

            <div className="border-t border-brand-border pt-4">
              <CameramanSelector
                selectedCameramen={assignedCameramen}
                onChange={setAssignedCameramen}
                requiredCount={0}
                bookingDate={selectedBooking.date}
                bookingStartTime={selectedBooking.startTime}
                bookingEndTime={selectedBooking.endTime}
                excludeBookingId={selectedBooking.id}
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-brand-border">
              <Button variant="ghost" onClick={() => setShowApproveModal(false)}>
                Hủy
              </Button>
              <Button variant="success" onClick={handleApprove}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Duyệt
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}