import { getBaseUrl } from '@/lib/utils'
import { getToken } from '@/lib/auth'
import { User } from '@/lib/types/user'

export interface CreateUserDto {
  email: string
  password: string
  firstName: string
  lastName?: string
  role: 'USER' | 'ADMIN'
}

export interface UpdateUserDto {
  email?: string
  firstName?: string
  lastName?: string
  role?: 'USER' | 'ADMIN'
}

class UserService {
  private static API_URL = `${getBaseUrl()}/api/users`

  private static async getHeaders(): Promise<HeadersInit> {
    const token = getToken()
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  static async getUsers(): Promise<User[]> {
    const response = await fetch(this.API_URL, {
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch users')
    }

    return response.json()
  }

  static async getUser(id: string): Promise<User> {
    const response = await fetch(`${this.API_URL}/${id}`, {
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch user')
    }

    return response.json()
  }

  static async createUser(data: CreateUserDto): Promise<User> {
    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create user')
    }

    return response.json()
  }

  static async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const response = await fetch(`${this.API_URL}/${id}`, {
      method: 'PATCH',
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update user')
    }

    return response.json()
  }

  static async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${this.API_URL}/${id}`, {
      method: 'DELETE',
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete user')
    }
  }
}

export default UserService
