import React from 'react'
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
  const [{ isOver, canDrop }, dropRef] = useDrop<
    DragItem,
    void,
    { isOver: boolean; canDrop: boolean }
  >(
    () => ({
      accept: ['source', 'target'] as Identifier[],
      drop: (item) => {
        if (onDrop) {
          onDrop(item)
        } else if (onReorder) {
          if (item.fields) {
            onReorder(item.fields)
          } else if (item.field) {
            onReorder([...fields, item.field])
          }
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [fields, onReorder, onDrop]
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
              key={field.Id}
              field={field}
              mode="target"
              onRemove={onRemove ? () => onRemove(field.Id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}
