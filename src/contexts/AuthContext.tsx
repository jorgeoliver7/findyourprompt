'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth, AuthState } from '@/hooks/useAuth'
import { Tables } from '@/types/database'

type Profile = Tables<'profiles'>

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, fullName: string) => Promise<any>
  signOut: () => Promise<any>
  updateProfile: (updates: Partial<Profile>) => Promise<any>
  isAuthenticated: boolean
  isAdmin: boolean
  isPremium: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

// Export the context for direct access if needed
export { AuthContext }