import React, { useCallback } from 'react'
import { useDrop } from 'react-dnd'
import type { Identifier } from 'dnd-core'
import { SalesforceFormField } from '@/lib/services/salesforce'
import { DraggableFormField } from './draggable-form-field'
import { cn } from '@/lib/utils'

interface DroppableZoneProps {
  id: string
  fields: SalesforceFormField[]
  selectedFields?: string[]
  onRemove: (fieldId: string) => void
  onReorder?: (fields: SalesforceFormField[]) => void
  onDrop?: (item: DragItem) => void
}

interface DragItem {
  id: string
  type: 'source' | 'target'
  field: SalesforceFormField
  fields?: SalesforceFormField[]
}

export function DroppableZone({
  id,
  fields,
  selectedFields = [],
  onRemove,
  onReorder,
  onDrop,
}: DroppableZoneProps) {
  // Helper function to get a reliable field identifier
  const getFieldId = useCallback((field: SalesforceFormField): string => {
    return (
      field.Id ||
      field.description ||
      field.Name ||
      'field-' + Math.random().toString(36).substr(2, 9)
    )
  }, [])

  const [{ isOver, canDrop }, dropRef] = useDrop<
    DragItem,
    void,
    { isOver: boolean; canDrop: boolean }
  >(
    () => ({
      accept: ['source', 'target'] as Identifier[],
      drop: (item) => {
        if (onDrop && item.type === 'source') {
          onDrop(item)
        } else if (onReorder && item.type === 'target') {
          if (item.fields) {
            onReorder(item.fields)
          } else if (item.field) {
            // Use getFieldId to check if the field already exists
            if (!fields.some((f) => getFieldId(f) === getFieldId(item.field))) {
              onReorder([...fields, item.field])
            }
          }
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [fields, onReorder, onDrop, getFieldId]
  )

  const isActive = isOver && canDrop

  return (
    <div
      ref={dropRef as unknown as React.LegacyRef<HTMLDivElement>}
      className={cn(
        'min-h-[300px] rounded-lg border-2 border-dashed p-4 transition-all duration-200',
        fields.length === 0 && 'flex items-center justify-center',
        isActive && 'border-primary border-solid scale-[1.02] bg-primary/5'
      )}
    >
      {fields.length === 0 ? (
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            Drop fields here
          </p>
          <p className="text-sm text-muted-foreground/80">
            Drag fields from the left to add them to your form
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {fields.map((field) => (
            <DraggableFormField
              key={getFieldId(field)}
              field={field}
              mode="target"
              onRemove={
                onRemove ? () => onRemove(getFieldId(field)) : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
