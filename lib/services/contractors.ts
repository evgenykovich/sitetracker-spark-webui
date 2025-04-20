import { getBaseUrl } from '@/lib/utils'
import { getToken } from '@/lib/auth'

export interface ContractorProfile {
  id?: string
  userId?: string
  company?: string
  phone?: string
  street?: string
  city?: string
  state?: string
  zipCode?: string
  createdAt?: string
  updatedAt?: string
}

export interface Contractor {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  companyName?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  specialties?: string[]
  contractorProfile?: ContractorProfile
  createdAt?: string
  updatedAt?: string
}

export interface ContractorForm {
  id: string
  name: string
  description?: string
  status: string
  createdAt: string
  assignedAt: string
}

class ContractorsService {
  private static API_URL = `${getBaseUrl()}/api/contractors`

  private static async getHeaders(): Promise<HeadersInit> {
    const token = getToken()
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  static async getContractors(filters?: {
    name?: string
  }): Promise<Contractor[]> {
    // Build query parameters
    const params = new URLSearchParams()
    if (filters?.name) params.append('name', filters.name)

    const queryString = params.toString() ? `?${params.toString()}` : ''

    const response = await fetch(`${this.API_URL}${queryString}`, {
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch contractors')
    }

    return response.json()
  }

  static async getContractor(id: string): Promise<Contractor> {
    const response = await fetch(`${this.API_URL}/${id}`, {
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch contractor')
    }

    return response.json()
  }

  static async createContractor(data: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    companyName?: string
    address?: {
      street?: string
      city?: string
      state?: string
      zipCode?: string
      country?: string
    }
    specialties?: string[]
  }): Promise<Contractor> {
    const response = await fetch(`${this.API_URL}`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create contractor')
    }

    return response.json()
  }

  static async updateContractor(
    id: string,
    data: Partial<Contractor>
  ): Promise<Contractor> {
    const response = await fetch(`${this.API_URL}/${id}`, {
      method: 'PATCH',
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update contractor')
    }

    return response.json()
  }

  static async deleteContractor(id: string): Promise<void> {
    const response = await fetch(`${this.API_URL}/${id}`, {
      method: 'DELETE',
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete contractor')
    }
  }

  static async getContractorForms(id: string): Promise<ContractorForm[]> {
    const response = await fetch(`${this.API_URL}/${id}/forms`, {
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch contractor forms')
    }

    return response.json()
  }

  static async importContractors(file: File): Promise<{
    imported: number
    skipped: number
    errors: string[]
  }> {
    // Create FormData
    const formData = new FormData()
    formData.append('file', file)

    // Get authorization headers without Content-Type (browser will set it with boundary)
    const token = getToken()
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    }

    // Make the request
    const response = await fetch(`${this.API_URL}/import`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to import contractors')
    }

    return response.json()
  }
}

export default ContractorsService
