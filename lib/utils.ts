import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parse, isToday, isSameDay, addDays, startOfWeek } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Booking } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, formatStr: string = 'dd/MM/yyyy'): string {
  const d = typeof date === 'string' ? parse(date, 'yyyy-MM-dd', new Date()) : date
  return format(d, formatStr, { locale: vi })
}

export function formatTime(time: string): string {
  return time
}

export function getCurrentTimeStr(): string {
  return format(new Date(), 'HH:mm')
}

export function getCurrentDateStr(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function getWeekDays(startDate: Date = new Date()): Date[] {
  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 }) // Monday
  return Array.from({ length: 14 }, (_, i) => addDays(weekStart, i))
}

export function isRecording(booking: Booking): boolean {
  if (booking.status !== 'approved') return false
  const today = getCurrentDateStr()
  if (booking.date !== today) return false
  const now = getCurrentTimeStr()
  return now >= booking.startTime && now <= booking.endTime
}

export function getStatusConfig(booking: Booking) {
  if (booking.isModified) {
    return {
      bg: 'border-l-orange-500',
      boxBg: 'bg-orange-500/20',
      badge: 'bg-orange-500/30 text-orange-300',
      label: 'CẦN XÁC NHẬN',
      dotColor: 'bg-orange-500',
    }
  }

  if (isRecording(booking)) {
    return {
      bg: 'border-l-red-500',
      boxBg: 'bg-red-500/20',
      badge: 'bg-red-500/30 text-red-300',
      label: 'ĐANG QUAY',
      dotColor: 'bg-red-500',
    }
  }

  switch (booking.status) {
    case 'approved':
      return {
        bg: 'border-l-green-500',
        boxBg: 'bg-green-500/10',
        badge: 'bg-green-500/20 text-green-400',
        label: 'Đã duyệt',
        dotColor: 'bg-green-500',
      }
    case 'pending':
      return {
        bg: 'border-l-blue-500',
        boxBg: 'bg-blue-500/10',
        badge: 'bg-blue-500/20 text-blue-400',
        label: 'Chờ duyệt',
        dotColor: 'bg-blue-500',
      }
    case 'rejected':
      return {
        bg: 'border-l-red-500',
        boxBg: 'bg-red-500/10',
        badge: 'bg-red-500/20 text-red-400',
        label: 'Từ chối',
        dotColor: 'bg-red-500',
      }
    default:
      return {
        bg: 'border-l-gray-500',
        boxBg: 'bg-gray-500/10',
        badge: 'bg-gray-500/20 text-gray-400',
        label: 'Unknown',
        dotColor: 'bg-gray-500',
      }
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function getDayName(date: Date): string {
  return format(date, 'EEE', { locale: vi })
}

export function getDayNumber(date: Date): string {
  return format(date, 'd')
}

export function getMonthName(date: Date): string {
  return format(date, 'MMMM', { locale: vi })
}

export function isDateToday(date: Date): boolean {
  return isToday(date)
}

export function sortBookingsByTime(bookings: Booking[]): Booking[] {
  return [...bookings].sort((a, b) => a.startTime.localeCompare(b.startTime))
}

export function filterBookingsForDate(bookings: Booking[], dateStr: string): Booking[] {
  return sortBookingsByTime(bookings.filter((b) => b.date === dateStr))
}
