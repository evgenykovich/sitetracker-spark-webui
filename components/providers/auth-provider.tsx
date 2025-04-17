'use client'

import { AuthProvider as AuthContextProvider } from '@/lib/contexts/auth-context'
import { ReactNode } from 'react'

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthContextProvider>{children}</AuthContextProvider>
}
