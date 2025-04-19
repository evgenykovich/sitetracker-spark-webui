'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { PageHeader } from '@/components/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { SalesforceForms } from '@/components/salesforce/forms-list'
import SalesforceService, { SalesforceForm } from '@/lib/services/salesforce'

export default function FormsPage() {
  const [forms, setForms] = useState<SalesforceForm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchForms() {
      setIsLoading(true)
      setError(null)
      try {
        const formData = await SalesforceService.getForms()
        setForms(formData)
      } catch (err) {
        console.error('Error fetching forms:', err)
        setError(err instanceof Error ? err.message : 'Failed to load forms')
      } finally {
        setIsLoading(false)
      }
    }

    fetchForms()
  }, [])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col space-y-6 p-6">
          <PageHeader
            title="Forms"
            description="Create and manage contractor forms."
            action={{
              label: 'Create Form',
              href: '/forms/create',
              icon: Plus,
            }}
          />
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col space-y-6 p-6">
          <PageHeader
            title="Forms"
            description="Create and manage contractor forms."
            action={{
              label: 'Create Form',
              href: '/forms/create',
              icon: Plus,
            }}
          />
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">
                Error loading forms
              </CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Please try again later or contact support if the problem
                persists.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (forms.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex flex-col space-y-6 p-6">
          <PageHeader
            title="Forms"
            description="Create and manage contractor forms."
            action={{
              label: 'Create Form',
              href: '/forms/create',
              icon: Plus,
            }}
          />

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>No forms found</CardTitle>
              <CardDescription>
                Get started by creating your first form to send to contractors.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-center text-muted-foreground mb-6">
                You haven't created any forms yet. Forms help you collect
                standardized information from your contractors.
              </p>
              <Link href="/forms/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Form
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6 p-6">
        <PageHeader
          title="Forms"
          description="Create and manage contractor forms."
          action={{
            label: 'Create Form',
            href: '/forms/create',
            icon: Plus,
          }}
        />

        <SalesforceForms />
      </div>
    </DashboardLayout>
  )
}
