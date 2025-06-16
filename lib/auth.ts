
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const supabase = createClient()

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting user:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Sign in error:', error)
    return { data: null, error }
  }
}

export async function signUpWithEmail(email: string, password: string, metadata?: any) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Sign up error:', error)
    return { data: null, error }
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Error signing out:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Sign out error:', error)
    return false
  }
}

export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error getting session:', error)
      return null
    }
    
    return session
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}

// Export auth object for compatibility
export const auth = {
  getCurrentUser,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  getSession
}
