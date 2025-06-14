import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/services/server-auth-service'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '2025'

    // Récupérer les statistiques générales
    const { data: stagiaires } = await supabase
      .from('stagiaires')
      .select('*')
      .gte('created_at', `${period}-01-01`)
      .lt('created_at', `${parseInt(period) + 1}-01-01`)

    const { data: demandes } = await supabase
      .from('demandes')
      .select('*')
      .gte('created_at', `${period}-01-01`)
      .lt('created_at', `${parseInt(period) + 1}-01-01`)

    const { data: documents } = await supabase
      .from('documents')
      .select('*')
      .gte('created_at', `${period}-01-01`)
      .lt('created_at', `${parseInt(period) + 1}-01-01`)

    const { data: users } = await supabase
      .from('users')
      .select('*')
      .gte('created_at', `${period}-01-01`)
      .lt('created_at', `${parseInt(period) + 1}-01-01`)

    // Calculer les statistiques
    const totalStagiaires = stagiaires?.length || 0
    const totalDemandes = demandes?.length || 0
    const totalDocuments = documents?.length || 0
    const totalUsers = users?.length || 0

    // Statistiques par statut des demandes
    const demandesParStatut = demandes?.reduce((acc: Record<string, number>, demande) => {
      const statut = demande.statut || 'unknown'
      acc[statut] = (acc[statut] || 0) + 1
      return acc
    }, {}) || {}

    // Statistiques par type de demande
    const demandesParType = demandes?.reduce((acc: Record<string, number>, demande) => {
      const type = demande.type || 'unknown'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {}) || {}

    // Évolution mensuelle des demandes
    const evolutionMensuelle = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1
      const monthStr = month.toString().padStart(2, '0')
      const demandesDuMois = demandes?.filter(d => 
        d.created_at?.startsWith(`${period}-${monthStr}`)
      ).length || 0
      
      return {
        mois: new Date(parseInt(period), i).toLocaleDateString('fr-FR', { month: 'long' }),
        demandes: demandesDuMois
      }
    })

    const statistics = {
      totalStagiaires,
      totalDemandes,
      totalDocuments,
      totalUsers,
      demandesParStatut,
      demandesParType,
      evolutionMensuelle,
      period,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(statistics)
  } catch (error: any) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}
