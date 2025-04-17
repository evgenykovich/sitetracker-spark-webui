'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DynamicFormField } from './dynamic-form-field'
import { SalesforceFormField } from '@/lib/services/salesforce'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Info, CheckCircle2, AlertCircle } from 'lucide-react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Input } from '@/components/ui/input'
import { Search, GripVertical } from 'lucide-react'
import { DraggableFormField } from './draggable-form-field'
import { DroppableZone } from '@/components/salesforce/droppable-zone'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface FormData {
  [key: string]: string | boolean | undefined
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
    description?: string | null
    subsections?: Record<
      string,
      {
        description?: string | null
        fields: SalesforceFormField[]
      }
    >
    fields: SalesforceFormField[]
  }
}

function SourceFieldCard({
  field,
  isSelected,
}: {
  field: SalesforceFormField
  isSelected: boolean
}) {
  return (
    <DraggableFormField field={field} mode="source" isSelected={isSelected} />
  )
}

export function FormBuilder({
  fields: initialFields,
  onSubmit,
  isLoading,
  mode = 'edit',
  onFieldSelect,
  selectedFields = [],
}: SalesforceFormBuilderProps) {
  const [fields, setFields] = useState<SalesforceFormField[]>(initialFields)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState<FormData>({})
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  const filteredFields = useMemo(() => {
    return fields.filter((field) => {
      const searchTerms = searchQuery.toLowerCase().split(' ')
      return searchTerms.every(
        (term) =>
          field.Label__c.toLowerCase().includes(term) ||
          (field.Help_Text__c?.toLowerCase() || '').includes(term)
      )
    })
  }, [fields, searchQuery])

  const handleFieldChange = (fieldId: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))

    if (value) {
      setCompletedFields((prev) => new Set(Array.from(prev).concat(fieldId)))
    } else {
      setCompletedFields((prev) => {
        const newSet = new Set(prev)
        newSet.delete(fieldId)
        return newSet
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  const getFieldStatus = (
    field: SalesforceFormField
  ): 'required' | 'completed' | 'optional' => {
    const value = formData[field.Id]
    if (!value && field.Required__c) {
      return 'required'
    }
    if (value !== undefined) {
      return 'completed'
    }
    return 'optional'
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col gap-6">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Source fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available Fields</h3>
            <div className="space-y-2">
              {filteredFields.map((field) => (
                <SourceFieldCard
                  key={field.Id}
                  field={field}
                  isSelected={selectedFields.includes(field.Id)}
                />
              ))}
            </div>
          </div>

          {/* Drop zone */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Form Fields</h3>
            <DroppableZone
              id="form-fields"
              fields={fields.filter((f) => selectedFields.includes(f.Id))}
              selectedFields={selectedFields}
              onRemove={(fieldId) => {
                if (mode === 'select' && onFieldSelect) {
                  onFieldSelect(fieldId, false)
                }
              }}
              onReorder={(newFields) => {
                if (mode === 'select' && onFieldSelect) {
                  // Remove all fields first
                  selectedFields.forEach((id) => onFieldSelect(id, false))
                  // Then add them back in the new order
                  newFields.forEach((field) => onFieldSelect(field.Id, true))
                }
              }}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  )
}
