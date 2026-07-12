'use client'

import { useMemo } from 'react'
import { useStore } from '@/lib/store'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import Card from '@/components/ui/Card'
import { AlertTriangle, User, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface IssueEntry {
  bookingId: string
  contentName: string
  date: string
  cameramanName: string
  notes: string
}

export default function IssuesPage() {
  const user = useStore((state) => state.user)
  const bookings = useStore((state) => state.bookings)

  if (user?.role !== 'manager') {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white mb-2">Ghi chú/Vấn đề</h2>
        <p className="text-brand-text-secondary">
          Trang này chỉ dành cho Quản lý
        </p>
      </div>
    )
  }

  // Collect all issues from all bookings
  const allIssues = useMemo(() => {
    const issues: IssueEntry[] = []

    bookings.forEach((booking) => {
      if (booking.checklistNotes) {
        Object.entries(booking.checklistNotes).forEach(([cameramanName, notes]) => {
          if (notes && notes.trim()) {
            issues.push({
              bookingId: booking.id,
              contentName: booking.contentName,
              date: booking.date,
              cameramanName,
              notes: notes.trim(),
            })
          }
        })
      }
    })

    // Sort by date descending (newest first)
    return issues.sort((a, b) => b.date.localeCompare(a.date))
  }, [bookings])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 text-orange-500" />
        <h2 className="text-lg font-semibold font-display text-white">
          Ghi chú/Vấn đề
        </h2>
        {allIssues.length > 0 && (
          <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full text-sm">
            {allIssues.length}
          </span>
        )}
      </div>

      {allIssues.length === 0 ? (
        <Card className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-brand-text-secondary mx-auto mb-4 opacity-50" />
          <p className="text-brand-text-secondary">
            Chưa có ghi chú hoặc vấn đề nào được báo cáo
          </p>
          <p className="text-sm text-brand-text-secondary mt-2">
            Ghi chú sẽ xuất hiện khi cameraman note lại các vấn đề trong checklist
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {allIssues.map((issue, idx) => (
            <Card key={`${issue.bookingId}-${issue.cameramanName}-${idx}`}>
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-white">{issue.contentName}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-brand-text-secondary">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(issue.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {issue.cameramanName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes content */}
                <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <p className="text-sm text-white whitespace-pre-wrap">{issue.notes}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
