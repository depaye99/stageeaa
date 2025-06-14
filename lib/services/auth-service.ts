import { createClient } from "@/lib/supabase/client"
import type { User, UserRole } from "@/lib/supabase/database.types"

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  name: string
  phone?: string
  address?: string
  department?: string
  position?: string
  avatar_url?: string
  is_active: boolean
}

class AuthService {
  private supabase = createClient()

  async signIn(
    email: string,
    password: string,
  ): Promise<{
    user: AuthUser | null
    error: Error | null
  }> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (!data.user) {
        throw new Error("No user returned from authentication")
      }

      // Récupérer le profil utilisateur
      const profile = await this.getUserProfile(data.user.id)
      if (!profile) {
        throw new Error("User profile not found")
      }

      // Mettre à jour la dernière connexion
      await this.updateLastLogin(data.user.id)

      return { user: profile, error: null }
    } catch (error) {
      console.error("Sign in error:", error)
      return {
        user: null,
        error: error instanceof Error ? error : new Error("Unknown error"),
      }
    }
  }

  async signUp(
    email: string,
    password: string,
    userData: {
      name: string
      role: UserRole
      phone?: string
      address?: string
      department?: string
      position?: string
    },
  ): Promise<{
    user: AuthUser | null
    error: Error | null
  }> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
          },
        },
      })

      if (error) throw error

      if (!data.user) {
        throw new Error("No user returned from registration")
      }

      // Créer le profil utilisateur
      const { error: insertError } = await this.supabase.from("users").insert([
        {
          id: data.user.id,
          email: data.user.email!,
          name: userData.name,
          role: userData.role,
          phone: userData.phone || null,
          address: userData.address || null,
          department: userData.department || null,
          position: userData.position || null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])

      if (insertError) {
        console.error("Error creating user profile:", insertError)
        throw new Error("Failed to create user profile")
      }

      const profile = await this.getUserProfile(data.user.id)
      return { user: profile, error: null }
    } catch (error) {
      console.error("Sign up error:", error)
      return {
        user: null,
        error: error instanceof Error ? error : new Error("Unknown error"),
      }
    }
  }

  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error("Sign out error:", error)
      return {
        error: error instanceof Error ? error : new Error("Unknown error"),
      }
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const {
        data: { user },
        error,
      } = await this.supabase.auth.getUser()
      if (error) throw error

      if (!user) return null

      return await this.getUserProfile(user.id)
    } catch (error) {
      console.error("Get current user error:", error)
      return null
    }
  }

  async getUserProfile(userId: string): Promise<AuthUser | null> {
    try {
      const { data: profile, error } = await this.supabase.from("users").select("*").eq("id", userId).single()

      if (error) {
        if (error.code === "PGRST116") return null
        throw error
      }

      return {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        department: profile.department,
        position: profile.position,
        avatar_url: profile.avatar_url,
        is_active: profile.is_active,
      }
    } catch (error) {
      console.error("Get user profile error:", error)
      return null
    }
  }

  async updateUserProfile(
    userId: string,
    updates: Partial<User>,
  ): Promise<{
    data: AuthUser | null
    error: Error | null
  }> {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single()

      if (error) throw error

      const profile: AuthUser = {
        id: data.id,
        email: data.email,
        role: data.role,
        name: data.name,
        phone: data.phone,
        address: data.address,
        department: data.department,
        position: data.position,
        avatar_url: data.avatar_url,
        is_active: data.is_active,
      }

      return { data: profile, error: null }
    } catch (error) {
      console.error("Update user profile error:", error)
      return {
        data: null,
        error: error instanceof Error ? error : new Error("Unknown error"),
      }
    }
  }

  async updateLastLogin(userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("users")
        .update({
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) throw error
    } catch (error) {
      console.error("Update last login error:", error)
    }
  }

  async resetPassword(email: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error("Reset password error:", error)
      return {
        error: error instanceof Error ? error : new Error("Unknown error"),
      }
    }
  }

  async updatePassword(newPassword: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error("Update password error:", error)
      return {
        error: error instanceof Error ? error : new Error("Unknown error"),
      }
    }
  }
}

// Export de l'instance du service
export const authService = new AuthService()
