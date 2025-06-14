import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/services/server-auth-service'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const stagiaire_id = searchParams.get('stagiaire_id')
    const tuteur_id = searchParams.get('tuteur_id')

    let query = supabase
      .from('evaluations')
      .select(`
        *,
        stagiaires(nom, prenom, email),
        users!evaluations_tuteur_id_fkey(name, email)
      `)

    if (stagiaire_id) {
      query = query.eq('stagiaire_id', stagiaire_id)
    }

    if (tuteur_id) {
      query = query.eq('tuteur_id', tuteur_id)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const evaluationData = await request.json()

    const { data, error } = await supabase
      .from('evaluations')
      .insert([evaluationData])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
