import React from 'react'
import { useDrag } from 'react-dnd'
import type { Identifier } from 'dnd-core'
import { SalesforceFormField } from '@/lib/services/salesforce'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import {
  GripVertical,
  X,
  Image,
  FileText,
  Calendar,
  CheckSquare,
  List,
  Mail,
  Phone as PhoneIcon,
  Type,
  Hash,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const fieldTypeIcons = {
  Text: Type,
  Picklist: List,
  Number: Hash,
  Date: Calendar,
  Checkbox: CheckSquare,
  Image: Image,
  File: FileText,
  Email: Mail,
  Phone: PhoneIcon,
  Photo: Image,
  'Photo/File': Image,
} as const

interface DraggableFormFieldProps {
  field: SalesforceFormField
  mode: 'source' | 'target'
  onRemove?: () => void
  isSelected?: boolean
}

interface DragItem {
  id: string
  type: 'source' | 'target'
  field: SalesforceFormField
}

export function DraggableFormField({
  field,
  mode,
  onRemove,
  isSelected,
}: DraggableFormFieldProps) {
  const [{ isDragging }, dragRef] = useDrag<
    DragItem,
    void,
    { isDragging: boolean }
  >(() => ({
    type: mode as Identifier,
    item: { id: field.Id, type: mode, field },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const isPhotoField =
    field.Item_Type__c === 'Photo/File' ||
    field.Metadata?.itemType === 'Photo/File'
  const section = field.Section?.name || 'General'
  const subsection =
    field.Section?.subsection?.name !== 'Not Specified'
      ? field.Section?.subsection?.name
      : null

  // Get the icon component for the field type
  const FieldIcon = field.Item_Type__c
    ? fieldTypeIcons[field.Item_Type__c] || Info
    : Info

  return (
    <div
      ref={dragRef as unknown as React.LegacyRef<HTMLDivElement>}
      className={cn(
        'relative touch-none group',
        isDragging && 'opacity-50',
        isSelected && 'opacity-50',
        mode === 'source' && 'cursor-grab active:cursor-grabbing',
        mode === 'target' && 'cursor-move'
      )}
    >
      <Card
        className={cn(
          'relative border transition-all duration-200',
          'hover:shadow-md hover:border-primary/20',
          'before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-b before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity',
          'hover:before:opacity-100',
          mode === 'target' && 'bg-card/50'
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 min-w-0">
              {mode === 'target' && (
                <GripVertical className="h-4 w-4 text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              )}
              <div className="min-w-0">
                {/* Title and Icon */}
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary flex-shrink-0">
                    <FieldIcon className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-medium leading-none truncate">
                    {field.Label__c ||
                      field.Name ||
                      field.description ||
                      'Untitled Field'}
                  </h4>
                </div>

                {/* Section Info */}
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3 w-3" />
                    <p className="text-xs font-medium">{section}</p>
                  </div>
                  {subsection && (
                    <>
                      <span className="text-muted-foreground/40">•</span>
                      <p className="text-xs">{subsection}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Status Badges and Remove Button */}
            <div className="flex items-start gap-2">
              <div className="flex flex-col items-end gap-1.5">
                {field.Required__c && (
                  <Badge variant="destructive" className="h-5 px-1.5">
                    Required
                  </Badge>
                )}
                {field.Metadata?.requiredUploads > 0 && (
                  <Badge variant="secondary" className="h-5">
                    {field.Metadata.requiredUploads} required
                  </Badge>
                )}
                {field.Metadata?.status && (
                  <Badge
                    variant={
                      field.Metadata.status === 'Complete'
                        ? 'secondary'
                        : 'outline'
                    }
                    className={cn(
                      'h-5',
                      field.Metadata.status === 'Complete' &&
                        'bg-green-100 text-green-700 hover:bg-green-100/80'
                    )}
                  >
                    {field.Metadata.status}
                  </Badge>
                )}
              </div>
              {mode === 'target' && onRemove && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1 z-10"
                  onClick={onRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
