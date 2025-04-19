'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Mail,
  MoreVertical,
  Edit,
  FileText,
  UserPlus,
  Phone,
  Building,
} from 'lucide-react'
import Link from 'next/link'
import { Contractor } from '@/lib/services/contractors'

interface ContractorsListProps {
  contractors: Contractor[]
}

export function ContractorsList({ contractors }: ContractorsListProps) {
  if (contractors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-lg font-medium text-muted-foreground mb-4">
          No contractors found
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Try adjusting your search or filters to find what you're looking for.
        </p>
        <Link href="/contractors/new">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Contractor
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Specialties</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contractors.map((contractor) => (
            <TableRow key={contractor.id}>
              <TableCell className="font-medium">
                {contractor.firstName} {contractor.lastName}
              </TableCell>
              <TableCell>
                <div className="flex flex-col space-y-1">
                  <a
                    href={`mailto:${contractor.email}`}
                    className="text-primary hover:underline flex items-center"
                  >
                    <Mail className="h-3.5 w-3.5 mr-1.5" />
                    {contractor.email}
                  </a>
                  {contractor.phone && (
                    <a
                      href={`tel:${contractor.phone}`}
                      className="text-muted-foreground hover:underline flex items-center"
                    >
                      <Phone className="h-3.5 w-3.5 mr-1.5" />
                      {contractor.phone}
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {contractor.companyName ? (
                  <div className="flex items-center">
                    <Building className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    {contractor.companyName}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
              <TableCell>
                {contractor.address?.city && contractor.address?.state
                  ? `${contractor.address.city}, ${contractor.address.state}`
                  : contractor.address?.city ||
                    contractor.address?.state || (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {contractor.specialties &&
                  contractor.specialties.length > 0 ? (
                    contractor.specialties.map((specialty) => (
                      <Badge
                        key={specialty}
                        variant="outline"
                        className="text-xs py-0 h-5"
                      >
                        {specialty}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={contractor.status || 'PENDING'} />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      View forms
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      Send email
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function StatusBadge({ status }: { status: string | undefined }) {
  const baseStyle =
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'

  let className = baseStyle
  const statusLower = status?.toLowerCase()
  switch (statusLower) {
    case 'active':
    case 'pending':
      className += ' bg-green-100 text-green-800'
      break
    case 'inactive':
      className += ' bg-gray-100 text-gray-800'
      break
    default:
      className += ' bg-blue-100 text-blue-800'
  }

  let displayStatus = 'Unknown'
  if (status && statusLower) {
    const statusMap: Record<string, string> = {
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending',
    }
    displayStatus = statusMap[statusLower] || 'Unknown'
  }

  return <span className={className}>{displayStatus}</span>
}
