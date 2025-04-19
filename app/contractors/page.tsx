'use client'

import { useState, useEffect } from 'react'
import { ContractorsList } from '@/components/contractors/contractors-list'
import { ContractorsFilter } from '@/components/contractors/contractors-filter'
import { Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { UserPlus } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'
import ContractorsService, { Contractor } from '@/lib/services/contractors'
import Image from 'next/image'
import contractorBgImage from '@/public/images/contractor-bg.jpg'

export default function ContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter states
  const [name, setName] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchContractors()
  }, [name])

  const fetchContractors = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Create filter object
      const filters: {
        name?: string
      } = {}

      if (name) filters.name = name

      // Use the ContractorsService to fetch contractors
      const data = await ContractorsService.getContractors(filters)

      // Apply client-side filters for specialty and status
      let filteredData = [...data]

      if (specialtyFilter && specialtyFilter !== 'all') {
        filteredData = filteredData.filter((contractor) =>
          contractor.specialties?.some(
            (spec) => spec.toLowerCase() === specialtyFilter.toLowerCase()
          )
        )
      }

      if (statusFilter && statusFilter !== 'all') {
        filteredData = filteredData.filter(
          (contractor) => contractor.status?.toUpperCase() === statusFilter
        )
      }

      setContractors(filteredData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (
    filterType: 'name' | 'specialty' | 'status',
    value: string
  ) => {
    switch (filterType) {
      case 'name':
        setName(value)
        break
      case 'specialty':
        setSpecialtyFilter(value)
        // If we change specialty, filter client-side without refetching
        applyClientSideFilters(value, statusFilter)
        break
      case 'status':
        setStatusFilter(value)
        // If we change status, filter client-side without refetching
        applyClientSideFilters(specialtyFilter, value)
        break
    }
  }

  // Apply client-side filters to avoid unnecessary API calls
  const applyClientSideFilters = (specialty: string, status: string) => {
    setIsLoading(true)

    setTimeout(() => {
      try {
        // Start with the original data from the API fetch
        let filteredData = [...contractors]

        // Apply name filter if exists (might be already applied from API)
        if (name) {
          filteredData = filteredData.filter(
            (contractor) =>
              `${contractor.firstName} ${contractor.lastName}`
                .toLowerCase()
                .includes(name.toLowerCase()) ||
              contractor.companyName?.toLowerCase().includes(name.toLowerCase())
          )
        }

        // Apply specialty filter
        if (specialty && specialty !== 'all') {
          filteredData = filteredData.filter((contractor) =>
            contractor.specialties?.some(
              (spec) => spec.toLowerCase() === specialty.toLowerCase()
            )
          )
        }

        // Apply status filter
        if (status && status !== 'all') {
          filteredData = filteredData.filter(
            (contractor) => contractor.status?.toUpperCase() === status
          )
        }

        setContractors(filteredData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }, 100) // Small timeout to show loading state for better UX
  }

  const clearFilters = () => {
    setName('')
    setSpecialtyFilter('all')
    setStatusFilter('all')
    fetchContractors()
  }

  return (
    <DashboardLayout>
      <div className="relative">
        {/* Content with higher z-index */}
        <div className="relative z-10 flex flex-col space-y-6 p-6">
          <PageHeader
            title="Contractors"
            description="View and manage contractors for your projects."
            action={{
              label: 'Add Contractor',
              href: '/contractors/new',
              icon: UserPlus,
            }}
          />

          <ContractorsFilter
            name={name}
            specialty={specialtyFilter}
            status={statusFilter}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              {error}
            </div>
          ) : (
            <ContractorsList contractors={contractors} />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
