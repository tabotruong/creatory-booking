import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User, Booking, Notification, Toast } from './types'
import { initialBookings } from './initial-data'
import { generateId } from './utils'
import { addDays, startOfWeek } from 'date-fns'

// Custom storage that handles SSR
const customStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(name)
  },
  setItem: (name: string, value: string): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(name, value)
    }
  },
  removeItem: (name: string): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(name)
    }
  },
}

interface BookingStore {
  // User
  user: User | null
  setUser: (user: User | null) => void

  // Bookings
  bookings: Booking[]
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBooking: (id: string, updates: Partial<Booking>) => void
  deleteBooking: (id: string) => void
  approveBooking: (id: string) => void
  rejectBooking: (id: string) => void

  // Notifications
  notifications: Notification[]
  addNotification: (title: string, message: string, type: Notification['type'], bookingId?: string) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void

  // Toast
  toast: Toast | null
  showToast: (message: string, type: Toast['type']) => void
  hideToast: () => void

  // Calendar
  currentWeekStart: Date
  setCurrentWeekStart: (date: Date) => void
  goToNextWeek: () => void
  goToPrevWeek: () => void

  // Modal states
  showBookingModal: boolean
  setShowBookingModal: (show: boolean) => void
  selectedBookingId: string | null
  setSelectedBookingId: (id: string | null) => void

  // Hydration
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

export const useStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),

      // Bookings
      bookings: initialBookings,

      addBooking: (bookingData) => {
        const now = new Date().toISOString()
        const newBooking: Booking = {
          ...bookingData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        }

        set((state) => ({
          bookings: [...state.bookings, newBooking],
        }))

        // Add notification for manager
        get().addNotification(
          'Yêu cầu mới',
          `${bookingData.createdByName} vừa tạo booking "${bookingData.contentName}"`,
          'info',
          newBooking.id
        )

        get().showToast('Đã tạo booking thành công!', 'success')
      },

      updateBooking: (id, updates) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id
              ? { ...b, ...updates, updatedAt: new Date().toISOString(), isModified: false }
              : b
          ),
        }))
        get().showToast('Đã cập nhật booking!', 'success')
      },

      deleteBooking: (id) => {
        set((state) => ({
          bookings: state.bookings.filter((b) => b.id !== id),
        }))
        get().showToast('Đã xóa booking!', 'success')
      },

      approveBooking: (id) => {
        const booking = get().bookings.find((b) => b.id === id)
        if (booking) {
          set((state) => ({
            bookings: state.bookings.map((b) =>
              b.id === id
                ? { ...b, status: 'approved', updatedAt: new Date().toISOString() }
                : b
            ),
          }))

          get().addNotification(
            'Booking được duyệt',
            `Booking "${booking.contentName}" đã được duyệt`,
            'success',
            id
          )

          get().showToast('Đã duyệt booking!', 'success')
        }
      },

      rejectBooking: (id) => {
        const booking = get().bookings.find((b) => b.id === id)
        if (booking) {
          set((state) => ({
            bookings: state.bookings.map((b) =>
              b.id === id
                ? { ...b, status: 'rejected', updatedAt: new Date().toISOString() }
                : b
            ),
          }))

          get().addNotification(
            'Booking bị từ chối',
            `Booking "${booking.contentName}" đã bị từ chối`,
            'error',
            id
          )

          get().showToast('Đã từ chối booking!', 'error')
        }
      },

      // Notifications
      notifications: [],
      addNotification: (title, message, type, bookingId?: string) => {
        const notification: Notification = {
          id: generateId(),
          title,
          message,
          type,
          read: false,
          createdAt: new Date().toISOString(),
          bookingId,
        }
        set((state) => ({
          notifications: [notification, ...state.notifications],
        }))
      },
      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }))
      },
      clearNotifications: () => set({ notifications: [] }),

      // Toast
      toast: null,
      showToast: (message, type) => {
        set({ toast: { id: Date.now(), message, type } })
        setTimeout(() => {
          set((state) => (state.toast?.message === message ? { toast: null } : state))
        }, 3000)
      },
      hideToast: () => set({ toast: null }),

      // Calendar
      currentWeekStart: startOfWeek(new Date(), { weekStartsOn: 1 }),
      setCurrentWeekStart: (date) => set({ currentWeekStart: date }),
      goToNextWeek: () => {
        set((state) => ({
          currentWeekStart: addDays(state.currentWeekStart, 14),
        }))
      },
      goToPrevWeek: () => {
        set((state) => ({
          currentWeekStart: addDays(state.currentWeekStart, -14),
        }))
      },

      // Modal states
      showBookingModal: false,
      setShowBookingModal: (show) => set({ showBookingModal: show }),
      selectedBookingId: null,
      setSelectedBookingId: (id) => set({ selectedBookingId: id }),

      // Hydration flag
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'creatory-booking-storage-v2',
      storage: createJSONStorage(() => customStorage),
      skipHydration: true,
      onRehydrateStorage: () => {
        return (state) => {
          state?.setHasHydrated(true)
        }
      },
      partialize: (state) => ({
        user: state.user,
        bookings: state.bookings,
        notifications: state.notifications,
      }),
    }
  )
)

// Hook to trigger rehydration on mount
export const useHydratedStore = () => {
  const hasHydrated = useStore((state) => state._hasHydrated)

  if (typeof window !== 'undefined' && !hasHydrated) {
    setTimeout(() => {
      useStore.persist.rehydrate()
    }, 100)
  }

  return hasHydrated
}
