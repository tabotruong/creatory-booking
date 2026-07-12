'use client'

import { useMemo } from 'react'
import { useStore } from '@/lib/store'
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { vi } from 'date-fns/locale'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { CAMERAMEN_LIST } from '@/lib/constants'

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
// Check-in: 6:00-6:15 → 6:00 | 6:16-6:30 → 6:30 | 6:31-6:40 → 6:30 | 6:41-6:59 → 7:00
function roundCheckIn(time: string): string {
  const [h, m] = time.split(':').map(Number)
  if (m >= 16 && m <= 40) return `${h}:30`
  if (m >= 41 && m <= 59) return `${h + 1}:00`
  return `${h}:00`
}

// Check-out: 6:00-6:14 → 6:00 | 6:15-6:39 → 6:30 | 6:40-6:59 → 7:00
function roundCheckOut(time: string): string {
  const [h, m] = time.split(':').map(Number)
  if (m >= 15 && m <= 39) return `${h}:30`
  if (m >= 40 && m <= 59) return `${h + 1}:00`
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
    if (!user) return []

    const cameramanName = user.name

    return bookings
      .filter(b => {
        if (!b.assignedCameramen.includes(cameramanName)) return false
        if (b.status !== 'approved') return false

        const bookingDate = new Date(b.date)
        return isWithinInterval(bookingDate, {
          start: billingPeriod.startDate,
          end: billingPeriod.endDate
        })
      })
      .map(b => {
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

  // Get all cameraman's income summary
  const allCameramenIncome = useMemo(() => {
    return CAMERAMEN_LIST.map(name => {
      const sessions = bookings
        .filter(b => {
          if (!b.assignedCameramen.includes(name)) return false
          if (b.status !== 'approved') return false

          const bookingDate = new Date(b.date)
          return isWithinInterval(bookingDate, {
            start: billingPeriod.startDate,
            end: billingPeriod.endDate
          })
        })
        .map(b => {
          const hours = calculateHours(b.startTime, b.endTime)
          return calculatePay(hours)
        })

      const total = sessions.reduce((sum, p) => sum + p, 0)
      return { name, total, count: sessions.length }
    })
  }, [bookings, billingPeriod])

  const totalIncome = workSessions.reduce((sum, s) => sum + s.pay, 0)
  const totalHours = workSessions.reduce((sum, s) => sum + s.hours, 0)

  if (user?.role !== 'cameraman' && user?.role !== 'manager') {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white mb-2">Thu nhập</h2>
        <p className="text-brand-text-secondary">
          Trang này chỉ dành cho Cameraman và Quản lý
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold font-display text-white">
        {user?.role === 'manager' ? 'Bảng lương Cameraman' : 'Thu nhập của tôi'}
      </h2>

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
            Check-in: 6:00-6:15 → 6:00 | 6:16-6:40 → 6:30 | 6:41-6:59 → 7:00<br/>
            Check-out: 6:00-6:14 → 6:00 | 6:15-6:39 → 6:30 | 6:40-6:59 → 7:00
          </p>
        </div>
      </Card>

      {/* Team Income Overview */}
      <Card>
        <h3 className="font-medium text-white mb-3">Bảng lương team Cameraman (kỳ này)</h3>
        <div className="space-y-2">
          {allCameramenIncome.map(c => (
            <div
              key={c.name}
              className={`flex items-center justify-between p-2 rounded ${
                c.name === user.name ? 'bg-brand-pink/20 border border-brand-pink/30' : 'bg-brand-elevated'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-white font-medium">{c.name}</span>
                <span className="text-xs text-brand-text-secondary">({c.count} buổi)</span>
              </div>
              <span className={`text-sm font-bold ${c.name === user.name ? 'text-brand-pink' : 'text-white'}`}>
                {c.total.toLocaleString('vi-VN')}đ
              </span>
            </div>
          ))}
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
