
import { createClient } from '@/lib/supabase/client'
import type { Database } from "../supabase/database.types"

export type Notification = Database["public"]["Tables"]["notifications"]["Row"]
export type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"]
export type NotificationUpdate = Database["public"]["Tables"]["notifications"]["Update"]

export class NotificationsService {
  private supabase = createClient()

  async getAll() {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  async getById(id: string) {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  async create(notification: NotificationInsert) {
    const { data, error } = await this.supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async update(id: string, updates: NotificationUpdate) {
    const { data, error } = await this.supabase
      .from('notifications')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async delete(id: string) {
    const { error } = await this.supabase
      .from('notifications')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  async getByUser(userId: string) {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  async markAsRead(id: string) {
    const { data, error } = await this.supabase
      .from('notifications')
      .update({ lu: true })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async markAllAsRead(userId: string) {
    const { error } = await this.supabase
      .from('notifications')
      .update({ lu: true })
      .eq('user_id', userId)
      .eq('lu', false)
    
    if (error) throw error
  }

  async getUnreadCount(userId: string) {
    const { count, error } = await this.supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('lu', false)
    
    if (error) throw error
    return count || 0
  }
}

export const notificationsService = new NotificationsService()
