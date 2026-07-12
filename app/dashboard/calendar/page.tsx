'use client'

import { useState } from 'react'
import { CalendarGrid } from '@/components/calendar'
import { BookingDetail, BookingForm } from '@/components/booking'
import { Booking } from '@/lib/types'

export default function CalendarPage() {
  const [showDetail, setShowDetail] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowDetail(true)
  }

  return (
    <div>
      <h2 className="text-lg font-semibold font-display text-white mb-6">Lịch quay 2 tuần</h2>

      <CalendarGrid onBookingClick={handleBookingClick} />

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

      <BookingForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setSelectedBooking(null)
        }}
        editBooking={selectedBooking || undefined}
      />
    </div>
  )
}