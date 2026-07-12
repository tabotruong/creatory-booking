'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Calendar, Video, ClipboardList, LogOut, Wallet, AlertCircle, Users } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/calendar', icon: Calendar, label: 'Lịch quay' },
  { href: '/dashboard/bookings', icon: Video, label: 'Danh sách booking' },
  { href: '/dashboard/checklist', icon: ClipboardList, label: 'Checklist' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const user = useStore((state) => state.user)
  const setUser = useStore((state) => state.setUser)

  const isCameraman = user?.role === 'cameraman'
  const isManager = user?.role === 'manager'

  const handleLogout = () => {
    setUser(null)
    router.push('/login')
  }

  return (
    <aside className="hidden md:flex flex-col w-64 bg-brand-surface border-r border-brand-border h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-brand-border">
        <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">
          Creatory
        </h1>
        <p className="text-xs text-brand-text-secondary mt-1">Booking System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-brand-pink/20 text-brand-pink border-l-4 border-brand-pink'
                  : 'text-brand-text-secondary hover:bg-brand-elevated hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}

        {/* Bảng lương - for both cameraman and manager */}
        {(isCameraman || isManager) && (
          <Link
            href="/dashboard/income"
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
              pathname === '/dashboard/income'
                ? 'bg-brand-pink/20 text-brand-pink border-l-4 border-brand-pink'
                : 'text-brand-text-secondary hover:bg-brand-elevated hover:text-white'
            )}
          >
            <Wallet className="w-5 h-5" />
            <span className="font-medium">Bảng lương</span>
          </Link>
        )}

        {/* Ghi chú/Vấn đề - only for manager */}
        {isManager && (
          <Link
            href="/dashboard/issues"
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
              pathname === '/dashboard/issues'
                ? 'bg-brand-pink/20 text-brand-pink border-l-4 border-brand-pink'
                : 'text-brand-text-secondary hover:bg-brand-elevated hover:text-white'
            )}
          >
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Ghi chú/Vấn đề</span>
          </Link>
        )}

        {/* Cameramen - only for manager */}
        {isManager && (
          <Link
            href="/dashboard/cameramen"
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
              pathname === '/dashboard/cameramen'
                ? 'bg-brand-pink/20 text-brand-pink border-l-4 border-brand-pink'
                : 'text-brand-text-secondary hover:bg-brand-elevated hover:text-white'
            )}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Cameraman</span>
          </Link>
        )}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-brand-border">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-brand-elevated">
          <span className="text-2xl">{user?.avatar}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-brand-text-secondary capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full mt-2 px-4 py-3 rounded-lg text-brand-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}
