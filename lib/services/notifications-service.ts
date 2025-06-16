
import { createClient } from "@/lib/supabase/client"

export class NotificationsService {
  private supabase = createClient()

  async getByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  async markAsRead(id: string) {
    const { error } = await this.supabase
      .from("notifications")
      .update({ lu: true })
      .eq("id", id)

    if (error) throw error
  }

  async markAllAsRead(userId: string) {
    const { error } = await this.supabase
      .from("notifications")
      .update({ lu: true })
      .eq("user_id", userId)
      .eq("lu", false)

    if (error) throw error
  }

  async create(notification: {
    user_id: string
    titre: string
    message: string
    type: string
  }) {
    const { data, error } = await this.supabase
      .from("notifications")
      .insert(notification)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export const notificationsService = new NotificationsService()
