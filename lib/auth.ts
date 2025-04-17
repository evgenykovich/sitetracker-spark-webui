import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'

interface LoginDto {
  email: string
  password: string
}

interface RegisterDto {
  email: string
  password: string
  firstName: string
  lastName: string
}

interface AuthResponse {
  access_token: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: 'ADMIN' | 'USER' | 'CONTRACTOR'
  }
}

interface JwtPayload {
  sub: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'USER' | 'CONTRACTOR'
  exp: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// Function to check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    return decoded.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

// Function to set token in cookie
export const setToken = (token: string) => {
  console.log('Setting auth token in cookie')
  // Set cookie to expire in 7 days
  Cookies.set('token', token, {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
}

// Function to set user data in cookie
export const setUserData = (user: AuthResponse['user']) => {
  console.log('Setting user data in cookie')
  Cookies.set('user_data', JSON.stringify(user), {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
}

// Function to get user data from cookie
export const getUserData = (): AuthResponse['user'] | null => {
  const userData = Cookies.get('user_data')
  if (!userData) return null
  try {
    return JSON.parse(userData)
  } catch {
    return null
  }
}

// Function to get token from cookie
export const getToken = (): string | null => {
  const token = Cookies.get('token')
  console.log('Getting auth token from cookie:', { hasToken: !!token })
  return token || null
}

// Function to remove token and user data from cookie
export const removeToken = () => {
  console.log('Removing auth token and user data from cookies')
  Cookies.remove('token')
  Cookies.remove('user_data')
}

export async function login(data: LoginDto): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: 'Failed to login' }))
      throw new Error(error.message || 'Failed to login')
    }

    const result = await response.json()
    console.log('Login response:', {
      hasAccessToken: !!result.access_token,
      userData: result.user,
    })

    // Decode token before setting to verify structure
    const decoded = jwtDecode(result.access_token)
    console.log('Token payload:', decoded)

    setToken(result.access_token)
    setUserData(result.user) // Store user data in cookie
    return result
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.message.includes('Failed to fetch')
    ) {
      throw new Error(
        'Unable to connect to the server. Please ensure the backend service is running.'
      )
    }
    throw error
  }
}

export async function register(data: RegisterDto): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: 'Failed to register' }))
      throw new Error(error.message || 'Failed to register')
    }

    const result = await response.json()
    setToken(result.access_token)
    return result
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.message.includes('Failed to fetch')
    ) {
      throw new Error(
        'Unable to connect to the server. Please ensure the backend service is running.'
      )
    }
    throw error
  }
}
