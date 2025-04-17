'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { VirtuosoGrid } from 'react-virtuoso'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import {
  CalendarDays,
  ChevronRight,
  ListFilter,
  X,
  Info,
  AlertCircle,
} from 'lucide-react'
import SalesforceService, {
  SalesforceForm,
  SalesforceFormField,
} from '@/lib/services/salesforce'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DynamicFormField } from './dynamic-form-field'
import { Checkbox } from '@/components/ui/checkbox'

type SortConfig = {
  field: keyof SalesforceForm
  order: 'asc' | 'desc'
  priority: number
}

interface FormData {
  [key: string]: string | boolean
}

interface SalesforceFormBuilderProps {
  fields: SalesforceFormField[]
  onSubmit?: (data: FormData) => void
  isLoading?: boolean
  mode?: 'edit' | 'select' // 'select' mode for supervisors to choose fields
  onFieldSelect?: (fieldId: string, selected: boolean) => void
  selectedFields?: string[] // Array of selected field IDs
}

interface GroupedFields {
  [sectionName: string]: {
    description: string | null
    subsections: {
      [subsectionName: string]: {
        description: string | null
        fields: SalesforceFormField[]
      }
    }
    fields: SalesforceFormField[]
  }
}

export function SalesforceForms() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [forms, setForms] = useState<SalesforceForm[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<keyof SalesforceForm>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    const loadForms = async () => {
      setIsLoading(true)
      try {
        const data = await SalesforceService.getForms()
        // Ensure createdDate is properly formatted
        const formattedData = data.map((form) => ({
          ...form,
          createdDate: form.createdDate || undefined,
        }))
        setForms(formattedData)
      } catch (error) {
        toast({
          title: 'Error loading forms',
          description: 'Please try again later',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadForms()
  }, [toast])

  const filteredAndSortedForms = useMemo(() => {
    console.log('Filtering and sorting forms:', { sortField, sortOrder })

    let result = [...forms]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (form) =>
          (form.name || '').toLowerCase().includes(query) ||
          (form.description || '').toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((form) => form.status === statusFilter)
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortField === 'createdDate') {
        const aDate = a.createdDate ? new Date(a.createdDate) : new Date(0)
        const bDate = b.createdDate ? new Date(b.createdDate) : new Date(0)
        console.log('Comparing dates:', {
          a: a.createdDate,
          b: b.createdDate,
          aDate: aDate.toISOString(),
          bDate: bDate.toISOString(),
        })
        return sortOrder === 'asc'
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime()
      }

      // Default string comparison for other fields
      const aValue = String(a[sortField] || '').toLowerCase()
      const bValue = String(b[sortField] || '').toLowerCase()
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    })

    return result
  }, [forms, searchQuery, statusFilter, sortField, sortOrder])

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(
      forms.map((form) => form.status || '').filter(Boolean)
    )
    return ['all', ...Array.from(statuses)] as const
  }, [forms])

  const renderFormCard = (form: SalesforceForm) => (
    <Card
      key={form.id}
      className="transition-all duration-200 hover:border-primary cursor-pointer"
      onClick={() => router.push(`/forms/${form.id}`)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-medium line-clamp-2">
              {form.name || 'Untitled Form'}
            </h4>
            {form.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {form.description}
              </p>
            )}
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge
            variant={
              form.status === 'Active'
                ? 'default'
                : form.status === 'Draft'
                ? 'secondary'
                : 'outline'
            }
          >
            {form.status || 'Unknown'}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="mr-1 h-4 w-4" />
            {form.createdDate
              ? new Date(form.createdDate).toLocaleDateString()
              : 'No date'}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return (
      <Card className="relative min-h-[760px] border-none shadow-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-primary" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="relative h-[760px] overflow-hidden">
      <CardHeader className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 pb-4">
        <CardTitle className="text-xl">Salesforce Forms</CardTitle>
        <CardDescription>
          View and manage your Salesforce forms
          {filteredAndSortedForms.length > 0 && (
            <span className="text-muted-foreground">
              {' '}
              • {filteredAndSortedForms.length} total
            </span>
          )}
        </CardDescription>
        <div className="flex items-center space-x-2 mt-4">
          <div className="flex-1">
            <Input
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <div className="flex items-center">
                  <ListFilter className="mr-2 h-4 w-4" />
                  <span>Status</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={sortField}
              onValueChange={(value) =>
                setSortField(value as keyof SalesforceForm)
              }
            >
              <SelectTrigger className="w-[130px]">
                <div className="flex items-center">
                  <ListFilter className="mr-2 h-4 w-4" />
                  <span>Sort By</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="createdDate">Created Date</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}
            >
              <SelectTrigger className="w-[130px]">
                <div className="flex items-center">
                  <ListFilter className="mr-2 h-4 w-4" />
                  <span>Order</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 overflow-y-auto h-[calc(100%-8rem)] absolute inset-x-0 bottom-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedForms.map(renderFormCard)}
        </div>
      </CardContent>
    </Card>
  )
}

export function SalesforceFormBuilder({
  fields,
  onSubmit,
  isLoading = false,
  mode = 'edit',
  onFieldSelect,
  selectedFields = [],
}: SalesforceFormBuilderProps) {
  const [formData, setFormData] = useState<FormData>({})

  const groupedFields = useMemo(() => {
    const grouped: GroupedFields = {}

    const sortedFields = [...fields].sort(
      (a, b) => (a.Order__c || 0) - (b.Order__c || 0)
    )

    sortedFields.forEach((field) => {
      const sectionName = field.Section.name || 'General'
      const subsectionName = field.Section.subsection?.name || ''

      if (!grouped[sectionName]) {
        grouped[sectionName] = {
          description: field.Section.description,
          subsections: {},
          fields: [],
        }
      }

      if (subsectionName) {
        if (!grouped[sectionName].subsections[subsectionName]) {
          grouped[sectionName].subsections[subsectionName] = {
            description: field.Section.subsection?.description || null,
            fields: [],
          }
        }
        grouped[sectionName].subsections[subsectionName].fields.push(field)
      } else {
        grouped[sectionName].fields.push(field)
      }
    })

    return grouped
  }, [fields])

  const handleFieldChange = (fieldId: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  const getFieldStatus = (field: SalesforceFormField) => {
    if (!formData[field.Id] && field.Required__c) {
      return 'required'
    }
    if (formData[field.Id]) {
      return 'completed'
    }
    return 'optional'
  }

  const renderFieldCard = (field: SalesforceFormField) => {
    const status = getFieldStatus(field)

    return (
      <Card
        key={field.Id}
        className={cn(
          'transition-all duration-200',
          mode === 'select' && 'hover:border-primary cursor-pointer',
          selectedFields.includes(field.Id) && 'border-primary bg-primary/5'
        )}
        onClick={
          mode === 'select'
            ? () =>
                onFieldSelect?.(field.Id, !selectedFields.includes(field.Id))
            : undefined
        }
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              {mode === 'select' && (
                <Checkbox
                  checked={selectedFields.includes(field.Id)}
                  className="mb-2"
                  onCheckedChange={(checked) =>
                    onFieldSelect?.(field.Id, checked as boolean)
                  }
                />
              )}
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium">{field.Label__c}</h4>
                <Badge
                  variant={
                    status === 'completed'
                      ? 'secondary'
                      : status === 'required'
                      ? 'destructive'
                      : 'outline'
                  }
                  className="text-xs"
                >
                  {status}
                </Badge>
              </div>
              {field.description && (
                <p className="text-sm text-muted-foreground">
                  {field.description}
                </p>
              )}
            </div>
            {field.Required__c && (
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <DynamicFormField
              field={field}
              value={formData[field.Id]}
              onChange={(value) => handleFieldChange(field.Id, value)}
              readOnly={mode === 'select'}
            />
            {field.Metadata && field.Item_Type__c !== 'Photo/File' && (
              <div className="text-sm text-muted-foreground space-y-1">
                {field.Metadata.status && (
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <span>Status: {field.Metadata.status}</span>
                  </div>
                )}
                {field.Metadata.requiredUploads > 0 && (
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <span>
                      Required Uploads: {field.Metadata.requiredUploads}
                    </span>
                  </div>
                )}
                {field.Validation__c && (
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <span>Validation: {field.Validation__c}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderSection = (
    sectionName: string,
    section: GroupedFields[string],
    level: 'section' | 'subsection' = 'section'
  ) => (
    <div key={sectionName} className="space-y-4">
      <div
        className={cn(
          'sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          level === 'section' ? 'py-4' : 'py-2'
        )}
      >
        <h2
          className={cn(
            'font-semibold',
            level === 'section' ? 'text-lg' : 'text-md'
          )}
        >
          {level === 'section' ? section.description : sectionName}
        </h2>
        {level === 'subsection' && section.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {section.description}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {section.fields.map(renderFieldCard)}
      </div>

      {Object.entries(section.subsections).map(([subsectionName, subsection]) =>
        renderSection(
          subsectionName,
          { ...section, fields: subsection.fields },
          'subsection'
        )
      )}
    </div>
  )

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>
          {mode === 'select' ? 'Select Form Fields' : 'Form Details'}
        </CardTitle>
        <CardDescription>
          {mode === 'select'
            ? 'Choose the fields to include in the contractor form'
            : 'Fill in the required information'}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[600px] overflow-y-auto pr-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.entries(groupedFields).map(([sectionName, section]) =>
            renderSection(sectionName, section)
          )}
        </form>
      </CardContent>
      <CardFooter className="border-t bg-card">
        {mode === 'select' ? (
          <div className="flex justify-between items-center w-full">
            <p className="text-sm text-muted-foreground">
              {selectedFields.length} fields selected
            </p>
            <Button
              type="button"
              disabled={selectedFields.length === 0}
              onClick={() => onSubmit?.({})}
            >
              Create Contractor Form
            </Button>
          </div>
        ) : (
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            onClick={handleSubmit}
          >
            {isLoading ? 'Submitting...' : 'Submit Form'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
