'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/auth-context'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FileSpreadsheet,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react'

const statsData = [
  {
    title: 'Total Forms',
    value: '12',
    description: 'Active forms',
    icon: <FileSpreadsheet className="h-4 w-4" />,
    color: 'text-blue-500',
  },
  {
    title: 'Submissions',
    value: '48',
    description: 'This month',
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-green-500',
  },
  {
    title: 'Pending Reviews',
    value: '6',
    description: 'Awaiting action',
    icon: <Clock className="h-4 w-4" />,
    color: 'text-orange-500',
  },
  {
    title: 'Active Users',
    value: '24',
    description: 'Contractors',
    icon: <Users className="h-4 w-4" />,
    color: 'text-purple-500',
  },
]

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
            Welcome back, {user.firstName}
            {user.lastName ? ` ${user.lastName}` : ''}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your forms today.
          </p>
        </div>

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
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full justify-between">
                <Link href="/forms/builder">
                  Create New Form
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-between"
              >
                <Link href="/forms/shared">
                  View Shared Forms
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-between"
              >
                <Link href="/forms/submissions">
                  Review Submissions
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Add more cards for recent activity, notifications, etc. */}
        </div>
      </div>
    </DashboardLayout>
  )
}
