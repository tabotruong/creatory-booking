'use client'

import { useMemo } from 'react'
import { useStore } from '@/lib/store'
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { vi } from 'date-fns/locale'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

interface WorkSession {
  bookingId: string
  contentName: string
  date: string
  checkIn: string
  checkOut: string
  hours: number
  pay: number
}

// Round time according to rules
function roundCheckIn(time: string): string {
  const [h, m] = time.split(':').map(Number)
  if (m >= 16 && m <= 30) return `${h}:30`
  return `${h}:00`
}

function roundCheckOut(time: string): string {
  const [h, m] = time.split(':').map(Number)
  if (m >= 40 && m <= 59) return `${h + 1}:00`
  if (m >= 15 && m <= 39) return `${h}:30`
  return `${h}:00`
}

// Calculate hours between check-in and check-out
function calculateHours(checkIn: string, checkOut: string): number {
  const roundedIn = roundCheckIn(checkIn)
  const roundedOut = roundCheckOut(checkOut)

  const [inH, inM] = roundedIn.split(':').map(Number)
  const [outH, outM] = roundedOut.split(':').map(Number)

  const totalMinutes = (outH * 60 + outM) - (inH * 60 + inM)
  return totalMinutes / 60
}

// Calculate pay based on hours
function calculatePay(hours: number): number {
  if (hours < 4) return 500000
  const extraHours = Math.floor(hours) - 4
  return 500000 + (extraHours * 100000)
}

export default function IncomePage() {
  const user = useStore((state) => state.user)
  const bookings = useStore((state) => state.bookings)

  // Calculate billing period: 21st of previous month to 20th of current month
  const billingPeriod = useMemo(() => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    const startDate = new Date(currentYear, currentMonth - 1, 21)
    const endDate = new Date(currentYear, currentMonth, 20)

    return { startDate, endDate }
  }, [])

  // Get cameraman's work sessions within billing period
  const workSessions = useMemo(() => {
    if (user?.role !== 'cameraman') return []

    return bookings
      .filter(b => {
        if (!b.assignedCameramen.includes(user.name)) return false
        if (b.status !== 'approved') return false

        const bookingDate = new Date(b.date)
        return isWithinInterval(bookingDate, {
          start: billingPeriod.startDate,
          end: billingPeriod.endDate
        })
      })
      .map(b => {
        // Simulate check-in/out based on booking time for demo
        const checkIn = b.startTime
        const checkOut = b.endTime
        const hours = calculateHours(checkIn, checkOut)
        const pay = calculatePay(hours)

        return {
          bookingId: b.id,
          contentName: b.contentName,
          date: b.date,
          checkIn,
          checkOut,
          hours: Math.round(hours * 10) / 10,
          pay
        }
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [user, bookings, billingPeriod])

  const totalIncome = workSessions.reduce((sum, s) => sum + s.pay, 0)
  const totalHours = workSessions.reduce((sum, s) => sum + s.hours, 0)

  if (user?.role !== 'cameraman') {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white mb-2">Thu nhập</h2>
        <p className="text-brand-text-secondary">
          Trang này chỉ dành cho Cameraman
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold font-display text-white">Thu nhập</h2>

      {/* Billing Period Info */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-4">
        <p className="text-sm text-brand-text-secondary mb-1">Kỳ tính lương</p>
        <p className="text-white font-medium">
          {format(billingPeriod.startDate, 'dd/MM/yyyy')} - {format(billingPeriod.endDate, 'dd/MM/yyyy')}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center">
          <p className="text-sm text-brand-text-secondary mb-2">Tổng thu nhập</p>
          <p className="text-2xl font-bold text-brand-pink">
            {totalIncome.toLocaleString('vi-VN')}đ
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-brand-text-secondary mb-2">Tổng giờ làm</p>
          <p className="text-2xl font-bold text-white">
            {Math.round(totalHours * 10) / 10}h
          </p>
        </Card>
      </div>

      {/* Payment Rules */}
      <Card>
        <h3 className="font-medium text-white mb-3">Cách tính lương</h3>
        <div className="space-y-2 text-sm text-brand-text-secondary">
          <p>• Dưới 4 giờ: <span className="text-white">500,000đ</span></p>
          <p>• Từ giờ thứ 5 trở đi: <span className="text-white">+100,000đ/giờ</span></p>
          <p className="text-xs mt-3 border-t border-brand-border pt-2">
            Check-in: 6:00-6:15 → 6:00 | 6:16-6:30 → 6:30<br/>
            Check-out: 6:00-6:14 → 6:00 | 6:15-6:39 → 6:30 | 6:40-6:59 → 7:00
          </p>
        </div>
      </Card>

      {/* Sessions List */}
      {workSessions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-brand-text-secondary">Chưa có lịch quay nào trong kỳ này</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="font-medium text-white">Lịch sử buổi quay ({workSessions.length})</h3>
          {workSessions.map((session) => (
            <Card key={session.bookingId} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">{session.contentName}</p>
                <p className="text-sm text-brand-text-secondary">
                  {formatDate(session.date)} • {session.checkIn} - {session.checkOut}
                </p>
                <p className="text-xs text-brand-text-secondary mt-1">
                  Làm tròn: {roundCheckIn(session.checkIn)} - {roundCheckOut(session.checkOut)} = {session.hours}h
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-brand-pink">
                  {session.pay.toLocaleString('vi-VN')}đ
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
