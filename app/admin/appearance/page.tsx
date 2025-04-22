'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function AppearancePage() {
  const [isDirty, setIsDirty] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appearance</h1>
        <p className="text-muted-foreground">
          Customize the look and feel of your application
        </p>
      </div>

      <Tabs defaultValue="theme" className="space-y-4">
        <TabsList>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="theme" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>
                Choose the color scheme for your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme Mode</Label>
                <RadioGroup
                  defaultValue="system"
                  className="grid grid-cols-3 gap-4"
                >
                  <Label
                    htmlFor="system"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem
                      value="system"
                      id="system"
                      className="sr-only"
                    />
                    <span>System</span>
                  </Label>
                  <Label
                    htmlFor="light"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem
                      value="light"
                      id="light"
                      className="sr-only"
                    />
                    <span>Light</span>
                  </Label>
                  <Label
                    htmlFor="dark"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem
                      value="dark"
                      id="dark"
                      className="sr-only"
                    />
                    <span>Dark</span>
                  </Label>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Primary Color</Label>
                <Select
                  defaultValue="blue"
                  onValueChange={() => setIsDirty(true)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slate">Slate</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Accent Color</Label>
                <Select
                  defaultValue="purple"
                  onValueChange={() => setIsDirty(true)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select accent color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slate">Slate</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Border Radius</Label>
                <Slider
                  defaultValue={[0.5]}
                  max={1}
                  step={0.1}
                  className="w-[60%]"
                  onValueChange={() => setIsDirty(true)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Typography Settings</CardTitle>
              <CardDescription>
                Customize the typography of your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Primary Font</Label>
                <Select
                  defaultValue="inter"
                  onValueChange={() => setIsDirty(true)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="opensans">Open Sans</SelectItem>
                    <SelectItem value="lato">Lato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Base Font Size</Label>
                <Select
                  defaultValue="16"
                  onValueChange={() => setIsDirty(true)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select base font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="14">14px</SelectItem>
                    <SelectItem value="16">16px</SelectItem>
                    <SelectItem value="18">18px</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Font Weight</Label>
                <Select
                  defaultValue="regular"
                  onValueChange={() => setIsDirty(true)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font weight" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Layout Preferences</CardTitle>
              <CardDescription>
                Customize the layout of your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label>Compact Mode</Label>
                <Switch onCheckedChange={() => setIsDirty(true)} />
              </div>

              <div className="flex items-center justify-between">
                <Label>Show Breadcrumbs</Label>
                <Switch
                  defaultChecked
                  onCheckedChange={() => setIsDirty(true)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Sticky Header</Label>
                <Switch
                  defaultChecked
                  onCheckedChange={() => setIsDirty(true)}
                />
              </div>

              <div className="space-y-2">
                <Label>Container Width</Label>
                <Select
                  defaultValue="max"
                  onValueChange={() => setIsDirty(true)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select container width" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small (640px)</SelectItem>
                    <SelectItem value="md">Medium (768px)</SelectItem>
                    <SelectItem value="lg">Large (1024px)</SelectItem>
                    <SelectItem value="xl">Extra Large (1280px)</SelectItem>
                    <SelectItem value="max">Maximum Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Branding Settings</CardTitle>
              <CardDescription>
                Customize your application branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Application Name</Label>
                <Input
                  placeholder="Enter application name"
                  defaultValue="SiteTracker Spark"
                  onChange={() => setIsDirty(true)}
                />
              </div>

              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                    <span className="text-sm text-muted-foreground text-center">
                      Upload Logo
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Favicon</Label>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">
                      Upload
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button disabled={!isDirty}>Save Changes</Button>
      </div>
    </div>
  )
}
