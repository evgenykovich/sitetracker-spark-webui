'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/auth-context'
import { DashboardLayout } from '@/components/dashboard/layout'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FileSpreadsheet,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
  Loader2,
  AlertCircle,
  UserPlus,
} from 'lucide-react'
import SalesforceService from '@/lib/services/salesforce'
import ContractorsService from '@/lib/services/contractors'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [dashboardData, setDashboardData] = useState({
    totalForms: '...',
    pendingForms: '...',
    totalContractors: '...',
    activeContractors: '...',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recentContractors, setRecentContractors] = useState<any[]>([])
  const [recentForms, setRecentForms] = useState<any[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [router, user, loading])

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch forms and contractors in parallel
        const [forms, contractors] = await Promise.all([
          SalesforceService.getForms(),
          ContractorsService.getContractors({}),
        ])

        // Calculate active contractors (those with "ACTIVE" status)
        const activeContractors = contractors.filter(
          (c) => c.status?.toLowerCase() === 'active'
        )

        // Calculate pending forms - for demo, assuming forms with "pending" status
        const pendingForms = forms.filter(
          (form) => form.status?.toLowerCase() === 'pending'
        )

        // Get the most recent 3 contractors
        const sortedContractors = [...contractors].sort((a, b) => {
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          )
        })
        setRecentContractors(sortedContractors.slice(0, 3))

        // Get the most recent 3 forms
        const sortedForms = [...forms].sort((a, b) => {
          return (
            new Date(b.createdDate || 0).getTime() -
            new Date(a.createdDate || 0).getTime()
          )
        })
        setRecentForms(sortedForms.slice(0, 3))

        // Update dashboard data
        setDashboardData({
          totalForms: forms.length.toString(),
          pendingForms: pendingForms.length.toString(),
          totalContractors: contractors.length.toString(),
          activeContractors: activeContractors.length.toString(),
        })
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data.')
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user])

  if (loading || !user) {
    return null
  }

  // Stats data now uses real numbers
  const statsData = [
    {
      title: 'Total Forms',
      value: dashboardData.totalForms,
      description: 'Created forms',
      icon: <FileSpreadsheet className="h-4 w-4" />,
      color: 'text-blue-500',
    },
    {
      title: 'Pending Forms',
      value: dashboardData.pendingForms,
      description: 'Awaiting completion',
      icon: <Clock className="h-4 w-4" />,
      color: 'text-orange-500',
    },
    {
      title: 'Total Contractors',
      value: dashboardData.totalContractors,
      description: 'Registered contractors',
      icon: <Users className="h-4 w-4" />,
      color: 'text-purple-500',
    },
    {
      title: 'Active Contractors',
      value: dashboardData.activeContractors,
      description: 'Currently active',
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'text-green-500',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user.firstName}
            {user.lastName ? ` ${user.lastName}` : ''}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your forms and contractors today.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Error Loading Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try refreshing the page or contact support if the problem
                persists.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              {statsData.map((stat) => (
                <motion.div key={stat.title} variants={item}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <div className={stat.color}>{stat.icon}</div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Quick Actions Card */}
              <Card className="flex flex-col pt-2">
                <CardHeader className="mb-2">
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="px-6 py-0 space-y-2 flex-1">
                  <Button asChild className="w-full justify-between">
                    <Link href="/forms/create">
                      Create New Form
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-between"
                  >
                    <Link href="/forms">
                      View All Forms
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-between"
                  >
                    <Link href="/contractors/new">
                      Add New Contractor
                      <UserPlus className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
                <div className="hidden px-6 pb-6 mt-auto">
                  {/* Hidden spacer to maintain consistent height */}
                </div>
              </Card>

              {/* Recent Forms Card */}
              <Card className="flex flex-col pt-2">
                <CardHeader>
                  <CardTitle>Recent Forms</CardTitle>
                  <CardDescription>Latest forms created</CardDescription>
                </CardHeader>
                <CardContent className="px-6 py-0 flex-1">
                  {recentForms.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      No forms created yet. Create your first form to get
                      started.
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {recentForms.map((form) => (
                        <div
                          key={form.id}
                          className="flex items-center justify-between pt-2"
                        >
                          <div>
                            <p className="font-medium text-sm">{form.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {form.createdDate
                                ? new Date(
                                    form.createdDate
                                  ).toLocaleDateString()
                                : 'Recently'}
                            </p>
                          </div>
                          <Link href={`/forms/${form.id}`}>
                            <Button variant="ghost" size="sm" className="h-8">
                              View
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <div className="px-6 pb-6 mt-auto">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Link href="/forms">View All Forms</Link>
                  </Button>
                </div>
              </Card>

              {/* Recent Contractors Card */}
              <Card className="flex flex-col pt-2">
                <CardHeader>
                  <CardTitle>Recent Contractors</CardTitle>
                  <CardDescription>Latest contractors added</CardDescription>
                </CardHeader>
                <CardContent className="px-6 py-0 flex-1">
                  {recentContractors.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      No contractors added yet. Add your first contractor to get
                      started.
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {recentContractors.map((contractor) => (
                        <div
                          key={contractor.id}
                          className="flex items-center justify-between pt-2"
                        >
                          <div>
                            <p className="font-medium text-sm">
                              {contractor.firstName} {contractor.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {contractor.companyName || 'Independent'}
                            </p>
                          </div>
                          <Link href={`/contractors?id=${contractor.id}`}>
                            <Button variant="ghost" size="sm" className="h-8">
                              View
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <div className="px-6 pb-6 mt-auto">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Link href="/contractors">View All Contractors</Link>
                  </Button>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
