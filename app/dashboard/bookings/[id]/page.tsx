'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { BookingDetail } from '@/components/booking'
import { useStore } from '@/lib/store'

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const bookings = useStore((state) => state.bookings)

  const booking = bookings.find((b) => b.id === id)

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Không tìm thấy booking</h2>
          <p className="text-brand-text-secondary mb-4">Booking này có thể đã bị xóa</p>
          <button
            onClick={() => router.push('/dashboard/bookings')}
            className="px-4 py-2 bg-brand-pink text-white rounded-lg"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-brand-surface border border-brand-border rounded-lg text-brand-text-secondary hover:text-white hover:border-brand-pink/50 transition-colors"
        >
          ← Quay lại
        </button>
        <h2 className="text-lg font-semibold font-display text-white">Chi tiết Booking</h2>
      </div>

      <BookingDetail
        booking={booking}
        isOpen={true}
        onClose={() => router.push('/dashboard/bookings')}
        onEdit={() => {}}
      />
    </div>
  )
}