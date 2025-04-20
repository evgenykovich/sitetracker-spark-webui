'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ContractorForm } from '@/components/contractors/contractor-form'
import ContractorsService, { Contractor } from '@/lib/services/contractors'

export default function EditContractorPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [contractor, setContractor] = useState<Contractor | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchContractor() {
      try {
        setIsLoading(true)
        const data = await ContractorsService.getContractor(id as string)

        setContractor(data)
      } catch (error) {
        console.error('Failed to load contractor:', error)
        toast({
          title: 'Error',
          description: 'Failed to load contractor details.',
          variant: 'destructive',
        })
        router.push('/contractors')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchContractor()
    }
  }, [id, router, toast])

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/contractors')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Edit Contractor</h1>
            <p className="text-sm text-muted-foreground">
              Update contractor information
            </p>
          </div>
        </div>
      </div>

      {!isLoading && contractor && (
        <ContractorForm mode="edit" initialData={contractor} />
      )}
    </DashboardLayout>
  )
}
