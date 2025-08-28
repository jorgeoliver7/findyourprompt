'use client'

import { useState, useEffect, useCallback } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import type { Tables } from '@/types/database'

type Profile = Tables<'profiles'>

export interface AuthState {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>
  signOut: () => Promise<{ error?: string }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: string }>
  isAuthenticated: boolean
  isAdmin: boolean
  isPremium: boolean
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createSupabaseBrowserClient()
  
  // If supabase client is not available, return mock state
  if (!supabase) {
    return {
      user: null,
      profile: null,
      session: null,
      loading: false,
      isAuthenticated: false,
      isAdmin: false,
      isPremium: false,
      signIn: async () => ({ error: 'Supabase not configured' }),
      signUp: async () => ({ error: 'Supabase not configured' }),
      signOut: async () => ({ error: 'Supabase not configured' }),
      updateProfile: async () => ({ error: 'Supabase not configured' })
    }
  }

  const getProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }, [supabase])

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
        setAuthState(prev => ({ ...prev, loading: false }))
        return
      }

      if (session?.user) {
        const profile = await getProfile(session.user.id)
        setUser(session.user)
        setProfile(profile)
        setSession(session)
        setLoading(false)
      } else {
        setUser(null)
        setProfile(null)
        setSession(null)
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await getProfile(session.user.id)
          setUser(session.user)
          setProfile(profile)
          setSession(session)
          setLoading(false)
        } else {
          setUser(null)
          setProfile(null)
          setSession(null)
          setLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [getProfile, supabase])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (!error && data) {
      setProfile(data)
    }

    return { error: error?.message }
  }

  // If Supabase is not configured, return mock data
  if (!supabase) {
    return {
      user: null,
      profile: null,
      session: null,
      loading: false,
      isAuthenticated: false,
      isAdmin: false,
      isPremium: false,
      signIn: async () => ({ error: 'Supabase not configured' }),
      signUp: async () => ({ error: 'Supabase not configured' }),
      signOut: async () => ({ error: 'Supabase not configured' }),
      updateProfile: async () => ({ error: 'Supabase not configured' })
    }
  }

  return {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    isPremium: profile?.subscription_tier !== 'free'
  }
}