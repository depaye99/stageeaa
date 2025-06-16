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
  email_confirmed?: boolean
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
      // First, try to sign in with Supabase Auth
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        console.error("Supabase auth error:", authError)

        // Provide helpful error messages
        if (authError.message.includes("Invalid login credentials")) {
          throw new Error(
            `Identifiants invalides pour ${email}. ` +
              `Vérifiez votre email et mot de passe. ` +
              `Si vous venez de créer votre compte, assurez-vous que votre email est confirmé.`,
          )
        }

        if (authError.message.includes("Email not confirmed")) {
          throw new Error(
            `Email non confirmé pour ${email}. ` +
              `Vérifiez votre boîte mail ou utilisez l'outil de confirmation manuelle en mode développement.`,
          )
        }

        if (authError.message.includes("signup")) {
          throw new Error(`Compte non trouvé pour ${email}. ` + `Créez d'abord un compte via la page d'inscription.`)
        }

        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error("No user returned from authentication")
      }

      // Try to get user profile from our users table
      let profile = await this.getUserProfile(authData.user.id)

      // If profile doesn't exist, create it from auth user data
      if (!profile) {
        console.log("User profile not found, creating from auth data...")

        const { error: insertError } = await this.supabase.from("users").insert([
          {
            id: authData.user.id,
            email: authData.user.email!,
            name: authData.user.user_metadata?.name || authData.user.email!.split("@")[0],
            role: (authData.user.user_metadata?.role as UserRole) || "stagiaire",
            phone: authData.user.user_metadata?.phone || null,
            address: authData.user.user_metadata?.address || null,
            department: authData.user.user_metadata?.department || null,
            position: authData.user.user_metadata?.position || null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])

        if (insertError) {
          console.error("Error creating user profile:", insertError)
          // Don't throw error, continue with basic user data
        }

        // Try to get profile again
        profile = await this.getUserProfile(authData.user.id)

        // If still no profile, create a basic one from auth data
        if (!profile) {
          profile = {
            id: authData.user.id,
            email: authData.user.email!,
            role: (authData.user.user_metadata?.role as UserRole) || "stagiaire",
            name: authData.user.user_metadata?.name || authData.user.email!.split("@")[0],
            phone: authData.user.user_metadata?.phone,
            address: authData.user.user_metadata?.address,
            department: authData.user.user_metadata?.department,
            position: authData.user.user_metadata?.position,
            avatar_url: authData.user.user_metadata?.avatar_url,
            is_active: true,
            email_confirmed: !!authData.user.email_confirmed_at,
          }
        }
      }

      // Update last login (don't throw if this fails)
      try {
        await this.updateLastLogin(authData.user.id)
      } catch (error) {
        console.warn("Failed to update last login:", error)
      }

      return { user: profile, error: null }
    } catch (error) {
      console.error("Sign in error:", error)
      return {
        user: null,
        error: error instanceof Error ? error : new Error("Unknown authentication error"),
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
      // Try to sign up with Supabase
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            phone: userData.phone,
            address: userData.address,
            department: userData.department,
            position: userData.position,
          },
        },
      })

      if (error) {
        console.error("Supabase signup error:", error)
        throw error
      }

      if (!data.user) {
        throw new Error("No user returned from registration")
      }

      // Create user profile in our users table
      try {
        await this.createUserProfile(data.user.id, userData, data.user.email!)
      } catch (profileError) {
        console.warn("Failed to create user profile:", profileError)
      }

      // Create basic user profile from auth data
      const profile: AuthUser = {
        id: data.user.id,
        email: data.user.email!,
        role: userData.role,
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        department: userData.department,
        position: userData.position,
        avatar_url: null,
        is_active: true,
        email_confirmed: !!data.user.email_confirmed_at,
      }

      return { user: profile, error: null }
    } catch (error) {
      console.error("Sign up error:", error)
      return {
        user: null,
        error: error instanceof Error ? error : new Error("Unknown registration error"),
      }
    }
  }

  private async createUserProfile(userId: string, userData: any, email: string): Promise<void> {
    const { error: insertError } = await this.supabase.from("users").insert([
      {
        id: userId,
        email: email,
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
        if (error.code === "PGRST116") {
          // No rows returned
          return null
        }
        if (error.code === "42P01") {
          // Table doesn't exist
          console.warn("Users table doesn't exist yet")
          return null
        }
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
        email_confirmed: true, // If they can login, email is confirmed
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
        email_confirmed: true,
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
