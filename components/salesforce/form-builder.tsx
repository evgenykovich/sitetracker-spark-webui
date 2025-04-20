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
  // Get a field identifier even if Id is undefined
  const fieldId = field.Id || field.description
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

  // Helper function to get a reliable field identifier
  const getFieldId = useCallback((field: SalesforceFormField): string => {
    return (
      field.Id ||
      field.description ||
      field.Name ||
      'field-' + Math.random().toString(36).substr(2, 9)
    )
  }, [])

  const filteredFields = useMemo(() => {
    return fields.filter((field) => {
      const searchTerms = searchQuery.toLowerCase().split(' ')
      return searchTerms.every(
        (term) =>
          field.Label__c.toLowerCase().includes(term) ||
          (field.Help_Text__c?.toLowerCase() || '').includes(term) ||
          (field.description?.toLowerCase() || '').includes(term)
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

  // Handle dropping a field from the source to the target
  const handleDrop = useCallback(
    (item: { id: string; type: string; field: SalesforceFormField }) => {
      console.log('Drop event:', item)

      // Only handle source items (from the available fields list)
      if (item.type === 'source' && mode === 'select' && onFieldSelect) {
        // Get field identifier using our helper function
        const fieldId = getFieldId(item.field)
        console.log('Handling drop of source item:', fieldId)

        // Only add the field if it's not already selected
        if (!selectedFields.includes(fieldId)) {
          console.log('Adding field to selection:', fieldId)
          onFieldSelect(fieldId, true)
        } else {
          console.log('Field already selected, ignoring:', fieldId)
        }
      }
    },
    [mode, onFieldSelect, selectedFields, getFieldId]
  )

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
          <div className="space-y-4 ">
            <h3 className="text-lg font-semibold">Available Fields</h3>
            <div className="space-y-2 h-[380px] overflow-y-auto">
              {filteredFields.map((field) => (
                <SourceFieldCard
                  key={getFieldId(field)}
                  field={field}
                  isSelected={selectedFields.includes(getFieldId(field))}
                />
              ))}
            </div>
          </div>

          {/* Drop zone */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Form Fields</h3>
            <DroppableZone
              id="form-fields"
              fields={fields.filter((f) =>
                selectedFields.includes(getFieldId(f))
              )}
              selectedFields={selectedFields}
              onDrop={handleDrop}
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
                  newFields.forEach((field) =>
                    onFieldSelect(getFieldId(field), true)
                  )
                }
              }}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  )
}
