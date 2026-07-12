'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { ChecklistModal } from '@/components/checklist'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Camera, Mic, ClipboardList } from 'lucide-react'
import { isRecording, formatDate } from '@/lib/utils'

export default function ChecklistPage() {
  const user = useStore((state) => state.user)
  const bookings = useStore((state) => state.bookings)

  const [showChecklist, setShowChecklist] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)

  const assignedBookings = user?.role === 'cameraman'
    ? bookings.filter((b) => b.assignedCameramen.includes(user.name) && b.status === 'approved')
    : []

  const todayBookings = assignedBookings.filter((b) => {
    const today = new Date().toISOString().split('T')[0]
    return b.date === today && isRecording(b)
  })

  const upcomingBookings = assignedBookings.filter((b) => {
    const today = new Date().toISOString().split('T')[0]
    return b.date >= today
  }).filter(b => !todayBookings.find(t => t.id === b.id))

  const pastBookings = assignedBookings.filter((b) => {
    const today = new Date().toISOString().split('T')[0]
    return b.date < today
  })

  const handleOpenChecklist = (bookingId: string) => {
    setSelectedBookingId(bookingId)
    setShowChecklist(true)
  }

  if (user?.role !== 'cameraman') {
    return (
      <div className="text-center py-12">
        <ClipboardList className="w-16 h-16 text-brand-text-secondary mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Trang Checklist</h2>
        <p className="text-brand-text-secondary">
          Trang này chỉ dành cho Cameraman để thực hiện checklist thiết bị
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold font-display text-white">Checklist Thiết bị</h2>

      {todayBookings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-red-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            ĐANG QUAY
          </h3>
          {todayBookings.map((booking) => (
            <Card key={booking.id} className="border-l-4 border-l-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{booking.contentName}</p>
                  <p className="text-sm text-brand-text-secondary">
                    {booking.startTime} - {booking.endTime}
                  </p>
                </div>
                <Button variant="primary" onClick={() => handleOpenChecklist(booking.id)}>
                  Mở Checklist
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {upcomingBookings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-brand-text-secondary">Sắp tới</h3>
          <div className="grid gap-3">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id} hover onClick={() => handleOpenChecklist(booking.id)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{booking.contentName}</p>
                    <p className="text-sm text-brand-text-secondary">
                      {formatDate(booking.date)} • {booking.startTime} - {booking.endTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-brand-text-secondary">
                      <Camera className="w-4 h-4" />
                      <span>{booking.cameraCount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-brand-text-secondary">
                      <Mic className="w-4 h-4" />
                      <span>{booking.micCount}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pastBookings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-brand-text-secondary">Đã hoàn thành</h3>
          <div className="grid gap-3">
            {pastBookings.map((booking) => (
              <Card key={booking.id} className="opacity-75">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{booking.contentName}</p>
                    <p className="text-sm text-brand-text-secondary">
                      {formatDate(booking.date)}
                    </p>
                  </div>
                  <Badge variant="approved">Hoàn thành</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {assignedBookings.length === 0 && (
        <div className="text-center py-12">
          <ClipboardList className="w-16 h-16 text-brand-text-secondary mx-auto mb-4" />
          <p className="text-brand-text-secondary">Bạn chưa có booking nào được phân công</p>
        </div>
      )}

      <ChecklistModal
        isOpen={showChecklist}
        onClose={() => setShowChecklist(false)}
        bookingId={selectedBookingId || ''}
      />
    </div>
  )
}