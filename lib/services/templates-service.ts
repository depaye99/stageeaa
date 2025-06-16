
import { createClient } from "@/lib/supabase/client"

class TemplatesService {
  private supabase = createClient()

  async getAll() {
    const { data, error } = await this.supabase
      .from("templates")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  async getById(id: string) {
    const { data, error } = await this.supabase
      .from("templates")
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  }

  async create(template: {
    nom: string
    contenu: string
    type: string
    actif?: boolean
  }) {
    const { data, error } = await this.supabase
      .from("templates")
      .insert(template)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async update(id: string, updates: any) {
    const { data, error } = await this.supabase
      .from("templates")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async delete(id: string) {
    const { error } = await this.supabase
      .from("templates")
      .delete()
      .eq("id", id)

    if (error) throw error
  }
}

export const templatesService = new TemplatesService()
