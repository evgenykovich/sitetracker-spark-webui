'use client'

import dynamic from 'next/dynamic'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Users,
  FileText,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import type { ChartData, ChartProps } from '@/components/admin'

// Import Recharts as a single dynamic component
const Chart = dynamic<ChartProps>(
  () => import('@/components/admin').then((mod) => mod.Chart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading chart...</p>
      </div>
    ),
  }
)

// Mock data for the graph
const graphData: ChartData[] = [
  { name: 'Jan', users: 400, forms: 240, revenue: 2400 },
  { name: 'Feb', users: 600, forms: 380, revenue: 3200 },
  { name: 'Mar', users: 800, forms: 420, revenue: 4000 },
  { name: 'Apr', users: 1000, forms: 580, revenue: 4800 },
  { name: 'May', users: 1200, forms: 680, revenue: 5600 },
  { name: 'Jun', users: 1400, forms: 780, revenue: 6400 },
  { name: 'Jul', users: 1600, forms: 880, revenue: 7200 },
  { name: 'Aug', users: 1800, forms: 980, revenue: 8000 },
  { name: 'Sep', users: 2000, forms: 1080, revenue: 8800 },
  { name: 'Oct', users: 2200, forms: 1180, revenue: 9600 },
  { name: 'Nov', users: 2400, forms: 1280, revenue: 10400 },
  { name: 'Dec', users: 2600, forms: 1380, revenue: 11200 },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your application settings and monitor system performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Form Submissions
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">856</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              +8% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345</div>
            <div className="flex items-center text-xs text-red-500">
              <ArrowDownRight className="mr-1 h-4 w-4" />
              -3% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Healthy</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Growth Analytics</CardTitle>
          <CardDescription>
            Monthly growth trends across key metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <Chart data={graphData} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events and logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  event: 'New user registration',
                  time: '2 minutes ago',
                  type: 'user',
                },
                {
                  event: 'Payment processed',
                  time: '15 minutes ago',
                  type: 'payment',
                },
                {
                  event: 'Form submitted',
                  time: '1 hour ago',
                  type: 'form',
                },
              ].map((activity, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.event}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full rounded-lg border p-2 text-left hover:bg-muted">
              Manage Users
            </button>
            <button className="w-full rounded-lg border p-2 text-left hover:bg-muted">
              View System Logs
            </button>
            <button className="w-full rounded-lg border p-2 text-left hover:bg-muted">
              Update Settings
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Resources</CardTitle>
            <CardDescription>Current resource usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>CPU Usage</div>
                  <div>45%</div>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full w-[45%] rounded-full bg-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>Memory Usage</div>
                  <div>72%</div>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full w-[72%] rounded-full bg-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>Storage Usage</div>
                  <div>23%</div>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full w-[23%] rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
