
import { createClient } from "@/lib/supabase/client"

export class DocumentsService {
  private supabase = createClient()

  async getAll() {
    const { data, error } = await this.supabase
      .from("documents")
      .select(`
        *,
        user:users(name, email)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  async getByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  async upload(file: File, userId: string, demandeId?: string) {
    const fileName = `${Date.now()}-${file.name}`
    const filePath = `documents/${userId}/${fileName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from("documents")
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = this.supabase.storage
      .from("documents")
      .getPublicUrl(filePath)

    // Save to database
    const { data, error } = await this.supabase
      .from("documents")
      .insert({
        nom: file.name,
        type: file.type,
        taille: file.size,
        url: publicUrl,
        user_id: userId,
        demande_id: demandeId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async delete(id: string) {
    const { error } = await this.supabase
      .from("documents")
      .delete()
      .eq("id", id)

    if (error) throw error
  }
}

export const documentsService = new DocumentsService()
