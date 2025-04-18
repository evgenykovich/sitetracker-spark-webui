import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { FormBuilder } from './form-builder'
import { SalesforceFormField } from '@/lib/services/salesforce'
import { cn } from '@/lib/utils'
import {
  Users,
  FileEdit,
  Send,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Info,
  X,
} from 'lucide-react'

interface FormEditorProps {
  fields: SalesforceFormField[]
  contractors?: { id: string; name: string }[] // List of available contractors
  onSave: (formData: {
    name: string
    description: string
    selectedFields: string[]
    assignedContractor?: string
  }) => void
  initialData?: {
    name: string
    description: string
    selectedFields: string[]
    assignedContractor?: string
  }
}

const steps = [
  {
    id: 'fields',
    title: 'Select Fields',
    icon: FileEdit,
    description: 'Choose and arrange form fields',
  },
  {
    id: 'details',
    title: 'Form Details',
    icon: Users,
    description: 'Add form information and assign contractor',
  },
  {
    id: 'review',
    title: 'Review & Send',
    icon: Send,
    description: 'Review form and dispatch to contractor',
  },
] as const

export function FormEditor({
  fields,
  contractors = [],
  onSave,
  initialData,
}: FormEditorProps) {
  const [currentStep, setCurrentStep] =
    useState<(typeof steps)[number]['id']>('fields')
  const [formName, setFormName] = useState(initialData?.name || '')
  const [formDescription, setFormDescription] = useState(
    initialData?.description || ''
  )
  const [selectedFields, setSelectedFields] = useState<SalesforceFormField[]>(
    []
  )
  const [selectedContractor, setSelectedContractor] = useState<string>(
    initialData?.assignedContractor || ''
  )
  const [isSaving, setIsSaving] = useState(false)

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  const handleNext = () => {
    if (isLastStep) {
      handleSave()
    } else {
      setCurrentStep(steps[currentStepIndex + 1].id)
    }
  }

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(steps[currentStepIndex - 1].id)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave({
        name: formName,
        description: formDescription,
        selectedFields: selectedFields.map(
          (field) => field.Id || field.description || ''
        ),
        assignedContractor: selectedContractor,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 'fields':
        return selectedFields.length > 0
      case 'details':
        return formName.trim() !== '' && selectedContractor !== ''
      case 'review':
        return true
      default:
        return false
    }
  }

  console.log('selectedFields', selectedFields)

  return (
    <div className="flex flex-col min-h-[600px]">
      <div className="border-b p-3">
        <div className="flex items-center justify-center w-full max-w-3xl mx-auto px-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2',
                    currentStep === step.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : index < currentStepIndex
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-muted bg-muted text-muted-foreground'
                  )}
                >
                  <step.icon className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-0.5 flex-1 min-w-[140px]">
                  <span className="text-sm font-medium">{step.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {step.description}
                  </span>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-shrink-0 w-24 mx-6">
                  <div
                    className={cn(
                      'h-0.5 w-full',
                      index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 py-6">
        {currentStep === 'fields' && (
          <div className="space-y-4">
            <FormBuilder
              fields={fields}
              mode="select"
              selectedFields={selectedFields.map(
                (f) => f.Id || f.description || ''
              )}
              onFieldSelect={(fieldId, selected) => {
                setSelectedFields((prev) => {
                  if (selected) {
                    // Find the field object that matches the ID
                    const fieldToAdd = fields.find(
                      (f) => (f.Id || f.description) === fieldId
                    )
                    if (fieldToAdd) {
                      return [...prev, fieldToAdd]
                    }
                    return prev
                  } else {
                    // Remove the field with matching ID
                    return prev.filter(
                      (f) => (f.Id || f.description) !== fieldId
                    )
                  }
                })
              }}
            />
          </div>
        )}

        {currentStep === 'details' && (
          <div className="grid grid-cols-2 gap-6">
            {/* Form Details */}
            <div className="space-y-4">
              <div className="grid gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Form Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter form name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter form description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Select Contractor</Label>
                  <Select
                    value={selectedContractor}
                    onValueChange={setSelectedContractor}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a contractor" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractors.map((contractor) => (
                        <SelectItem key={contractor.id} value={contractor.id}>
                          {contractor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Selected Fields */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Selected Fields
                </h3>
                <Badge variant="secondary" className="h-5">
                  {selectedFields.length} fields
                </Badge>
              </div>
              <div className="rounded-lg border p-2">
                {selectedFields.length === 0 ? (
                  <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                    No fields selected
                  </div>
                ) : (
                  <div className="divide-y">
                    {selectedFields.map((field) => (
                      <div
                        key={field.Id}
                        className="flex items-start gap-3 p-3 group"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary flex-shrink-0">
                          {field.Required__c && (
                            <span className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-destructive" />
                          )}
                          <FileEdit className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {field.Label__c ||
                              field.Name ||
                              field.description ||
                              'Untitled Field'}
                          </p>
                          {field.Help_Text__c && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {field.Help_Text__c}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            setSelectedFields((prev) =>
                              prev.filter((f) => f.Id !== field.Id)
                            )
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 'review' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="rounded-lg border p-4 space-y-4">
              <div className="space-y-3">
                <h3 className="text-base font-medium">Form Summary</h3>
                <div className="grid gap-2.5">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground min-w-[100px]">
                      Name:
                    </span>
                    <span className="font-medium">
                      {formName || '(Untitled)'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground min-w-[100px]">
                        Fields:
                      </span>
                      <Badge variant="secondary" className="h-5">
                        {selectedFields.length} selected
                      </Badge>
                    </div>
                    {selectedFields.length > 0 && (
                      <div className="ml-[100px] pl-3 border-l space-y-2">
                        {selectedFields.map((field) => (
                          <div
                            key={field.Id}
                            className="flex items-center gap-2 text-xs"
                          >
                            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary flex-shrink-0">
                              <FileEdit className="h-3 w-3" />
                            </div>
                            <span>
                              {field.Label__c ||
                                field.Name ||
                                field.description ||
                                'Untitled Field'}
                            </span>
                            {field.Required__c && (
                              <Badge
                                variant="destructive"
                                className="h-4 text-[10px]"
                              >
                                Required
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground min-w-[100px]">
                      Contractor:
                    </span>
                    <span className="font-medium">
                      {contractors.find((c) => c.id === selectedContractor)
                        ?.name || 'None'}
                    </span>
                  </div>
                  {formDescription && (
                    <div className="flex gap-3 text-sm">
                      <span className="text-muted-foreground min-w-[100px]">
                        Description:
                      </span>
                      <p className="flex-1">{formDescription}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-md bg-muted p-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Info className="h-4 w-4 flex-shrink-0" />
                  <p className="text-xs">
                    The form will be sent to the selected contractor for
                    completion. They will be notified via email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t pt-6 flex items-center justify-end">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={isFirstStep || isSaving}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button onClick={handleNext} disabled={!isStepValid() || isSaving}>
          {isLastStep ? (
            isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send to Contractor
              </>
            )
          ) : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
