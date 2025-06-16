
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/services/server-auth-service'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '2025'

    // TODO: Ajouter une colonne département dans la table stagiaires
    // Pour l'instant, simulation basée sur les spécialités
    const { data: stagiaires } = await supabase
      .from('stagiaires')
      .select('specialite')
      .gte('created_at', `${period}-01-01`)
      .lt('created_at', `${parseInt(period) + 1}-01-01`)

    const departmentCounts: Record<string, number> = {}
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

    stagiaires?.forEach(s => {
      if (s.specialite) {
        departmentCounts[s.specialite] = (departmentCounts[s.specialite] || 0) + 1
      }
    })

    const departmentData = Object.entries(departmentCounts).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }))

    return NextResponse.json(departmentData)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
