import { createServerSupabaseClient } from "./server-auth-service"
import type { Database } from "@/lib/supabase/database.types"

type Stagiaire = Database["public"]["Tables"]["stagiaires"]["Row"]
type StagiaireInsert = Database["public"]["Tables"]["stagiaires"]["Insert"]
type StagiaireUpdate = Database["public"]["Tables"]["stagiaires"]["Update"]

interface StagiaireFilters {
  statut?: string
  departement?: string
  ecole?: string
  tuteurId?: string
}

export class StagiairesService {
  async getAll(filters?: StagiaireFilters): Promise<Stagiaire[]> {
    const supabase = await createServerSupabaseClient()

    let query = supabase.from("stagiaires").select(`
        *,
        users!stagiaires_user_id_fkey(name, email),
        users!stagiaires_tuteur_id_fkey(name, email)
      `)

    if (filters?.statut) {
      query = query.eq("statut", filters.statut)
    }
    if (filters?.departement) {
      query = query.eq("departement", filters.departement)
    }
    if (filters?.ecole) {
      query = query.eq("ecole", filters.ecole)
    }
    if (filters?.tuteurId) {
      query = query.eq("tuteur_id", filters.tuteurId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Erreur lors de la récupération des stagiaires: ${error.message}`)
    }

    return data || []
  }

  async getById(id: string): Promise<Stagiaire | null> {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from("stagiaires")
      .select(`
        *,
        users!stagiaires_user_id_fkey(name, email),
        users!stagiaires_tuteur_id_fkey(name, email)
      `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      throw new Error(`Erreur lors de la récupération du stagiaire: ${error.message}`)
    }

    return data
  }

  async getByUserId(userId: string): Promise<Stagiaire | null> {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from("stagiaires")
      .select(`
        *,
        users!stagiaires_user_id_fkey(name, email),
        users!stagiaires_tuteur_id_fkey(name, email)
      `)
      .eq("user_id", userId)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      throw new Error(`Erreur lors de la récupération du stagiaire: ${error.message}`)
    }

    return data
  }

  async create(stagiaireData: StagiaireInsert): Promise<Stagiaire> {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from("stagiaires")
      .insert([
        {
          ...stagiaireData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(`Erreur lors de la création du stagiaire: ${error.message}`)
    }

    return data
  }

  async update(id: string, updates: StagiaireUpdate): Promise<Stagiaire> {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from("stagiaires")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Erreur lors de la mise à jour du stagiaire: ${error.message}`)
    }

    return data
  }

  async delete(id: string): Promise<void> {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase.from("stagiaires").delete().eq("id", id)

    if (error) {
      throw new Error(`Erreur lors de la suppression du stagiaire: ${error.message}`)
    }
  }

  async getStats(): Promise<{
    total: number
    actifs: number
    en_attente: number
    termines: number
    par_departement: Record<string, number>
    par_ecole: Record<string, number>
  }> {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase.from("stagiaires").select("statut, departement, ecole")

    if (error) {
      throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`)
    }

    const stagiaires = data || []

    const stats = {
      total: stagiaires.length,
      actifs: stagiaires.filter((s) => s.statut === "actif").length,
      en_attente: stagiaires.filter((s) => s.statut === "en_attente").length,
      termines: stagiaires.filter((s) => s.statut === "termine").length,
      par_departement: {} as Record<string, number>,
      par_ecole: {} as Record<string, number>,
    }

    // Compter par département
    stagiaires.forEach((s) => {
      if (s.departement) {
        stats.par_departement[s.departement] = (stats.par_departement[s.departement] || 0) + 1
      }
    })

    // Compter par école
    stagiaires.forEach((s) => {
      if (s.ecole) {
        stats.par_ecole[s.ecole] = (stats.par_ecole[s.ecole] || 0) + 1
      }
    })

    return stats
  }

  async assignTuteur(stagiaireId: string, tuteurId: string): Promise<Stagiaire> {
    return this.update(stagiaireId, { tuteur_id: tuteurId })
  }

  async updateStatut(stagiaireId: string, statut: string): Promise<Stagiaire> {
    return this.update(stagiaireId, { statut })
  }
}

export const stagiaireService = new StagiairesService()
