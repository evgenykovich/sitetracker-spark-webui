'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { FormEditor } from '@/components/salesforce/form-editor'
import SalesforceService, {
  SalesforceFormField,
} from '@/lib/services/salesforce'

export default function SalesforceFormPage() {
  const [fields, setFields] = useState<SalesforceFormField[]>([])
  const [contractors, setContractors] = useState<
    { id: string; name: string }[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const { formId } = useParams()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const fields = await SalesforceService.getFormFields(formId as string)

        // Mock contractors data
        const mockContractors = [
          { id: '1', name: 'John Contractor' },
          { id: '2', name: 'Sarah Builder' },
          { id: '3', name: 'Mike Construction' },
        ]

        setFields(fields)
        setContractors(mockContractors)
      } catch (error) {
        console.error('Failed to load data:', error)
        toast({
          title: 'Error',
          description:
            error instanceof Error ? error.message : 'Failed to load form data',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (formId) {
      fetchData()
    }
  }, [formId])

  const handleSave = async (formData: {
    name: string
    description: string
    selectedFields: string[]
    assignedContractor?: string
  }) => {
    try {
      // Mock save - we'll implement the actual save later
      console.log('Form data to save:', formData)

      toast({
        title: 'Success',
        description: 'Form updated successfully',
      })

      router.push('/forms')
    } catch (error) {
      console.error('Failed to update form:', error)
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update form',
        variant: 'destructive',
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="relative flex flex-col min-h-0 flex-1">
        <div className="sticky top-[54px] z-30 bg-white">
          <div className="flex items-center justify-between py-4 border-b">
            <div className="flex items-center space-x-4">
              <Link href="/forms">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold">Edit Form</h1>
                <p className="text-sm text-muted-foreground">
                  Modify form details and contractor assignment
                </p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : fields.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-lg font-medium">No Fields Found</div>
            <p className="text-sm text-muted-foreground">
              This form does not have any fields configured
            </p>
          </div>
        ) : (
          <FormEditor
            fields={fields}
            contractors={contractors}
            onSave={handleSave}
            initialData={{
              name: '',
              description: '',
              selectedFields: fields.map((f) => f.Id),
            }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
