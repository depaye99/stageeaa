
import { createClient } from '@/lib/supabase/client'
import type { Database } from "../supabase/database.types"
import type { User, UserInsert, UserUpdate } from '@/lib/types'

const supabase = createClient()

export class UsersService {
  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching user by id:', error)
      throw error
    }
  }

  async createUser(user: UserInsert): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  async updateUser(id: string, updates: UserUpdate): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }

  async getUsersByRole(role: string): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', role)
        .order('name')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching users by role:', error)
      throw error
    }
  }
}

export const usersService = new UsersService()
