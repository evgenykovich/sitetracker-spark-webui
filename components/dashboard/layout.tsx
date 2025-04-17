'use client'

import { ReactNode, useState } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/contexts/auth-context'

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          isAdmin={isAdmin}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>

      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-200',
          isSidebarOpen ? 'md:pl-60' : 'md:pl-16'
        )}
      >
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Main Content */}
        <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  )
}
