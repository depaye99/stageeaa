import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/services/server-auth-service'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const role = searchParams.get('role')

    if (!userId || !role) {
      return NextResponse.json({ error: 'userId et role requis' }, { status: 400 })
    }

    let stats = {}

    if (role === 'admin' || role === 'rh') {
      // Statistiques globales pour admin/RH
      const { data: stagiaires } = await supabase.from('stagiaires').select('*')
      const { data: demandes } = await supabase.from('demandes').select('*')
      const { data: documents } = await supabase.from('documents').select('*')
      const { data: evaluations } = await supabase.from('evaluations').select('*')

      stats = {
        stagiaires_actifs: stagiaires?.filter(s => s.statut === 'actif').length || 0,
        stagiaires_total: stagiaires?.length || 0,
        demandes_en_cours: demandes?.filter(d => d.statut === 'En attente').length || 0,
        demandes_total: demandes?.length || 0,
        documents_total: documents?.length || 0,
        evaluations_total: evaluations?.length || 0,
      }
    } else if (role === 'tuteur') {
      // Statistiques pour le tuteur
      const { data: stagiaires } = await supabase.from('stagiaires').select('*').eq('tuteur_id', userId)
      const { data: demandes } = await supabase.from('demandes').select('*').eq('tuteur_id', userId)
      const { data: evaluations } = await supabase.from('evaluations').select('*').eq('tuteur_id', userId)

      stats = {
        stagiaires_actifs: stagiaires?.filter(s => s.statut === 'actif').length || 0,
        stagiaires_total: stagiaires?.length || 0,
        demandes_en_cours: demandes?.filter(d => d.statut === 'En attente').length || 0,
        demandes_total: demandes?.length || 0,
        evaluations_total: evaluations?.length || 0,
      }
    } else if (role === 'stagiaire') {
      // Statistiques pour le stagiaire
      const { data: stagiaire } = await supabase.from('stagiaires').select('*').eq('user_id', userId).single()
      
      if (stagiaire) {
        const { data: demandes } = await supabase.from('demandes').select('*').eq('stagiaire_id', stagiaire.id)
        const { data: documents } = await supabase.from('documents').select('*').eq('stagiaire_id', stagiaire.id)
        const { data: evaluations } = await supabase.from('evaluations').select('*').eq('stagiaire_id', stagiaire.id)

        stats = {
          demandes_total: demandes?.length || 0,
          demandes_en_cours: demandes?.filter(d => d.statut === 'En attente').length || 0,
          demandes_validees: demandes?.filter(d => d.statut === 'Validé').length || 0,
          documents_total: documents?.length || 0,
          evaluations_total: evaluations?.length || 0,
        }
      }
    }

    return NextResponse.json(stats)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
