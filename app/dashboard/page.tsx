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
  AlertTriangle,
} from 'lucide-react'
import SalesforceService from '@/lib/services/salesforce'
import ContractorsService from '@/lib/services/contractors'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

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
  const [salesforceError, setSalesforceError] = useState<boolean>(false)
  const [contractorsError, setContractorsError] = useState<boolean>(false)
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
        setSalesforceError(false)
        setContractorsError(false)

        // Fetch forms and contractors in parallel
        const [formsResult, contractorsResult] = await Promise.allSettled([
          SalesforceService.getForms(),
          ContractorsService.getContractors({}),
        ])

        // Handle Salesforce data
        if (formsResult.status === 'rejected') {
          console.error('Error fetching Salesforce data:', formsResult.reason)
          setSalesforceError(true)
          setDashboardData((prev) => ({
            ...prev,
            totalForms: '-',
            pendingForms: '-',
          }))
          setRecentForms([])
        } else {
          const forms = formsResult.value
          const pendingForms = forms.filter(
            (form) => form.status?.toLowerCase() === 'pending'
          )
          setDashboardData((prev) => ({
            ...prev,
            totalForms: forms.length.toString(),
            pendingForms: pendingForms.length.toString(),
          }))

          // Get the most recent 3 forms
          const sortedForms = [...forms].sort((a, b) => {
            return (
              new Date(b.createdDate || 0).getTime() -
              new Date(a.createdDate || 0).getTime()
            )
          })
          setRecentForms(sortedForms.slice(0, 3))
        }

        // Handle Contractors data
        if (contractorsResult.status === 'rejected') {
          console.error(
            'Error fetching Contractors data:',
            contractorsResult.reason
          )
          setContractorsError(true)
          setDashboardData((prev) => ({
            ...prev,
            totalContractors: '-',
            activeContractors: '-',
          }))
          setRecentContractors([])
        } else {
          const contractors = contractorsResult.value
          const activeContractors = contractors.filter(
            (c) => c.status?.toLowerCase() === 'active'
          )
          setDashboardData((prev) => ({
            ...prev,
            totalContractors: contractors.length.toString(),
            activeContractors: activeContractors.length.toString(),
          }))

          // Get the most recent 3 contractors
          const sortedContractors = [...contractors].sort((a, b) => {
            return (
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
            )
          })
          setRecentContractors(sortedContractors.slice(0, 3))
        }
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err)
        setSalesforceError(true)
        setContractorsError(true)
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

        {salesforceError && (
          <Alert>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertTitle>Salesforce Connection Issue</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                We're unable to connect to Salesforce at the moment. Some
                form-related data may be unavailable.
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Verify your Salesforce credentials</li>
                <li>Check if your Salesforce instance is accessible</li>
                <li>Contact your administrator if the problem persists</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {contractorsError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Contractor Data</AlertTitle>
            <AlertDescription>
              Unable to load contractor information. Please try refreshing the
              page.
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          </div>
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
                  <Card className={stat.value === '-' ? 'opacity-60' : ''}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <div className={stat.color}>{stat.icon}</div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stat.value === '-' ? 'N/A' : stat.value}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {stat.value === '-'
                          ? 'Currently unavailable'
                          : stat.description}
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
                  <Button
                    asChild
                    className="w-full justify-between"
                    disabled={salesforceError}
                  >
                    <Link href="/forms/create">
                      Create New Form
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-between"
                    disabled={salesforceError}
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
                    disabled={contractorsError}
                  >
                    <Link href="/contractors/new">
                      Add New Contractor
                      <UserPlus className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Forms Card */}
              {!salesforceError && (
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
              )}

              {/* Recent Contractors Card */}
              {!contractorsError && (
                <Card className="flex flex-col pt-2">
                  <CardHeader>
                    <CardTitle>Recent Contractors</CardTitle>
                    <CardDescription>Latest contractors added</CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 py-0 flex-1">
                    {recentContractors.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4 text-center">
                        No contractors added yet. Add your first contractor to
                        get started.
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
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
