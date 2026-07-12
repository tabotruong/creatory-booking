'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Menu, LogOut, ChevronDown } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface HeaderProps {
  title: string
  onMenuClick?: () => void
  showMenuButton?: boolean
  onNotificationClick?: (bookingId: string | undefined) => void
}

export default function Header({ title, onMenuClick, showMenuButton = false, onNotificationClick }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()

  const user = useStore((state) => state.user)
  const notifications = useStore((state) => state.notifications)
  const markNotificationRead = useStore((state) => state.markNotificationRead)
  const setUser = useStore((state) => state.setUser)

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleLogout = () => {
    setUser(null)
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-brand-surface/80 backdrop-blur-lg border-b border-brand-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-lg hover:bg-brand-elevated transition-colors"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          )}
          <h1 className="text-xl font-semibold font-display text-white">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-brand-elevated transition-colors"
            >
              <Bell className="w-5 h-5 text-brand-text-secondary" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 mt-2 w-80 glass border border-brand-border rounded-xl shadow-xl z-50 animate-slide-down">
                  <div className="p-4 border-b border-brand-border">
                    <h3 className="font-semibold text-white">Thông báo</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-brand-text-secondary">Không có thông báo</p>
                    ) : (
                      notifications.slice(0, 10).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id)
                            setShowNotifications(false)
                            if (onNotificationClick) {
                              onNotificationClick(notif.bookingId)
                            }
                          }}
                          className={cn(
                            'p-4 border-b border-brand-border cursor-pointer hover:bg-brand-elevated transition-colors',
                            !notif.read && 'bg-brand-pink/5'
                          )}
                        >
                          <p className="text-sm font-medium text-white">{notif.title}</p>
                          <p className="text-xs text-brand-text-secondary mt-1">{notif.message}</p>
                          <p className="text-xs text-brand-text-secondary/50 mt-1">
                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: vi })}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-brand-elevated transition-colors"
            >
              <span className="text-xl">{user?.avatar}</span>
              <span className="hidden sm:block text-sm font-medium text-white">{user?.name}</span>
              <ChevronDown className="w-4 h-4 text-brand-text-secondary" />
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 glass border border-brand-border rounded-xl shadow-xl z-50 animate-slide-down">
                  <div className="p-4 border-b border-brand-border">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-brand-text-secondary">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full p-4 text-left text-brand-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Đăng xuất</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
