'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DEMO_USERS, ROLE_LABELS } from '@/lib/constants'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const setUser = useStore((state) => state.setUser)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const filteredUsers = selectedRole
    ? DEMO_USERS.filter((u) => u.role === selectedRole)
    : DEMO_USERS

  const handleLogin = (user: typeof DEMO_USERS[0]) => {
    setUser(user)
    router.push('/dashboard')
  }

  const roles = [
    { id: 'manager', label: 'Quản lý', icon: '👨‍💼', description: 'Duyệt booking, phân công cameraman' },
    { id: 'cameraman', label: 'Cameraman', icon: '🎥', description: 'Xem lịch, thực hiện checklist' },
    { id: 'content_team', label: 'Content Team', icon: '👩‍💻', description: 'Tạo và quản lý booking' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">
            Creatory
          </h1>
          <p className="text-brand-text-secondary mt-2">Hệ thống đặt lịch quay</p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <p className="text-sm text-brand-text-secondary mb-3 text-center">
            Chọn vai trò để đăng nhập (Demo)
          </p>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(selectedRole === role.id ? null : role.id)}
                className={cn(
                  'p-4 rounded-xl border transition-all duration-200 text-center',
                  selectedRole === role.id
                    ? 'bg-brand-pink/20 border-brand-pink'
                    : 'bg-brand-surface border-brand-border hover:border-brand-pink/50'
                )}
              >
                <span className="text-2xl mb-2 block">{role.icon}</span>
                <span className="text-sm font-medium text-white block">{role.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* User List */}
        <div className="space-y-2">
          <p className="text-sm text-brand-text-secondary">
            {selectedRole ? `Tài khoản ${roles.find((r) => r.id === selectedRole)?.label}:` : 'Tất cả tài khoản:'}
          </p>
          {filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => handleLogin(user)}
              className="w-full flex items-center gap-4 p-4 bg-brand-surface border border-brand-border rounded-xl hover:bg-brand-elevated hover:border-brand-pink/50 transition-all duration-200 text-left"
            >
              <span className="text-3xl">{user.avatar}</span>
              <div className="flex-1">
                <p className="font-medium text-white">{user.name}</p>
                <p className="text-sm text-brand-text-secondary">{user.email}</p>
              </div>
              <span className="px-3 py-1 bg-brand-elevated rounded-full text-xs text-brand-text-secondary">
                {ROLE_LABELS[user.role]}
              </span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-brand-text-secondary/50 mt-8">
          Demo Mode - Không cần đăng nhập thật
        </p>
      </div>
    </div>
  )
}
