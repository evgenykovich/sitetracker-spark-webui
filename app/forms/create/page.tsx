'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/layout'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { FormEditor } from '@/components/salesforce/form-editor'
import { SalesforceFormField } from '@/lib/services/salesforce'
import ContractorsService from '@/lib/services/contractors'
import { Loader2 } from 'lucide-react'

// Sample fields with required properties
const SAMPLE_FIELDS: SalesforceFormField[] = [
  {
    Id: 'field1',
    Name: 'Project Name',
    Label__c: 'Project Name',
    Help_Text__c: 'Enter the name of the project',
    Required__c: true,
    Type__c: 'Text',
    Section: {
      name: 'Project Details',
      description: 'Basic project information',
    },
    Order__c: 1,
    Metadata: {
      requiredUploads: 0,
      photoValidationChecklist: null,
      status: null,
      value: null,
      itemType: null,
    },
    _rawSalesforceData: {},
  },
  {
    Id: 'field2',
    Name: 'Project Description',
    Label__c: 'Description',
    Help_Text__c: 'Provide a detailed description of the project',
    Required__c: false,
    Type__c: 'Text Area',
    Section: {
      name: 'Project Details',
      description: 'Basic project information',
    },
    Order__c: 2,
    Metadata: {
      requiredUploads: 0,
      photoValidationChecklist: null,
      status: null,
      value: null,
      itemType: null,
    },
    _rawSalesforceData: {},
  },
  {
    Id: 'field3',
    Name: 'Start Date',
    Label__c: 'Start Date',
    Help_Text__c: 'When will the project start?',
    Required__c: true,
    Type__c: 'Date',
    Section: { name: 'Timeline', description: 'Project timeline information' },
    Order__c: 1,
    Metadata: {
      requiredUploads: 0,
      photoValidationChecklist: null,
      status: null,
      value: null,
      itemType: null,
    },
    _rawSalesforceData: {},
  },
  {
    Id: 'field4',
    Name: 'End Date',
    Label__c: 'End Date',
    Help_Text__c: 'When is the expected completion date?',
    Required__c: true,
    Type__c: 'Date',
    Section: { name: 'Timeline', description: 'Project timeline information' },
    Order__c: 2,
    Metadata: {
      requiredUploads: 0,
      photoValidationChecklist: null,
      status: null,
      value: null,
      itemType: null,
    },
    _rawSalesforceData: {},
  },
  {
    Id: 'field5',
    Name: 'Budget',
    Label__c: 'Budget',
    Help_Text__c: 'What is the total budget for this project?',
    Required__c: true,
    Type__c: 'Currency',
    Section: { name: 'Financial', description: 'Financial information' },
    Order__c: 1,
    Metadata: {
      requiredUploads: 0,
      photoValidationChecklist: null,
      status: null,
      value: null,
      itemType: null,
    },
    _rawSalesforceData: {},
  },
]

export default function CreateFormPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [contractors, setContractors] = useState<
    { id: string; name: string }[]
  >([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchContractors() {
      try {
        setIsLoading(true)
        const contractorsData = await ContractorsService.getContractors({})

        // Format contractors for the dropdown
        const formattedContractors = contractorsData.map((contractor) => ({
          id: contractor.id,
          name: `${contractor.firstName} ${contractor.lastName}${
            contractor.companyName ? ` (${contractor.companyName})` : ''
          }`,
        }))

        setContractors(formattedContractors)
      } catch (error) {
        console.error('Failed to load contractors:', error)
        toast({
          title: 'Warning',
          description:
            'Could not load contractors. You can still create a form.',
          variant: 'default',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchContractors()
  }, [toast])

  const handleSaveForm = async (formData: {
    name: string
    description: string
    selectedFields: string[]
    assignedContractor?: string
  }) => {
    try {
      // In a real app, you would call an API to save the form
      console.log('Form data saved:', formData)

      // Show success message
      toast({
        title: 'Form created successfully',
        description: `Form "${formData.name}" has been created and sent to the contractor.`,
      })

      // Navigate back to forms list
      router.push('/forms')
    } catch (error) {
      console.error('Error saving form:', error)
      toast({
        title: 'Error creating form',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col space-y-6 p-6">
          <PageHeader
            title="Create New Form"
            description="Create a new form and assign it to a contractor."
          />
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6 p-6">
        <PageHeader
          title="Create New Form"
          description="Create a new form and assign it to a contractor."
        />

        <Card>
          <CardContent className="p-6">
            <FormEditor
              fields={SAMPLE_FIELDS}
              contractors={contractors}
              onSave={handleSaveForm}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
