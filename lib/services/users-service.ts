
import { createClient } from "@/lib/supabase/client"

class UsersService {
  private supabase = createClient()

  async getAllUsers() {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  async getUserById(id: string) {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  }

  async getUserByEmail(email: string) {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (error) throw error
    return data
  }

  async updateUser(id: string, updates: any) {
    const { data, error } = await this.supabase
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteUser(id: string) {
    const { error } = await this.supabase
      .from("users")
      .update({ is_active: false })
      .eq("id", id)

    if (error) throw error
  }

  async getUsersByRole(role: string) {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("role", role)
      .eq("is_active", true)
      .order("name", { ascending: true })

    if (error) throw error
    return data
  }
}

export const usersService = new UsersService()
