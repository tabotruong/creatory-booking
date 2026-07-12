'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { X, LayoutDashboard, Calendar, Video, ClipboardList, LogOut, Wallet } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/calendar', icon: Calendar, label: 'Lịch quay' },
  { href: '/dashboard/bookings', icon: Video, label: 'Danh sách booking' },
  { href: '/dashboard/checklist', icon: ClipboardList, label: 'Checklist' },
]

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const user = useStore((state) => state.user)
  const setUser = useStore((state) => state.setUser)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleLogout = () => {
    setUser(null)
    router.push('/login')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Menu */}
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-brand-surface border-r border-brand-border animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-brand-border">
          <div>
            <h1 className="text-xl font-bold font-display bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">
              Creatory
            </h1>
            <p className="text-xs text-brand-text-secondary">Booking System</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-brand-elevated transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-brand-border">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{user?.avatar}</span>
            <div>
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-brand-text-secondary capitalize">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-brand-pink/20 text-brand-pink'
                    : 'text-brand-text-secondary hover:bg-brand-elevated hover:text-white'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
          {(user?.role === 'cameraman' || user?.role === 'manager') && (
            <Link
              href="/dashboard/income"
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                pathname === '/dashboard/income'
                  ? 'bg-brand-pink/20 text-brand-pink'
                  : 'text-brand-text-secondary hover:bg-brand-elevated hover:text-white'
              )}
            >
              <Wallet className="w-5 h-5" />
              <span className="font-medium">Bảng lương</span>
            </Link>
          )}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-brand-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-brand-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  )
}
