'use client'

import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { addDays, format, startOfWeek, isToday } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useStore } from '@/lib/store'
import { Booking } from '@/lib/types'
import { cn, filterBookingsForDate, isRecording, getStatusConfig } from '@/lib/utils'
import CalendarDay from './CalendarDay'

interface CalendarGridProps {
  onBookingClick: (booking: Booking) => void
}

export default function CalendarGrid({ onBookingClick }: CalendarGridProps) {
  const bookings = useStore((state) => state.bookings)
  const currentWeekStart = useStore((state) => state.currentWeekStart)
  const goToNextWeek = useStore((state) => state.goToNextWeek)
  const goToPrevWeek = useStore((state) => state.goToPrevWeek)

  // Generate 14 days (2 weeks)
  const days = useMemo(() => {
    const weekStart = startOfWeek(currentWeekStart, { weekStartsOn: 1 })
    return Array.from({ length: 14 }, (_, i) => addDays(weekStart, i))
  }, [currentWeekStart])

  // Get bookings for a specific day
  const getBookingsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return filterBookingsForDate(bookings, dateStr)
  }

  // Calculate date range display
  const dateRangeLabel = `${format(days[0], 'd MMM', { locale: vi })} - ${format(days[13], 'd MMM yyyy', { locale: vi })}`

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold font-display text-white">{dateRangeLabel}</h2>
        <div className="flex gap-2">
          <button
            onClick={goToPrevWeek}
            className="p-2 rounded-lg hover:bg-brand-elevated transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-brand-text-secondary" />
          </button>
          <button
            onClick={goToNextWeek}
            className="p-2 rounded-lg hover:bg-brand-elevated transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-brand-text-secondary" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
        <div className="grid grid-cols-7 gap-2 min-w-[700px]">
          {days.map((day, index) => {
            const dayBookings = getBookingsForDay(day)
            const isTodayDate = isToday(day)
            const isWeekend = day.getDay() === 0 || day.getDay() === 6

            return (
              <div
                key={index}
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
                  <p className={cn(
                    'text-xs font-medium',
                    isTodayDate ? 'text-brand-pink' : 'text-brand-text-secondary'
                  )}>
                    {format(day, 'EEE', { locale: vi })}
                  </p>
                  <p className={cn(
                    'text-lg font-bold',
                    isTodayDate ? 'text-brand-pink' : 'text-white'
                  )}>
                    {format(day, 'd')}
                  </p>
                </div>

                {/* Bookings */}
                <div className="space-y-1">
                  {dayBookings.slice(0, 3).map((booking) => {
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
                  {dayBookings.length > 3 && (
                    <p className="text-xs text-brand-text-secondary text-center">
                      +{dayBookings.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
