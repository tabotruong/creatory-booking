'use client'

import { useMemo, useState } from 'react'
import { useStore } from '@/lib/store'
import { format, isWithinInterval, subMonths } from 'date-fns'
import { vi } from 'date-fns/locale'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatDate, cn } from '@/lib/utils'
import { CAMERAMEN_LIST } from '@/lib/constants'
import { ChevronLeft, ChevronRight, Wallet, Calendar } from 'lucide-react'

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
  if (m >= 16 && m <= 40) return `${h}:30`
  if (m >= 41 && m <= 59) return `${h + 1}:00`
  return `${h}:00`
}

function roundCheckOut(time: string): string {
  const [h, m] = time.split(':').map(Number)
  if (m >= 15 && m <= 39) return `${h}:30`
  if (m >= 40 && m <= 59) return `${h + 1}:00`
  return `${h}:00`
}

function calculateHours(checkIn: string, checkOut: string): number {
  const roundedIn = roundCheckIn(checkIn)
  const roundedOut = roundCheckOut(checkOut)
  const [inH, inM] = roundedIn.split(':').map(Number)
  const [outH, outM] = roundedOut.split(':').map(Number)
  const totalMinutes = (outH * 60 + outM) - (inH * 60 + inM)
  return totalMinutes / 60
}

function calculatePay(hours: number): number {
  if (hours < 4) return 500000
  const extraHours = Math.floor(hours) - 4
  return 500000 + (extraHours * 100000)
}

// Get billing period for a given salary month (1-12)
// 21/6 - 20/7 = salary for July
function getBillingPeriod(year: number, salaryMonth: number) {
  const startDate = new Date(year, salaryMonth - 2, 21) // 21st of previous month
  const endDate = new Date(year, salaryMonth - 1, 20) // 20th of salary month
  return { startDate, endDate }
}

export default function IncomePage() {
  const user = useStore((state) => state.user)
  const bookings = useStore((state) => state.bookings)

  // Default to current month for billing period
  const today = new Date()
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1) // 1-12
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())

  const billingPeriod = useMemo(() => {
    return getBillingPeriod(selectedYear, selectedMonth)
  }, [selectedYear, selectedMonth])

  // Available months (last 12 months)
  const availablePeriods = useMemo(() => {
    const periods = []
    for (let i = 0; i < 12; i++) {
      const d = subMonths(today, i)
      periods.push({
        month: d.getMonth() + 1,
        year: d.getFullYear(),
        label: format(d, 'MM/yyyy', { locale: vi }),
      })
    }
    return periods
  }, [])

  // Get cameraman's work sessions within billing period
  const workSessions = useMemo(() => {
    if (!user) return []
    return bookings
      .filter(b => {
        if (!b.assignedCameramen.includes(user.name)) return false
        if (b.status !== 'approved') return false
        const bookingDate = new Date(b.date)
        return isWithinInterval(bookingDate, { start: billingPeriod.startDate, end: billingPeriod.endDate })
      })
      .map(b => {
        const hours = calculateHours(b.startTime, b.endTime)
        return {
          bookingId: b.id,
          contentName: b.contentName,
          date: b.date,
          checkIn: b.startTime,
          checkOut: b.endTime,
          hours: Math.round(hours * 10) / 10,
          pay: calculatePay(hours),
        }
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [user, bookings, billingPeriod])

  // Get all cameraman's income summary for manager (exclude Tabo)
  const allCameramenIncome = useMemo(() => {
    return CAMERAMEN_LIST
      .filter(name => name !== 'Tabo') // Exclude Tabo from team income
      .map(name => {
        const sessions = bookings
          .filter(b => {
            if (!b.assignedCameramen.includes(name)) return false
            if (b.status !== 'approved') return false
            const bookingDate = new Date(b.date)
            return isWithinInterval(bookingDate, { start: billingPeriod.startDate, end: billingPeriod.endDate })
          })
          .map(b => calculatePay(calculateHours(b.startTime, b.endTime)))
        const total = sessions.reduce((sum, p) => sum + p, 0)
        return { name, total, count: sessions.length }
      })
  }, [bookings, billingPeriod])

  const totalIncome = workSessions.reduce((sum, s) => sum + s.pay, 0)
  const totalHours = workSessions.reduce((sum, s) => sum + s.hours, 0)
  const totalTeamSalary = allCameramenIncome.reduce((sum, c) => sum + c.total, 0)
  const isManager = user?.role === 'manager'
  const isCameraman = user?.role === 'cameraman'

  if (!isCameraman && !isManager) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white mb-2">Thu nhập</h2>
        <p className="text-brand-text-secondary">Trang này chỉ dành cho Cameraman và Quản lý</p>
      </div>
    )
  }

  const changePeriod = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 1) {
        setSelectedMonth(12)
        setSelectedYear(selectedYear - 1)
      } else {
        setSelectedMonth(selectedMonth - 1)
      }
    } else {
      if (selectedMonth === 12) {
        setSelectedMonth(1)
        setSelectedYear(selectedYear + 1)
      } else {
        setSelectedMonth(selectedMonth + 1)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold font-display text-white">
          <Wallet className="w-5 h-5 inline mr-2 text-brand-pink" />
          {isManager ? 'Bảng lương Cameraman' : 'Thu nhập của tôi'}
        </h2>

        {/* Month selector for both cameraman and manager */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => changePeriod('prev')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-white font-medium min-w-[80px] text-center">
            {format(new Date(selectedYear, selectedMonth - 1), 'MM/yyyy', { locale: vi })}
          </span>
          <Button variant="ghost" size="sm" onClick={() => changePeriod('next')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Billing Period Info */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-text-secondary" />
          <p className="text-sm text-brand-text-secondary">Kỳ tính lương:</p>
          <p className="text-white font-medium">
            {format(billingPeriod.startDate, 'dd/MM/yyyy')} - {format(billingPeriod.endDate, 'dd/MM/yyyy')}
          </p>
          <span className="text-brand-pink text-sm font-medium">
            (Lương tháng {format(new Date(selectedYear, selectedMonth - 1), 'MM/yyyy', { locale: vi })})
          </span>
        </div>
      </div>

      {/* Summary Cards - only for cameraman (manager doesn't see own income) */}
      {!isManager && (
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
      )}

      {/* Payment Rules - only for cameraman */}
      {!isManager && (
        <Card>
          <h3 className="font-medium text-white mb-3">Cách tính lương</h3>
          <div className="space-y-2 text-sm text-brand-text-secondary">
            <p>• Dưới 4 giờ: <span className="text-white">500,000đ</span></p>
            <p>• Từ giờ thứ 5 trở đi: <span className="text-white">+100,000đ/giờ</span></p>
            <p className="text-xs mt-3 border-t border-brand-border pt-2">
              Check-in: 6:00-6:15 → 6:00 | 6:16-6:40 → 6:30 | 6:41-6:59 → 7:00<br />
              Check-out: 6:00-6:14 → 6:00 | 6:15-6:39 → 6:30 | 6:40-6:59 → 7:00
            </p>
          </div>
        </Card>
      )}

      {/* Team Income Overview - only for manager */}
      {isManager && (
        <>
          <Card>
            <h3 className="font-medium text-white mb-3">
              Bảng lương team ({format(new Date(selectedYear, selectedMonth - 1), 'MM/yyyy', { locale: vi })})
            </h3>
            <div className="space-y-2">
              {allCameramenIncome
                .filter(c => c.count > 0)
                .sort((a, b) => b.total - a.total)
                .map(c => (
                  <div
                    key={c.name}
                    className={cn(
                      'flex items-center justify-between p-3 rounded',
                      // No highlight since Tabo excluded
                      'bg-brand-elevated'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white font-medium">{c.name}</span>
                      <span className="text-xs text-brand-text-secondary">({c.count} buổi)</span>
                    </div>
                    <span className="text-sm font-bold text-white">
                      {c.total.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                ))}
              {allCameramenIncome.filter(c => c.count > 0).length === 0 && (
                <p className="text-sm text-brand-text-secondary text-center py-4">
                  Không có dữ liệu trong kỳ này
                </p>
              )}
            </div>
          </Card>

          {/* Total Team Salary */}
          {allCameramenIncome.filter(c => c.count > 0).length > 0 && (
            <Card className="border-2 border-brand-pink/30">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Tổng lương phải trả team</span>
                <span className="text-2xl font-bold text-brand-pink">
                  {totalTeamSalary.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Sessions List - only for cameraman */}
      {!isManager && (workSessions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-brand-text-secondary">Chưa có lịch quay nào trong kỳ này</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="font-medium text-white">Lịch sử buổi quay ({workSessions.length})</h3>
          {workSessions.map((session) => (
            <Card key={session.bookingId}>
              <div className="flex items-start justify-between gap-4">
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
              </div>
            </Card>
          ))}
        </div>
      ))}
    </div>
  )
}
