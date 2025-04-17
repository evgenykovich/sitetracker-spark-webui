'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { AlertCircle, CheckCircle2, Settings2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import SalesforceService, { SalesforceConfig } from '@/lib/services/salesforce'

const sessionFormSchema = z.object({
  accessToken: z.string().min(1, 'Access Token is required'),
  instanceUrl: z
    .string()
    .url('Must be a valid Salesforce URL')
    .includes('.salesforce.com', { message: 'Must be a Salesforce URL' }),
})

type SessionFormValues = z.infer<typeof sessionFormSchema>

interface ConnectionStatus {
  isConnected: boolean
  isChecking: boolean
  lastChecked: Date | null
  error?: string
}

declare global {
  interface Window {
    sforce?: {
      connection?: {
        sessionId?: string
        instanceUrl?: string
      }
    }
  }
}

function ConnectionForm({
  onSubmit,
  isLoading,
  defaultValues,
}: {
  onSubmit: (values: SessionFormValues) => Promise<void>
  isLoading: boolean
  defaultValues?: Partial<SessionFormValues>
}) {
  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      accessToken: '',
      instanceUrl: '',
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="accessToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access Token</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="font-mono text-sm min-h-[80px] whitespace-normal break-all"
                  spellCheck={false}
                  autoComplete="off"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value.trim())}
                />
              </FormControl>
              <FormDescription>
                The access_token from your active Salesforce session
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instanceUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instance URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  placeholder="https://your-instance.my.salesforce.com"
                />
              </FormControl>
              <FormDescription>Your Salesforce instance URL</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Connecting...' : 'Connect to Salesforce'}
        </Button>
      </form>
    </Form>
  )
}

export function ConnectSalesforce() {
  const { toast } = useToast()
  const [connection, setConnection] = useState<SalesforceConfig | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('status')
  const [isReconnectOpen, setIsReconnectOpen] = useState(false)
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isChecking: true,
    lastChecked: null,
  })

  const checkConnectionStatus = async () => {
    try {
      setStatus((prev) => ({ ...prev, isChecking: true }))
      const result = await SalesforceService.getConnectionStatus()

      setStatus({
        isConnected: result.connected,
        isChecking: false,
        lastChecked: new Date(),
        error: result.error,
      })
    } catch (error) {
      setStatus({
        isConnected: false,
        isChecking: false,
        lastChecked: new Date(),
        error: 'Failed to check connection status',
      })
    }
  }

  useEffect(() => {
    checkConnectionStatus()
    const interval = setInterval(checkConnectionStatus, 5 * 60 * 1000) // Check every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (values: SessionFormValues) => {
    try {
      setIsLoading(true)
      const userInfo = await SalesforceService.authorizeWithSession(
        values.accessToken,
        values.instanceUrl
      )

      toast({
        title: 'Connected to Salesforce',
        description: `Connected as ${
          userInfo.displayName || userInfo.username
        }`,
      })

      await checkConnectionStatus()
      setIsReconnectOpen(false)
      setActiveTab('status')
    } catch (error) {
      console.error('Failed to connect:', error)
      toast({
        variant: 'destructive',
        title: 'Connection Failed',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to connect to Salesforce',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderConnectionStatus = () => {
    if (status.isChecking) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4 animate-pulse" />
          <AlertTitle>Checking connection status...</AlertTitle>
        </Alert>
      )
    }

    if (!status.isConnected) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>{status.error}</AlertDescription>
          <Dialog open={isReconnectOpen} onOpenChange={setIsReconnectOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mt-2">
                Reconnect to Salesforce
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reconnect to Salesforce</DialogTitle>
                <DialogDescription>
                  Enter your Salesforce credentials to reestablish the
                  connection.
                </DialogDescription>
              </DialogHeader>
              <ConnectionForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                defaultValues={{
                  instanceUrl: connection?.instanceUrl,
                }}
              />
            </DialogContent>
          </Dialog>
        </Alert>
      )
    }

    return (
      <div className="space-y-4">
        <Alert variant="default" className="bg-primary/5 border-primary/20">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <AlertTitle>Connected to Salesforce</AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground">
            Last verified: {status.lastChecked?.toLocaleString()}
          </AlertDescription>
        </Alert>

        {connection && (
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Connected Organization</p>
                <p className="text-sm text-muted-foreground">
                  Instance: {connection.instanceUrl}
                </p>
                <p className="text-sm text-muted-foreground">
                  Last updated:{' '}
                  {new Date(connection.updatedAt).toLocaleString()}
                </p>
              </div>
              <Dialog open={isReconnectOpen} onOpenChange={setIsReconnectOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings2 className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Connection</DialogTitle>
                    <DialogDescription>
                      Update your Salesforce connection settings.
                    </DialogDescription>
                  </DialogHeader>
                  <ConnectionForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    defaultValues={{
                      instanceUrl: connection.instanceUrl,
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salesforce Integration</CardTitle>
        <CardDescription>
          Manage your Salesforce connection and settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="status">Connection Status</TabsTrigger>
            <TabsTrigger value="connect">New Connection</TabsTrigger>
          </TabsList>
          <TabsContent value="status" className="space-y-4">
            {renderConnectionStatus()}
          </TabsContent>
          <TabsContent value="connect">
            <ConnectionForm onSubmit={handleSubmit} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
