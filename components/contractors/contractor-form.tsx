'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { CheckIcon, Loader2, Plus, X } from 'lucide-react'
import ContractorsService from '@/lib/services/contractors'
import { CONTRACTOR_SPECIALTIES } from '@/components/contractors/contractors-filter'
import { Contractor } from '@/lib/services/contractors'

// Update the form schema to match the new data structure
const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  contractorProfile: z
    .object({
      phone: z.string().optional(),
      company: z.string().optional(),
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
    })
    .optional(),
  specialties: z.array(z.string()).optional(),
})

type FormData = z.infer<typeof formSchema>

interface ContractorFormProps {
  mode?: 'create' | 'edit'
  initialData?: Contractor
}

export function ContractorForm({
  mode = 'create',
  initialData,
}: ContractorFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [newSpecialty, setNewSpecialty] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      contractorProfile: {
        phone: initialData?.contractorProfile?.phone || '',
        company: initialData?.contractorProfile?.company || '',
        street: initialData?.contractorProfile?.street || '',
        city: initialData?.contractorProfile?.city || '',
        state: initialData?.contractorProfile?.state || '',
        zipCode: initialData?.contractorProfile?.zipCode || '',
      },
      specialties: initialData?.specialties || [],
    },
  })

  const specialties = form.watch('specialties') || []

  const handleAddSpecialty = (specialty: string) => {
    if (!specialty) return

    if (!specialties.includes(specialty)) {
      form.setValue('specialties', [...specialties, specialty])
    }

    setNewSpecialty('')
  }

  const handleRemoveSpecialty = (specialty: string) => {
    form.setValue(
      'specialties',
      specialties.filter((s) => s !== specialty)
    )
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      if (mode === 'edit' && initialData) {
        // If editing, preserve the existing IDs
        const updatedData = {
          ...data,
          contractorProfile: {
            ...data.contractorProfile,
            id: initialData.contractorProfile?.id,
            userId: initialData.contractorProfile?.userId,
          },
        }
        await ContractorsService.updateContractor(initialData.id, updatedData)
        toast({
          title: 'Contractor updated',
          description: 'The contractor has been successfully updated.',
        })
      } else {
        await ContractorsService.createContractor(data)
        toast({
          title: 'Contractor created',
          description: 'The contractor has been successfully created.',
        })
      }
      router.push('/contractors')
    } catch (error) {
      console.error(`Failed to ${mode} contractor:`, error)
      toast({
        title: 'Error',
        description: `Failed to ${mode} contractor. Please try again.`,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contractorProfile.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+1 555-123-4567"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contractorProfile.company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Acme Inc."
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address & Specialties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="contractorProfile.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main St"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="contractorProfile.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="New York"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contractorProfile.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="NY"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="contractorProfile.zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="10001"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Specialties</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant="secondary"
                      className="gap-1 pl-2"
                    >
                      {specialty}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 text-muted-foreground hover:text-foreground"
                        onClick={() => handleRemoveSpecialty(specialty)}
                        type="button"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Select value={newSpecialty} onValueChange={setNewSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTRACTOR_SPECIALTIES.map((specialty) => (
                        <SelectItem
                          key={specialty.value}
                          value={specialty.value}
                          disabled={specialties.includes(specialty.value)}
                        >
                          {specialty.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleAddSpecialty(newSpecialty)}
                    disabled={!newSpecialty}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            variant="outline"
            className="mr-2"
            onClick={() => router.push('/contractors')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'edit' ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <CheckIcon className="mr-2 h-4 w-4" />
                {mode === 'edit' ? 'Update Contractor' : 'Create Contractor'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
