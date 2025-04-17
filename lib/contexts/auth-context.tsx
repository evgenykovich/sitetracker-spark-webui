'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import * as auth from '@/lib/auth'

export type UserRole = 'ADMIN' | 'USER' | 'CONTRACTOR'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
}

interface JwtPayload {
  sub: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  exp: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => Promise<void>
  logout: () => void
  isAdmin: boolean
  isUser: boolean
  isContractor: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to check if token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      const isExpired = decoded.exp * 1000 < Date.now()
      console.log('Token expiry check:', {
        exp: new Date(decoded.exp * 1000),
        now: new Date(),
        isExpired,
      })
      return isExpired
    } catch {
      console.log('Failed to decode token for expiry check')
      return true
    }
  }

  // Function to validate and process token
  const processToken = (token: string, userData?: User): boolean => {
    try {
      console.log('Processing token:', {
        hasUserData: !!userData,
        userData: userData,
      })

      if (isTokenExpired(token)) {
        console.log('Token is expired, removing')
        auth.removeToken()
        setUser(null)
        return false
      }

      const decoded = jwtDecode<JwtPayload>(token)
      console.log('Token decoded successfully:', {
        email: decoded.email,
        role: decoded.role,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        sub: decoded.sub,
      })

      // Prefer stored user data over token data
      const user = userData || {
        id: decoded.sub,
        email: decoded.email,
        firstName: decoded.firstName || '',
        lastName: decoded.lastName || '',
        role: decoded.role,
      }

      console.log('Setting user data:', user)
      setUser(user)
      return true
    } catch (error) {
      console.error('Failed to decode token:', error)
      auth.removeToken()
      setUser(null)
      return false
    }
  }

  // Initialize auth state
  useEffect(() => {
    const token = auth.getToken()
    const storedUserData = auth.getUserData()

    console.log('Auth initialization:', {
      hasToken: !!token,
      hasStoredUserData: !!storedUserData,
      currentPath:
        typeof window !== 'undefined' ? window.location.pathname : 'unknown',
    })

    if (!token || !processToken(token, storedUserData || undefined)) {
      setLoading(false)
      // Only redirect to root if we're not already there
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        console.log('No valid token, redirecting to root')
        router.push('/')
      }
    } else {
      console.log('Valid token found, auth initialized')
      setLoading(false)
    }
  }, [router])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await auth.login({ email, password })
      processToken(response.access_token, response.user)
      // Delay navigation slightly to allow toast to show
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 100)
    } catch (error) {
      throw error
    }
  }

  // Register function
  const register = async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => {
    try {
      const response = await auth.register(data)
      processToken(response.access_token, response.user)
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      throw error
    }
  }

  // Logout function
  const logout = () => {
    auth.removeToken()
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'ADMIN',
        isUser: user?.role === 'USER',
        isContractor: user?.role === 'CONTRACTOR',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
