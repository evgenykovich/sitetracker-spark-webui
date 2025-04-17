'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/auth-context'
import { DashboardLayout } from '@/components/dashboard/layout'
import { ConnectSalesforce } from '@/components/integrations/connect-salesforce'

export default function SalesforcePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [router, user, loading])

  if (loading || !user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Salesforce Integration
          </h1>
          <p className="text-muted-foreground">
            Connect and manage your Salesforce organization
          </p>
        </div>

        <ConnectSalesforce />
      </div>
    </DashboardLayout>
  )
}
