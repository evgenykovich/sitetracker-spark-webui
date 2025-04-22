'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Bell,
  Globe,
  Lock,
  Mail,
  MessageSquare,
  Save,
  Settings,
  Shield,
  FileText,
  Plus,
  Pencil,
  Trash2,
  Bold,
  Italic,
  Link as LinkIcon,
  Image,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Pilcrow,
  Quote,
  Underline,
  TextQuote,
  Palette,
} from 'lucide-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Placeholder from '@tiptap/extension-placeholder'
import UnderlineExtension from '@tiptap/extension-underline'

const settingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteUrl: z.string().url('Please enter a valid URL'),
  supportEmail: z.string().email('Please enter a valid email'),
  defaultLanguage: z.string(),
  defaultTimezone: z.string(),
})

// Mock email templates data
const mockTemplates = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to SiteTracker Spark!',
    content:
      "Hello {{name}},\n\nWelcome to SiteTracker Spark! We're excited to have you on board...",
    variables: ['name', 'company'],
  },
  {
    id: '2',
    name: 'Password Reset',
    subject: 'Password Reset Request',
    content: 'Hi {{name}},\n\nWe received a request to reset your password...',
    variables: ['name', 'reset_link'],
  },
  {
    id: '3',
    name: 'Contractor Form Request',
    subject: 'New Form to Complete: {{form_name}}',
    content: `Dear {{contractor_name}},

A new form has been created for you to complete: {{form_name}}

Form Details:
- Project: {{project_name}}
- Due Date: {{due_date}}
- Status: Pending Completion

Please click the link below to access and complete the form:
{{form_link}}

Important Notes:
- This form must be completed by {{due_date}}
- Estimated completion time: {{estimated_time}} minutes
- Required attachments: {{required_attachments}}

If you have any questions or issues accessing the form, please contact {{project_manager_name}} at {{project_manager_email}}.

Thank you for your prompt attention to this matter.

Best regards,
The SiteTracker Team`,
    variables: [
      'contractor_name',
      'form_name',
      'project_name',
      'due_date',
      'form_link',
      'estimated_time',
      'required_attachments',
      'project_manager_name',
      'project_manager_email',
    ],
  },
]

interface EmailTemplate {
  id: string
  name: string
  content: string
}

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null)
  const [isEditingTemplate, setIsEditingTemplate] = useState(false)
  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    content: '',
  })
  const [isDirty, setIsDirty] = useState(false)

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: 'SiteTracker Spark',
      siteUrl: 'https://spark.sitetracker.com',
      supportEmail: 'support@sitetracker.com',
      defaultLanguage: 'en',
      defaultTimezone: 'UTC',
    },
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Color,
      TextStyle,
      Placeholder.configure({
        placeholder: 'Write something...',
      }),
      UnderlineExtension,
    ],
    content: '',
  })

  const colors = [
    '#000000', // black
    '#4A5568', // gray
    '#2B6CB0', // blue
    '#2F855A', // green
    '#C53030', // red
    '#B7791F', // yellow
  ]

  const onSubmit = async (data: z.infer<typeof settingsSchema>) => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Settings saved:', data)
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Globe className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="email-templates">
            <FileText className="h-4 w-4 mr-2" />
            Email Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic application settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of your application
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="siteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The base URL of your application
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="defaultLanguage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Language</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="defaultTimezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Timezone</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timezone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="UTC">UTC</SelectItem>
                              <SelectItem value="EST">
                                Eastern Time (EST)
                              </SelectItem>
                              <SelectItem value="CST">
                                Central Time (CST)
                              </SelectItem>
                              <SelectItem value="PST">
                                Pacific Time (PST)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isSaving}>
                    {isSaving && (
                      <span className="spinner h-4 w-4 mr-2 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all admin accounts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Password Requirements</Label>
                    <p className="text-sm text-muted-foreground">
                      Enforce strong password policy
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out inactive users
                    </p>
                  </div>
                  <Select defaultValue="60">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Mail className="h-4 w-4" />
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <MessageSquare className="h-4 w-4" />
                    <div className="space-y-0.5">
                      <Label>In-App Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show notifications in the application
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="space-y-4">
                  <Label>Notification Types</Label>
                  <div className="grid gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="updates" defaultChecked />
                      <Label htmlFor="updates">System Updates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="security" defaultChecked />
                      <Label htmlFor="security">Security Alerts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="maintenance" defaultChecked />
                      <Label htmlFor="maintenance">Maintenance Notices</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>
                Configure third-party service integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Salesforce Integration</Label>
                    <p className="text-sm text-muted-foreground">
                      Connect to your Salesforce instance
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="API Key"
                      type="password"
                      className="w-[300px]"
                    />
                    <Button variant="outline">Connect</Button>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Service</Label>
                    <p className="text-sm text-muted-foreground">
                      Configure SMTP settings
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select defaultValue="smtp">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smtp">SMTP</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="mailgun">Mailgun</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">Configure</Button>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Storage Provider</Label>
                    <p className="text-sm text-muted-foreground">
                      Configure file storage settings
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select defaultValue="local">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Local Storage</SelectItem>
                        <SelectItem value="s3">Amazon S3</SelectItem>
                        <SelectItem value="gcs">
                          Google Cloud Storage
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">Configure</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email-templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Email Templates</CardTitle>
                  <CardDescription>
                    Create and manage email templates with variables
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setSelectedTemplate(null)
                    setIsEditingTemplate(true)
                    setTemplateForm({
                      name: '',
                      subject: '',
                      content: '',
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!isEditingTemplate ? (
                <div className="space-y-4">
                  {mockTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{template.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Subject: {template.subject}
                        </p>
                        <div className="flex items-center space-x-2 flex-wrap">
                          <p className="text-sm text-muted-foreground">
                            Variables:
                          </p>
                          {template.variables.map((variable) => (
                            <Badge
                              key={variable}
                              variant="secondary"
                              className="text-xs m-1"
                            >
                              {`{{${variable}}}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedTemplate(template)
                            setIsEditingTemplate(true)
                            setTemplateForm({
                              name: template.name,
                              subject: template.subject,
                              content: template.content,
                            })
                            if (editor) {
                              editor.commands.setContent(template.content)
                            }
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Template Name</Label>
                      <Input
                        value={templateForm.name}
                        onChange={(e) =>
                          setTemplateForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="e.g., Welcome Email"
                      />
                    </div>
                    <div>
                      <Label>Email Subject</Label>
                      <Input
                        value={templateForm.subject}
                        onChange={(e) =>
                          setTemplateForm((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        placeholder="e.g., Welcome to SiteTracker Spark!"
                      />
                    </div>
                    <div>
                      <Label>Email Content</Label>
                      <Card className="mt-2">
                        <CardContent className="p-4">
                          <div className="border rounded-lg">
                            <div className="flex flex-wrap gap-2 p-2 border-b">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  editor
                                    ?.chain()
                                    .focus()
                                    .toggleHeading({ level: 1 })
                                    .run()
                                }
                                className={
                                  editor?.isActive('heading', { level: 1 })
                                    ? 'bg-accent'
                                    : ''
                                }
                              >
                                <Heading1 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  editor
                                    ?.chain()
                                    .focus()
                                    .toggleHeading({ level: 2 })
                                    .run()
                                }
                                className={
                                  editor?.isActive('heading', { level: 2 })
                                    ? 'bg-accent'
                                    : ''
                                }
                              >
                                <Heading2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  editor
                                    ?.chain()
                                    .focus()
                                    .toggleUnderline()
                                    .run()
                                }
                                className={
                                  editor?.isActive('underline')
                                    ? 'bg-accent'
                                    : ''
                                }
                              >
                                <Underline className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  editor
                                    ?.chain()
                                    .focus()
                                    .toggleBlockquote()
                                    .run()
                                }
                                className={
                                  editor?.isActive('blockquote')
                                    ? 'bg-accent'
                                    : ''
                                }
                              >
                                <TextQuote className="h-4 w-4" />
                              </Button>
                              <div className="flex items-center gap-2">
                                <Palette className="h-4 w-4" />
                                <Input
                                  type="color"
                                  className="h-8 w-8 p-0 border-none"
                                  onChange={(e) =>
                                    editor
                                      ?.chain()
                                      .focus()
                                      .setColor(e.target.value)
                                      .run()
                                  }
                                />
                              </div>
                            </div>
                            <div className="p-4 min-h-[300px] prose prose-sm max-w-none">
                              <EditorContent editor={editor} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <p className="text-sm text-muted-foreground mt-2">
                        Available variables: {`{{name}}`}, {`{{company}}`},{' '}
                        {`{{reset_link}}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingTemplate(false)
                        setSelectedTemplate(null)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button>
                      {selectedTemplate ? 'Update Template' : 'Create Template'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
