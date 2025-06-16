
import { createClient } from "@/lib/supabase/client"

export class DemandesService {
  private supabase = createClient()

  async getAll() {
    const { data, error } = await this.supabase
      .from("demandes")
      .select(`
        *,
        stagiaire:stagiaires(nom, prenom, email, entreprise),
        tuteur:users!tuteur_id(name, email)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  async getDemandesStats() {
    const [total, enAttente, approuvees, rejetees] = await Promise.all([
      this.supabase.from("demandes").select("id", { count: "exact", head: true }),
      this.supabase.from("demandes").select("id", { count: "exact", head: true }).eq("statut", "en_attente"),
      this.supabase.from("demandes").select("id", { count: "exact", head: true }).eq("statut", "approuvee"),
      this.supabase.from("demandes").select("id", { count: "exact", head: true }).eq("statut", "rejetee"),
    ])

    return {
      total: total.count || 0,
      en_attente: enAttente.count || 0,
      approuvees: approuvees.count || 0,
      rejetees: rejetees.count || 0,
    }
  }

  async rejeterDemande(id: string, motif: string) {
    const { data, error } = await this.supabase
      .from("demandes")
      .update({
        statut: "rejetee",
        commentaire_reponse: motif,
        date_reponse: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async approuverDemande(id: string, commentaire?: string) {
    const { data, error } = await this.supabase
      .from("demandes")
      .update({
        statut: "approuvee",
        commentaire_reponse: commentaire,
        date_reponse: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export const demandesService = new DemandesService()
