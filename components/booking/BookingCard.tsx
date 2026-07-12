'use client'

import { Video, MapPin, Clock, Users, Mic, Camera } from 'lucide-react'
import { Booking } from '@/lib/types'
import { cn, formatDate, getStatusConfig, isRecording } from '@/lib/utils'
import Badge from '../ui/Badge'

interface BookingCardProps {
  booking: Booking
  onClick?: () => void
  compact?: boolean
}

export default function BookingCard({ booking, onClick, compact = false }: BookingCardProps) {
  const config = getStatusConfig(booking)
  const recording = isRecording(booking)

  const statusVariant = booking.isModified
    ? 'modified'
    : recording
    ? 'recording'
    : booking.status === 'approved'
    ? 'approved'
    : booking.status === 'pending'
    ? 'pending'
    : 'rejected'

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-brand-surface border border-brand-border rounded-xl transition-all duration-200 cursor-pointer',
        'hover:bg-brand-elevated hover:border-brand-pink/30 hover:shadow-lg hover:shadow-brand-pink/5',
        config.bg,
        'border-l-4'
      )}
    >
      <div className={cn('p-4', config.boxBg)}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{booking.contentName}</h3>
            <p className="text-sm text-brand-text-secondary mt-0.5">
              {booking.mcName === 'Brand' ? booking.brandName : booking.mcName}
            </p>
          </div>
          <Badge variant={statusVariant} showDot>
            {config.label}
          </Badge>
        </div>

        {/* Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
            <Video className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{booking.sow} • {booking.type}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{formatDate(booking.date)} • {booking.startTime} - {booking.endTime}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{booking.location}</span>
          </div>

          {!compact && (
            <div className="flex items-center gap-4 pt-2 border-t border-brand-border/50">
              <div className="flex items-center gap-1.5 text-sm text-brand-text-secondary">
                <Camera className="w-4 h-4" />
                <span>{booking.cameraCount}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-brand-text-secondary">
                <Mic className="w-4 h-4" />
                <span>{booking.micCount}</span>
              </div>
              {booking.assignedCameramen.length > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-brand-text-secondary">
                  <Users className="w-4 h-4" />
                  <span>{booking.assignedCameramen.length}</span>
                </div>
              )}
            </div>
          )}

          {/* Platforms */}
          {!compact && booking.platforms.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {booking.platforms.map((platform) => (
                <span
                  key={platform}
                  className="px-2 py-0.5 bg-brand-elevated rounded text-xs text-brand-text-secondary"
                >
                  {platform}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
