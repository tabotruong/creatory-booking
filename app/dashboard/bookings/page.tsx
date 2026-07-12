'use client'

import { useState } from 'react'
import { BookingList } from '@/components/booking'
import { BookingDetail, BookingForm } from '@/components/booking'
import { useStore } from '@/lib/store'
import { Booking } from '@/lib/types'

export default function BookingsPage() {
  const bookings = useStore((state) => state.bookings)

  const [showDetail, setShowDetail] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold font-display text-white">Danh sách Booking</h2>

      <BookingList bookings={bookings} />

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