import { useState, useCallback } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { SalesforceFormField } from '@/lib/services/salesforce'
import { DraggableFormField } from './draggable-form-field'
import { DroppableZone } from './droppable-zone'

interface ContractorFormBuilderProps {
  fields: SalesforceFormField[]
  onSave: (selectedFields: SalesforceFormField[]) => void
}

export function ContractorFormBuilder({
  fields,
  onSave,
}: ContractorFormBuilderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFields, setSelectedFields] = useState<SalesforceFormField[]>(
    []
  )

  const handleRemoveField = useCallback((fieldId: string) => {
    setSelectedFields((prev) => prev.filter((field) => field.Id !== fieldId))
  }, [])

  const handleDrop = useCallback(
    (item: { id: string; type: string; field: SalesforceFormField }) => {
      if (item.type === 'source') {
        const field = fields.find((f) => f.Id === item.id)
        if (field && !selectedFields.some((f) => f.Id === field.Id)) {
          setSelectedFields((prev) => [...prev, field])
        }
      }
    },
    [fields, selectedFields]
  )

  const filteredFields = fields.filter((field) => {
    console.log(field)
    const searchTerms = searchQuery.toLowerCase().split(' ')
    return searchTerms.every(
      (term) =>
        field.Label__c.toLowerCase().includes(term) ||
        field.Help_Text__c?.toLowerCase().includes(term)
    )
  })

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-2 gap-6 h-full">
        {/* Source Fields */}
        <Card className="overflow-hidden flex flex-col">
          <CardHeader className="border-b pb-4">
            <CardTitle>Available Fields</CardTitle>
            <CardDescription>
              Drag fields to create contractor form
            </CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search fields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredFields.map((field) => (
                <DraggableFormField
                  key={field.Id}
                  field={field}
                  mode="source"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Drop Zone */}
        <Card className="overflow-hidden flex flex-col">
          <CardHeader className="border-b pb-4">
            <CardTitle>Contractor Form</CardTitle>
            <CardDescription>
              Selected fields for the contractor form
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-4">
            <DroppableZone
              id="contractor-form"
              fields={selectedFields}
              onRemove={handleRemoveField}
              onDrop={handleDrop}
              selectedFields={selectedFields.map((f) => f.Id)}
            />
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => onSave(selectedFields)}
                disabled={selectedFields.length === 0}
              >
                Create Contractor Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DndProvider>
  )
}
