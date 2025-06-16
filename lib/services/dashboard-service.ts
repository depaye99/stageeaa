import { createClient } from '@/lib/supabase/client'

export class DashboardService {
  private supabase = createClient()

  async getDashboardStats(userId: string, role: string) {
    try {
      let stats = {
        stagiaires_actifs: 0,
        stagiaires_total: 0,
        demandes_en_cours: 0,
        demandes_total: 0,
        documents_total: 0,
        evaluations_total: 0,
      }

      if (role === "admin" || role === "rh") {
        // Statistiques globales
        const { data: stagiaires } = await this.supabase.from("stagiaires").select("*")
        const { data: demandes } = await this.supabase.from("demandes").select("*")
        const { data: documents } = await this.supabase.from("documents").select("*")
        const { data: evaluations } = await this.supabase.from("evaluations").select("*")

        stats = {
          stagiaires_actifs: stagiaires?.filter((s) => s.statut === "actif").length || 0,
          stagiaires_total: stagiaires?.length || 0,
          demandes_en_cours: demandes?.filter((d) => d.statut === "En attente").length || 0,
          demandes_total: demandes?.length || 0,
          documents_total: documents?.length || 0,
          evaluations_total: evaluations?.length || 0,
        }
      } else if (role === "tuteur") {
        // Statistiques pour le tuteur
        const { data: stagiaires } = await this.supabase.from("stagiaires").select("*").eq("tuteur_id", userId)
        const { data: demandes } = await this.supabase.from("demandes").select("*").eq("tuteur_id", userId)
        const { data: evaluations } = await this.supabase.from("evaluations").select("*").eq("tuteur_id", userId)

        stats = {
          stagiaires_actifs: stagiaires?.filter((s) => s.statut === "actif").length || 0,
          stagiaires_total: stagiaires?.length || 0,
          demandes_en_cours: demandes?.filter((d) => d.statut === "En attente").length || 0,
          demandes_total: demandes?.length || 0,
          documents_total: 0,
          evaluations_total: evaluations?.length || 0,
        }
      } else if (role === "stagiaire") {
        // Statistiques pour le stagiaire
        const { data: stagiaire } = await this.supabase.from("stagiaires").select("*").eq("user_id", userId).single()

        if (stagiaire) {
          const { data: demandes } = await this.supabase.from("demandes").select("*").eq("stagiaire_id", stagiaire.id)
          const { data: documents } = await this.supabase.from("documents").select("*").eq("stagiaire_id", stagiaire.id)
          const { data: evaluations } = await this.supabase
            .from("evaluations")
            .select("*")
            .eq("stagiaire_id", stagiaire.id)

          stats = {
            stagiaires_actifs: 0,
            stagiaires_total: 1,
            demandes_en_cours: demandes?.filter((d) => d.statut === "En attente").length || 0,
            demandes_total: demandes?.length || 0,
            documents_total: documents?.length || 0,
            evaluations_total: evaluations?.length || 0,
          }
        }
      }

      return { stats, error: null }
    } catch (error) {
      return { stats: null, error: error as Error }
    }
  }

  async getRecentActivities(userId: string, role: string) {
    try {
      const activities = []

      if (role === "admin" || role === "rh") {
        // Activités récentes globales
        const { data: demandes } = await this.supabase
          .from("demandes")
          .select("*, stagiaires(nom, prenom)")
          .order("created_at", { ascending: false })
          .limit(5)

        if (demandes) {
          activities.push(
            ...demandes.map((d) => ({
              id: d.id,
              type: "demande",
              title: `Nouvelle demande de ${d.stagiaires?.nom} ${d.stagiaires?.prenom}`,
              description: d.type,
              date: d.created_at,
            })),
          )
        }
      }

      return { activities, error: null }
    } catch (error) {
      return { activities: [], error: error as Error }
    }
  }
}

export const dashboardService = new DashboardService()