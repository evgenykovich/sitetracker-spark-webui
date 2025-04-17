import { getBaseUrl } from '@/lib/utils'
import { getToken } from '@/lib/auth'

export interface SalesforceConfig {
  id: string
  userId: string
  accessToken: string
  refreshToken: string | null
  instanceUrl: string
  createdAt: Date
  updatedAt: Date
}

export interface SalesforceUserInfo {
  id: string
  organizationId: string
  url: string
  username: string
  displayName?: string
}

export interface SalesforceForm {
  id: string
  name: string
  description?: string | null
  status?: string
  createdDate?: string
}

export interface SalesforceFormField {
  Id: string
  Name: string
  Type__c: string
  Item_Type__c?:
    | 'Text'
    | 'Picklist'
    | 'Number'
    | 'Date'
    | 'Checkbox'
    | 'Image'
    | 'File'
    | 'Email'
    | 'Phone'
    | 'Photo'
    | 'Photo/File'
  Label__c: string
  Required__c: boolean
  Order__c?: number
  Options__c?: string
  Validation__c?: string
  Section__c?: string
  Help_Text__c?: string
  Max_Length__c?: number
  Min_Length__c?: number
  Picklist_Values__c?: string[]
  description?: string
  Section: {
    name: string | null
    description: string | null
    subsection?: {
      name: string | null
      description: string | null
    }
  }
  Metadata: {
    requiredUploads: number
    photoValidationChecklist: string | null
    status: string | null
    value: string | null
    itemType: string | null
  }
  _rawSalesforceData: any
}

export interface SalesforceOrgConfig {
  clientId: string
  redirectUri: string
  isSandbox?: boolean
}

class SalesforceService {
  private static API_URL = `${getBaseUrl()}/api/salesforce`

  private static async getHeaders(): Promise<HeadersInit> {
    const token = getToken()
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  static async authorizeWithSession(
    sessionId: string,
    instanceUrl: string
  ): Promise<SalesforceUserInfo> {
    const response = await fetch(`${this.API_URL}/connect/session`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify({
        sessionId,
        instanceUrl,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to connect to Salesforce')
    }

    return response.json()
  }

  static async getCurrentConnection(): Promise<SalesforceConfig | null> {
    const response = await fetch(`${this.API_URL}/connection/status`, {
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      const error = await response.json()
      throw new Error(error.message || 'Failed to get connection status')
    }

    const data = await response.json()
    if (!data) return null

    return {
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    }
  }

  static async getForms(): Promise<SalesforceForm[]> {
    const response = await fetch(`${this.API_URL}/forms`, {
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch Salesforce forms')
    }

    return response.json()
  }

  static async listObjects(): Promise<string[]> {
    const response = await fetch(`${this.API_URL}/objects`, {
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to list Salesforce objects')
    }

    return response.json()
  }

  static async describeObject(objectName: string): Promise<any> {
    const response = await fetch(
      `${this.API_URL}/objects/${objectName}/describe`,
      {
        headers: await this.getHeaders(),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to describe Salesforce object')
    }

    return response.json()
  }

  static async query(soql: string): Promise<any> {
    const response = await fetch(`${this.API_URL}/query`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify({ query: soql }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to execute SOQL query')
    }

    return response.json()
  }

  static async getFormFields(formId: string): Promise<SalesforceFormField[]> {
    const response = await fetch(`${this.API_URL}/forms/${formId}/fields`, {
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch Salesforce form fields')
    }

    return response.json()
  }
}

export default SalesforceService
