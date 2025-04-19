'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, Filter } from 'lucide-react'

interface ContractorsFilterProps {
  name: string
  specialty: string
  status: string
  onFilterChange: (
    filterType: 'name' | 'specialty' | 'status',
    value: string
  ) => void
  onClearFilters: () => void
}

// Common contractor specialties
export const CONTRACTOR_SPECIALTIES = [
  { value: 'Electrical', label: 'Electrical' },
  { value: 'Plumbing', label: 'Plumbing' },
  { value: 'HVAC', label: 'HVAC' },
  { value: 'General Construction', label: 'General Construction' },
  { value: 'Carpentry', label: 'Carpentry' },
  { value: 'Roofing', label: 'Roofing' },
  { value: 'Excavation', label: 'Excavation' },
  { value: 'Landscaping', label: 'Landscaping' },
  { value: 'Painting', label: 'Painting' },
  { value: 'Masonry', label: 'Masonry' },
]

export const CONTRACTOR_STATUSES = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'PENDING', label: 'Pending' },
]

export function ContractorsFilter({
  name,
  specialty,
  status,
  onFilterChange,
  onClearFilters,
}: ContractorsFilterProps) {
  const activeFilterCount =
    (name ? 1 : 0) +
    (specialty && specialty !== 'all' ? 1 : 0) +
    (status && status !== 'all' ? 1 : 0)

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="grid gap-1.5 flex-1">
            <Label htmlFor="name">Contractor Name</Label>
            <Input
              id="name"
              placeholder="Search by name"
              value={name}
              onChange={(e) => onFilterChange('name', e.target.value)}
            />
          </div>

          <div className="grid gap-1.5 flex-1">
            <Label htmlFor="specialty">Specialty</Label>
            <Select
              value={specialty}
              onValueChange={(value) => onFilterChange('specialty', value)}
            >
              <SelectTrigger id="specialty">
                <SelectValue placeholder="All specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All specialties</SelectItem>
                {CONTRACTOR_SPECIALTIES.map((specialtyOption) => (
                  <SelectItem
                    key={specialtyOption.value}
                    value={specialtyOption.value}
                  >
                    {specialtyOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5 flex-1">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => onFilterChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {CONTRACTOR_STATUSES.map((statusOption) => (
                  <SelectItem
                    key={statusOption.value}
                    value={statusOption.value}
                  >
                    {statusOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="h-6">
                {activeFilterCount} filter{activeFilterCount !== 1 && 's'}
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              disabled={activeFilterCount === 0}
            >
              <X className="mr-2 h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
