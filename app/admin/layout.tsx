'use client'

import { redirect } from 'next/navigation'
import { useAuth } from '@/lib/contexts/auth-context'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminNavbar } from '@/components/admin/navbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()

  // Protect admin routes
  if (!loading && (!user || user.role !== 'ADMIN')) {
    redirect('/')
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
