'use client'

import { useState } from 'react'
import { Plus, Filter, Search } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Badge from '../ui/Badge'
import BookingCard from './BookingCard'
import BookingForm from './BookingForm'
import BookingDetail from './BookingDetail'
import { useStore } from '@/lib/store'
import { Booking, BookingStatus } from '@/lib/types'

interface BookingListProps {
  bookings: Booking[]
  showCreateButton?: boolean
}

export default function BookingList({ bookings, showCreateButton = true }: BookingListProps) {
  const user = useStore((state) => state.user)
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [editBooking, setEditBooking] = useState<Booking | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')

  const isManager = user?.role === 'manager'
  const isContentTeam = user?.role === 'content_team'

  // Filter bookings based on role
  const filteredBookings = bookings.filter((booking) => {
    // Cameraman only sees assigned bookings
    if (user?.role === 'cameraman') {
      return booking.assignedCameramen.includes(user.name)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        booking.contentName.toLowerCase().includes(query) ||
        booking.mcName.toLowerCase().includes(query) ||
        booking.brandName?.toLowerCase().includes(query) ||
        booking.location.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Status filter
    if (statusFilter !== 'all' && booking.status !== statusFilter) return false

    return true
  })

  // Sort by date (most recent first)
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date)
    if (dateCompare !== 0) return dateCompare
    return b.startTime.localeCompare(a.startTime)
  })

  const handleViewDetail = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowDetail(true)
  }

  const handleEdit = (booking: Booking) => {
    setEditBooking(booking)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditBooking(undefined)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-brand-elevated border border-brand-border rounded-lg text-white placeholder:text-brand-text-secondary/50 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'all')}
            className="px-4 py-2 bg-brand-elevated border border-brand-border rounded-lg text-white focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>

        {showCreateButton && (isManager || isContentTeam) && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Tạo Booking
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm">
        <span className="text-brand-text-secondary">
          Tổng: <span className="text-white font-medium">{filteredBookings.length}</span>
        </span>
        <span className="text-brand-text-secondary">
          Chờ duyệt: <span className="text-blue-400 font-medium">{filteredBookings.filter(b => b.status === 'pending').length}</span>
        </span>
        <span className="text-brand-text-secondary">
          Đã duyệt: <span className="text-green-400 font-medium">{filteredBookings.filter(b => b.status === 'approved').length}</span>
        </span>
      </div>

      {/* List */}
      {sortedBookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-brand-text-secondary">Không có booking nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onClick={() => handleViewDetail(booking)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <BookingForm isOpen={showForm} onClose={handleCloseForm} editBooking={editBooking} />

      <BookingDetail
        booking={selectedBooking}
        isOpen={showDetail}
        onClose={() => {
          setShowDetail(false)
          setSelectedBooking(null)
        }}
        onEdit={handleEdit}
      />
    </div>
  )
}
