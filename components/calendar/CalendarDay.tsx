'use client'

import { format, isToday } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Booking } from '@/lib/types'
import { getStatusConfig, isRecording } from '@/lib/utils'

interface CalendarDayProps {
  date: Date
  bookings: Booking[]
  onBookingClick: (booking: Booking) => void
}

export default function CalendarDay({ date, bookings, onBookingClick }: CalendarDayProps) {
  const isTodayDate = isToday(date)
  const isWeekend = date.getDay() === 0 || date.getDay() === 6

  return (
    <div
      className={cn(
        'rounded-lg p-2 min-h-[120px] transition-colors',
        isTodayDate
          ? 'bg-brand-pink/10 border border-brand-pink/30'
          : 'bg-brand-surface border border-brand-border',
        isWeekend && 'opacity-75'
      )}
    >
      {/* Day Header */}
      <div className="text-center mb-2">
        <p
          className={cn(
            'text-xs font-medium',
            isTodayDate ? 'text-brand-pink' : 'text-brand-text-secondary'
          )}
        >
          {format(date, 'EEE', { locale: vi })}
        </p>
        <p
          className={cn(
            'text-lg font-bold',
            isTodayDate ? 'text-brand-pink' : 'text-white'
          )}
        >
          {format(date, 'd')}
        </p>
      </div>

      {/* Bookings */}
      <div className="space-y-1">
        {bookings.slice(0, 3).map((booking) => {
          const config = getStatusConfig(booking)
          const recording = isRecording(booking)

          return (
            <button
              key={booking.id}
              onClick={() => onBookingClick(booking)}
              className={cn(
                'w-full text-left px-2 py-1 rounded text-xs truncate transition-all hover:opacity-80',
                config.boxBg,
                recording && 'ring-1 ring-red-500'
              )}
            >
              <div className="flex items-center gap-1">
                {recording && (
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full recording-dot flex-shrink-0" />
                )}
                <span className="truncate text-white">{booking.startTime}</span>
              </div>
              <p className="truncate text-brand-text-secondary">{booking.contentName}</p>
            </button>
          )
        })}
        {bookings.length > 3 && (
          <p className="text-xs text-brand-text-secondary text-center">
            +{bookings.length - 3} more
          </p>
        )}
      </div>
    </div>
  )
}
