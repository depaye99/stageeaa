import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/services/server-auth-service'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '2025'

    const { data: demandes } = await supabase
      .from('demandes')
      .select('statut, created_at, updated_at')
      .gte('created_at', `${period}-01-01`)
      .lt('created_at', `${parseInt(period) + 1}-01-01`)

    const totalDemandes = demandes?.length || 0
    const approuvees = demandes?.filter(d => d.statut === 'Validé').length || 0
    const tauxAcceptation = totalDemandes > 0 ? Math.round((approuvees / totalDemandes) * 100) : 0

    // Calcul du délai moyen de traitement
    const demandesTraitees = demandes?.filter(d => d.statut === 'Validé' || d.statut === 'Rejeté') || []
    const delais = demandesTraitees.map(d => {
      const created = new Date(d.created_at)
      const updated = new Date(d.updated_at)
      return (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24) // en jours
    })
    const delaiMoyen = delais.length > 0 ? Math.round((delais.reduce((a, b) => a + b, 0) / delais.length) * 10) / 10 : 0

    const performanceData = [
      {
        metric: "Taux d'acceptation",
        value: tauxAcceptation,
        target: 80,
        status: tauxAcceptation >= 80 ? "success" : "warning"
      },
      {
        metric: "Délai moyen de traitement",
        value: delaiMoyen,
        target: 3,
        status: delaiMoyen <= 3 ? "success" : "warning",
        unit: "jours"
      },
      {
        metric: "Satisfaction stagiaires",
        value: 4.2, // TODO: Récupérer depuis les évaluations
        target: 4.0,
        status: "success",
        unit: "/5"
      },
      {
        metric: "Taux de prolongation",
        value: 65, // TODO: Calculer depuis les demandes de prolongation
        target: 70,
        status: "warning"
      }
    ]

    return NextResponse.json(performanceData)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
