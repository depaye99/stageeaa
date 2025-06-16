
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  role: string
  nom?: string
  prenom?: string
}

const supabase = createClient()

export const authService = {
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { user: data.user, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { user: null, error }
    }
  },

  async signUp(email: string, password: string, userData: any) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (error) throw error

      // Create user profile
      if (data.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email: data.user.email,
            ...userData
          }])

        if (insertError) {
          console.error('Error creating user profile:', insertError)
        }
      }

      return { user: data.user, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { user: null, error }
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      
      if (!user) return null
      
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (!profile) return null
      
      return {
        id: user.id,
        email: user.email || '',
        role: profile.role,
        nom: profile.nom,
        prenom: profile.prenom
      }
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  },

  async getUserProfile(userId: string) {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      return { profile, error }
    } catch (error) {
      console.error('Get user profile error:', error)
      return { profile: null, error }
    }
  },

  async updateUserProfile(userId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Update user profile error:', error)
      return { data: null, error }
    }
  }
}
