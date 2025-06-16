import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'

export abstract class BaseService {
  protected supabase: SupabaseClient

  constructor() {
    this.supabase = createClient()
  }

  protected async getById<T>(
    tableName: string, 
    id: string, 
    select: string = '*'
  ): Promise<T | null> {
    try {
      const { data, error } = await this.supabase
        .from(tableName)
        .select(select)
        .eq('id', id)
        .single()

      if (error) {
        console.error(`Error fetching ${tableName} by id:`, error)
        throw new Error(`Failed to fetch ${tableName}: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error(`Error in getById for ${tableName}:`, error)
      throw error
    }
  }

  protected async create<T>(tableName: string, data: any): Promise<T> {
    try {
      const { data: result, error } = await this.supabase
        .from(tableName)
        .insert(data)
        .select()
        .single()

      if (error) {
        console.error(`Error creating ${tableName}:`, error)
        throw new Error(`Failed to create ${tableName}: ${error.message}`)
      }

      return result
    } catch (error) {
      console.error(`Error in create for ${tableName}:`, error)
      throw error
    }
  }

  protected async update<T>(tableName: string, id: string, updates: any): Promise<T> {
    try {
      const { data, error } = await this.supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error(`Error updating ${tableName}:`, error)
        throw new Error(`Failed to update ${tableName}: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error(`Error in update for ${tableName}:`, error)
      throw error
    }
  }

  protected async delete(tableName: string, id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from(tableName)
        .delete()
        .eq('id', id)

      if (error) {
        console.error(`Error deleting ${tableName}:`, error)
        throw new Error(`Failed to delete ${tableName}: ${error.message}`)
      }
    } catch (error) {
      console.error(`Error in delete for ${tableName}:`, error)
      throw error
    }
  }

  protected async getCount(tableName: string, filters?: Record<string, any>): Promise<number> {
    try {
      let query = this.supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value)
          }
        })
      }

      const { count, error } = await query

      if (error) {
        console.error(`Error counting ${tableName}:`, error)
        throw new Error(`Failed to count ${tableName}: ${error.message}`)
      }

      return count || 0
    } catch (error) {
      console.error(`Error in getCount for ${tableName}:`, error)
      throw error
    }
  }

  private baseUrl: string = '/api'

  // Méthodes pour les services API (alternative à Supabase direct)
  protected async getApi<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data, error: null }
    } catch (error) {
      return this.handleError(error)
    }
  }

  protected async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data, error: null }
    } catch (error) {
      return this.handleError(error)
    }
  }

  protected async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data, error: null }
    } catch (error) {
      return this.handleError(error)
    }
  }

  protected async deleteApi<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data, error: null }
    } catch (error) {
      return this.handleError(error)
    }
  }

  protected handleSuccess<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      status: 200
    }
  }

  protected handleError(error: any): ApiResponse {
    console.error('Service error:', error)
    return {
      success: false,
      error: error.message || 'Une erreur est survenue',
      status: error.status || 500
    }
  }
}

// Types nécessaires
export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: string | null
}