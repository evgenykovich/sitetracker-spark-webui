'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Zap, Bot, Workflow, BrainCircuit, Lock } from 'lucide-react'

const accountFormSchema = z
  .object({
    language: z.string(),
    timezone: z.string(),
    emailNotifications: z.boolean(),
    pushNotifications: z.boolean(),
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false
      }
      return true
    },
    {
      message: 'Current password is required to set a new password',
      path: ['currentPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false
      }
      return true
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  )

type AccountFormValues = z.infer<typeof accountFormSchema>

const TIMEZONES = [
  { value: 'utc', label: 'UTC' },
  { value: 'est', label: 'Eastern Time' },
  { value: 'cst', label: 'Central Time' },
  { value: 'mst', label: 'Mountain Time' },
  { value: 'pst', label: 'Pacific Time' },
]

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
]

export default function AccountPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      language: 'en',
      timezone: 'utc',
      emailNotifications: true,
      pushNotifications: true,
    },
  })

  async function onSubmit(data: AccountFormValues) {
    setIsLoading(true)

    try {
      // TODO: Implement account settings update API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: 'Settings updated',
        description: 'Your account settings have been updated successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Account Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your account preferences and security settings.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>
                      Customize your account preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {LANGUAGES.map((language) => (
                                <SelectItem
                                  key={language.value}
                                  value={language.value}
                                >
                                  {language.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a timezone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TIMEZONES.map((timezone) => (
                                <SelectItem
                                  key={timezone.value}
                                  value={timezone.value}
                                >
                                  {timezone.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Email Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive email notifications about your account
                              activity.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pushNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Push Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive push notifications about your account
                              activity.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>
                      Update your password and security settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter current password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter new password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm new password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Premium Features</CardTitle>
                        <CardDescription>
                          Unlock advanced AI-powered features to streamline your
                          workflow.
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        Current Plan: Basic
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 h-[650px] overflow-y-auto">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 rounded-lg border">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Bot className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">AI Form Assistant</h4>
                            <Badge variant="outline" className="text-xs">
                              Pro
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Automatically generate and customize forms using AI.
                            Save hours of manual work.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setShowUpgradeDialog(true)}
                          >
                            <Lock className="mr-2 h-4 w-4" />
                            Upgrade to Pro
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-lg border">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Workflow className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">
                              Smart Workflow Automation
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              Pro
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Set up intelligent rules to automatically assign
                            contractors and manage form workflows.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setShowUpgradeDialog(true)}
                          >
                            <Lock className="mr-2 h-4 w-4" />
                            Upgrade to Pro
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted/50">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                          <BrainCircuit className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">
                              Predictive Analytics
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              Enterprise
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Get AI-powered insights about contractor performance
                            and project optimization.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setShowUpgradeDialog(true)}
                          >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Contact Sales
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted/50">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Zap className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">
                              Advanced Automation Suite
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              Enterprise
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Custom automation workflows, API access, and
                            advanced integrations.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setShowUpgradeDialog(true)}
                          >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Contact Sales
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <p className="text-sm text-muted-foreground">
                        Want to learn more about our premium features?{' '}
                        <Button
                          variant="link"
                          className="p-0 h-auto"
                          onClick={() => setShowUpgradeDialog(true)}
                        >
                          View detailed comparison
                        </Button>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>

        <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upgrade Your Plan</DialogTitle>
              <DialogDescription>
                Choose the plan that best fits your needs. All plans include our
                core features with additional capabilities as you scale.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-4">
                <div className="flex items-center gap-4 p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Pro Plan</h4>
                    <p className="text-sm text-muted-foreground">$49/month</p>
                  </div>
                  <div className="ml-auto">
                    <Button
                      onClick={() => {
                        setShowUpgradeDialog(false)
                        toast({
                          title: 'Coming Soon',
                          description: 'This feature will be available soon!',
                        })
                      }}
                    >
                      Upgrade to Pro
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Enterprise Plan</h4>
                    <p className="text-sm text-muted-foreground">
                      Custom pricing
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowUpgradeDialog(false)
                        toast({
                          title: 'Contact Sales',
                          description:
                            'Our team will reach out to discuss enterprise options.',
                        })
                      }}
                    >
                      Contact Sales
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowUpgradeDialog(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
