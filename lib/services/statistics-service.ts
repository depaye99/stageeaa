
import { createClient } from '@/lib/supabase/client'
import type { Database } from "../supabase/database.types"

const supabase = createClient()

export class StatisticsService {
  async getDashboardStats() {
    try {
      const [stagiaires, demandes, documents, users] = await Promise.all([
        supabase.from('stagiaires').select('count(*)', { count: 'exact' }),
        supabase.from('demandes').select('count(*)', { count: 'exact' }),
        supabase.from('documents').select('count(*)', { count: 'exact' }),
        supabase.from('users').select('count(*)', { count: 'exact' })
      ])

      const stagiaireActifs = await supabase
        .from('stagiaires')
        .select('count(*)', { count: 'exact' })
        .eq('statut', 'actif')

      const demandesEnCours = await supabase
        .from('demandes')
        .select('count(*)', { count: 'exact' })
        .eq('statut', 'en_attente')

      return {
        stagiaires_total: stagiaires.count || 0,
        stagiaires_actifs: stagiaireActifs.count || 0,
        demandes_total: demandes.count || 0,
        demandes_en_cours: demandesEnCours.count || 0,
        documents_total: documents.count || 0,
        users_total: users.count || 0
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  }

  async getMonthlyStats(year: number, month: number) {
    try {
      const startDate = new Date(year, month - 1, 1).toISOString()
      const endDate = new Date(year, month, 0).toISOString()

      const [stagiaireCount, demandeCount, documentCount] = await Promise.all([
        supabase
          .from('stagiaires')
          .select('count(*)', { count: 'exact' })
          .gte('created_at', startDate)
          .lte('created_at', endDate),

        supabase
          .from('demandes')
          .select('count(*)', { count: 'exact' })
          .gte('created_at', startDate)
          .lte('created_at', endDate),

        supabase
          .from('documents')
          .select('count(*)', { count: 'exact' })
          .gte('created_at', startDate)
          .lte('created_at', endDate)
      ])

      return {
        stagiaires: stagiaireCount.count || 0,
        demandes: demandeCount.count || 0,
        documents: documentCount.count || 0
      }
    } catch (error) {
      console.error('Error fetching monthly stats:', error)
      throw error
    }
  }

  async getDepartmentStats() {
    try {
      const { data, error } = await supabase
        .from('stagiaires')
        .select('departement')
        .not('departement', 'is', null)

      if (error) throw error

      const departmentCounts = (data || []).reduce((acc: Record<string, number>, stagiaire) => {
        const dept = stagiaire.departement || 'Non spécifié'
        acc[dept] = (acc[dept] || 0) + 1
        return acc
      }, {})

      return Object.entries(departmentCounts).map(([departement, count]) => ({
        departement,
        count
      }))
    } catch (error) {
      console.error('Error fetching department stats:', error)
      throw error
    }
  }
}

export const statisticsService = new StatisticsService()
