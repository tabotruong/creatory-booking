'use client'

import { useMemo, useState } from 'react'
import { useStore } from '@/lib/store'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { formatDate, cn } from '@/lib/utils'
import { CAMERAMEN_LIST } from '@/lib/constants'
import { Video, Camera, Users, Calendar } from 'lucide-react'

export default function CameramenPage() {
  const user = useStore((state) => state.user)
  const bookings = useStore((state) => state.bookings)

  const [selectedCameraman, setSelectedCameraman] = useState<string | null>(CAMERAMEN_LIST[0])

  if (user?.role !== 'manager') {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white mb-2">Lịch Cameraman</h2>
        <p className="text-brand-text-secondary">Trang này chỉ dành cho Quản lý</p>
      </div>
    )
  }

  // Get bookings for selected cameraman
  const cameramanBookings = useMemo(() => {
    if (!selectedCameraman) return []
    return bookings
      .filter(b => b.assignedCameramen.includes(selectedCameraman))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [bookings, selectedCameraman])

  // Get count for each cameraman
  const cameramanCounts = useMemo(() => {
    return CAMERAMEN_LIST.reduce((acc, name) => {
      acc[name] = bookings.filter(b =>
        b.assignedCameramen.includes(name) &&
        b.status === 'approved'
      ).length
      return acc
    }, {} as Record<string, number>)
  }, [bookings])

  return (
    <div className="flex gap-6">
      {/* Cameraman List - Left Panel */}
      <div className="w-64 flex-shrink-0">
        <h2 className="text-lg font-semibold font-display text-white mb-4">
          <Users className="w-5 h-5 inline mr-2 text-brand-pink" />
          Cameraman
        </h2>
        <div className="space-y-2">
          {CAMERAMEN_LIST.map((name) => (
            <button
              key={name}
              onClick={() => setSelectedCameraman(name)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all',
                selectedCameraman === name
                  ? 'bg-brand-pink/20 border border-brand-pink/50 text-white'
                  : 'bg-brand-surface border border-brand-border text-brand-text-secondary hover:bg-brand-elevated hover:text-white'
              )}
            >
              <span className="font-medium">{name}</span>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                selectedCameraman === name
                  ? 'bg-brand-pink text-white'
                  : 'bg-brand-elevated'
              )}>
                {cameramanCounts[name] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Cameraman Schedule - Right Panel */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-4">
          Lịch quay của {selectedCameraman}
        </h3>

        {cameramanBookings.length === 0 ? (
          <Card className="text-center py-12">
            <Camera className="w-12 h-12 text-brand-text-secondary mx-auto mb-4 opacity-50" />
            <p className="text-brand-text-secondary">
              {selectedCameraman} chưa có lịch quay nào được phân công
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {cameramanBookings.map((booking) => (
              <Card key={booking.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-white">{booking.contentName}</h4>
                      <Badge
                        variant={
                          booking.status === 'approved'
                            ? 'approved'
                            : booking.status === 'pending'
                            ? 'pending'
                            : 'rejected'
                        }
                      >
                        {booking.status === 'approved' ? 'Đã duyệt' : booking.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-brand-text-secondary">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(booking.date)}
                      </span>
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-brand-text-secondary flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        {booking.sow} • {booking.type}
                      </span>
                      <span className="text-xs text-brand-text-secondary">
                        • {booking.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-brand-text-secondary" />
                    <span className="text-white">{booking.cameraCount}</span>
                    <Users className="w-4 h-4 text-brand-text-secondary ml-2" />
                    <span className="text-white">{booking.assignedCameramen.length}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
