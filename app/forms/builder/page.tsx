'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/layout'
import { useToast } from '@/hooks/use-toast'
import { FormEditor } from '@/components/salesforce/form-editor'
import SalesforceService, {
  SalesforceFormField,
} from '@/lib/services/salesforce'

export default function FormBuilderPage() {
  const [fields, setFields] = useState<SalesforceFormField[]>([])
  const [contractors, setContractors] = useState<
    { id: string; name: string }[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const [fetchedFields, fetchedContractors] = await Promise.all([
          SalesforceService.getAllFields(),
          SalesforceService.getContractors(), // You'll need to add this method to your service
        ])
        setFields(fetchedFields)
        setContractors(fetchedContractors)
      } catch (error) {
        console.error('Failed to load data:', error)
        toast({
          title: 'Error',
          description:
            error instanceof Error
              ? error.message
              : 'Failed to load required data',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSave = async (formData: {
    name: string
    description: string
    selectedFields: string[]
    assignedContractor?: string
  }) => {
    try {
      // TODO: Implement form creation and assignment in your service
      await SalesforceService.createForm({
        name: formData.name,
        description: formData.description,
        fieldIds: formData.selectedFields,
        contractorId: formData.assignedContractor,
      })

      toast({
        title: 'Success',
        description: 'Form created and assigned successfully',
      })

      // Navigate back to forms list
      router.push('/forms')
    } catch (error) {
      console.error('Failed to create form:', error)
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to create form',
        variant: 'destructive',
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <FormEditor
            fields={fields}
            contractors={contractors}
            onSave={handleSave}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
