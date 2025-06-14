import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/services/server-auth-service'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '2025'
    const department = searchParams.get('department') || 'all'

    // Récupérer les données mensuelles des stagiaires et demandes
    const { data: stagiaires } = await supabase
      .from('stagiaires')
      .select('created_at')
      .gte('created_at', `${period}-01-01`)
      .lt('created_at', `${parseInt(period) + 1}-01-01`)

    const { data: demandes } = await supabase
      .from('demandes')
      .select('created_at, statut')
      .gte('created_at', `${period}-01-01`)
      .lt('created_at', `${parseInt(period) + 1}-01-01`)

    // Grouper par mois
    const monthlyStats = []
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']

    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(parseInt(period), i, 1)
      const monthEnd = new Date(parseInt(period), i + 1, 0)

      const stagiairesMonth = stagiaires?.filter(s => {
        const date = new Date(s.created_at)
        return date >= monthStart && date <= monthEnd
      }).length || 0

      const demandesMonth = demandes?.filter(d => {
        const date = new Date(d.created_at)
        return date >= monthStart && date <= monthEnd
      }).length || 0

      const validees = demandes?.filter(d => {
        const date = new Date(d.created_at)
        return date >= monthStart && date <= monthEnd && d.statut === 'Validé'
      }).length || 0

      const refusees = demandes?.filter(d => {
        const date = new Date(d.created_at)
        return date >= monthStart && date <= monthEnd && d.statut === 'Rejeté'
      }).length || 0

      monthlyStats.push({
        month: months[i],
        stagiaires: stagiairesMonth,
        demandes: demandesMonth,
        validees,
        refusees
      })
    }

    return NextResponse.json(monthlyStats)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
