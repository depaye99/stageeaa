
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createServerSupabaseClient() {
  const cookieStore = cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://blmyaizvefkfmwgggid.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'default-key'

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Variables d\'environnement Supabase manquantes')
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

// Server-side auth helpers
export async function getServerUser() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return user
  } catch (error) {
    console.error('Error in getServerUser:', error)
    return null
  }
}

export async function requireServerAuth() {
  const user = await getServerUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

export async function getUserRole() {
  const user = await getServerUser()
  if (!user) return null

  // Récupérer le rôle depuis les métadonnées ou la base de données
  return user.user_metadata?.role || 'stagiaire'
}
