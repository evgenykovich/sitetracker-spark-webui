'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserPlus } from 'lucide-react'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import ContractorsService, { Contractor } from '@/lib/services/contractors'

interface ContractorSelectProps {
  value?: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  required?: boolean
  className?: string
}

export function ContractorSelect({
  value,
  onChange,
  label = 'Select Contractor',
  placeholder = 'Choose a contractor',
  required = false,
  className,
}: ContractorSelectProps) {
  const router = useRouter()
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContractors = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await ContractorsService.getContractors({})
        setContractors(data)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load contractors'
        )
        console.error('Error fetching contractors:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContractors()
  }, [])

  // When there are no contractors, show a message with redirect button
  if (!isLoading && contractors.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <CardDescription className="text-center mb-4">
            No contractors found in the system.
          </CardDescription>
          <div className="flex justify-center">
            <Link href="/contractors/new">
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Contractor
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={className}>
        {label && (
          <Label>
            {label}
            {required && <span className="text-destructive"> *</span>}
          </Label>
        )}
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Loading contractors..." />
          </SelectTrigger>
        </Select>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className={className}>
        {label && (
          <Label>
            {label}
            {required && <span className="text-destructive"> *</span>}
          </Label>
        )}
        <Select disabled>
          <SelectTrigger className="border-destructive">
            <SelectValue placeholder="Error loading contractors" />
          </SelectTrigger>
        </Select>
        <p className="text-xs text-destructive mt-1">{error}</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {contractors.map((contractor) => (
            <SelectItem key={contractor.id} value={contractor.id}>
              {contractor.firstName} {contractor.lastName}
              {contractor.companyName ? ` (${contractor.companyName})` : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
