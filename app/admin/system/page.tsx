'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Activity,
  AlertCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  CloudOff,
  Database,
  HardDrive,
  RefreshCcw,
  Server,
  XCircle,
} from 'lucide-react'

// Mock data - replace with real data later
const mockServices = [
  {
    name: 'API Server',
    status: 'healthy',
    uptime: '99.9%',
    lastIncident: null,
    responseTime: '120ms',
  },
  {
    name: 'Database',
    status: 'healthy',
    uptime: '99.8%',
    lastIncident: '2024-03-15',
    responseTime: '45ms',
  },
  {
    name: 'Salesforce Integration',
    status: 'degraded',
    uptime: '98.5%',
    lastIncident: '2024-03-20',
    responseTime: '350ms',
  },
  {
    name: 'Authentication Service',
    status: 'healthy',
    uptime: '99.9%',
    lastIncident: null,
    responseTime: '85ms',
  },
  {
    name: 'File Storage',
    status: 'healthy',
    uptime: '99.7%',
    lastIncident: '2024-03-10',
    responseTime: '150ms',
  },
]

const mockMetrics = {
  cpu: {
    usage: 45,
    cores: 8,
    temperature: 65,
  },
  memory: {
    total: 32,
    used: 18.5,
    swap: 2.1,
  },
  disk: {
    total: 500,
    used: 285,
    read: '125 MB/s',
    write: '45 MB/s',
  },
  network: {
    incoming: '2.5 MB/s',
    outgoing: '1.8 MB/s',
    latency: '25ms',
  },
}

const mockLogs = [
  {
    timestamp: '2024-03-20T15:45:00Z',
    level: 'error',
    service: 'Salesforce Integration',
    message: 'Connection timeout after 30s',
  },
  {
    timestamp: '2024-03-20T15:44:30Z',
    level: 'warning',
    service: 'API Server',
    message: 'High memory usage detected (85%)',
  },
  {
    timestamp: '2024-03-20T15:44:00Z',
    level: 'info',
    service: 'Authentication Service',
    message: 'Successfully rotated encryption keys',
  },
  {
    timestamp: '2024-03-20T15:43:00Z',
    level: 'info',
    service: 'Database',
    message: 'Automated backup completed successfully',
  },
]

export default function SystemPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'down':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <CloudOff className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      healthy:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      degraded:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      down: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    }
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          variants[status] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
          <p className="text-muted-foreground">
            Monitor system health and performance
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
        >
          <RefreshCcw
            className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Health
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Good</div>
                <p className="text-xs text-muted-foreground">
                  All critical services operational
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Services
                </CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5/5</div>
                <p className="text-xs text-muted-foreground">
                  All services running
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Load
                </CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45%</div>
                <p className="text-xs text-muted-foreground">
                  Normal operating range
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Database Status
                </CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Healthy</div>
                <p className="text-xs text-muted-foreground">
                  45ms response time
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
              <CardDescription>
                Current status of all system services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockServices.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(service.status)}
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Response Time: {service.responseTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Uptime</p>
                        <p className="text-sm text-muted-foreground">
                          {service.uptime}
                        </p>
                      </div>
                      {getStatusBadge(service.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>CPU & Memory</CardTitle>
                <CardDescription>System resource usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">CPU Usage</p>
                      <p className="text-sm text-muted-foreground">
                        {mockMetrics.cpu.usage}% / {mockMetrics.cpu.cores} Cores
                      </p>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${mockMetrics.cpu.usage}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Memory Usage</p>
                      <p className="text-sm text-muted-foreground">
                        {mockMetrics.memory.used}GB / {mockMetrics.memory.total}
                        GB
                      </p>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${
                            (mockMetrics.memory.used /
                              mockMetrics.memory.total) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Activity</CardTitle>
                <CardDescription>Current network metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ArrowDownCircle className="h-4 w-4 text-green-500" />
                      <p className="text-sm font-medium">Incoming Traffic</p>
                    </div>
                    <p className="text-sm">{mockMetrics.network.incoming}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ArrowUpCircle className="h-4 w-4 text-blue-500" />
                      <p className="text-sm font-medium">Outgoing Traffic</p>
                    </div>
                    <p className="text-sm">{mockMetrics.network.outgoing}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Network Latency</p>
                    <p className="text-sm">{mockMetrics.network.latency}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Storage</CardTitle>
                <CardDescription>Disk usage and I/O</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Disk Usage</p>
                      <p className="text-sm text-muted-foreground">
                        {mockMetrics.disk.used}GB / {mockMetrics.disk.total}GB
                      </p>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${
                            (mockMetrics.disk.used / mockMetrics.disk.total) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Read Speed</p>
                      <p className="text-sm text-muted-foreground">
                        {mockMetrics.disk.read}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Write Speed</p>
                      <p className="text-sm text-muted-foreground">
                        {mockMetrics.disk.write}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>Recent system events and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLogs.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 border rounded-lg"
                  >
                    <div
                      className={`w-2 h-2 mt-2 rounded-full ${
                        log.level === 'error'
                          ? 'bg-red-500'
                          : log.level === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{log.service}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {log.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
