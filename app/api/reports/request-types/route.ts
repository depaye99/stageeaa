import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/services/server-auth-service'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '2025'

    const { data: demandes } = await supabase
      .from('demandes')
      .select('type')
      .gte('created_at', `${period}-01-01`)
      .lt('created_at', `${parseInt(period) + 1}-01-01`)

    const typeCounts: Record<string, number> = {}

    demandes?.forEach(d => {
      if (d.type) {
        typeCounts[d.type] = (typeCounts[d.type] || 0) + 1
      }
    })

    const total = demandes?.length || 0
    const typeLabels: Record<string, string> = {
      'stage-academique': 'Stage académique',
      'stage-professionnel': 'Stage professionnel',
      'prolongation': 'Prolongation',
      'conge': 'Congé',
      'attestation': 'Attestation'
    }

    const requestTypes = Object.entries(typeCounts)
      .map(([type, count]) => ({
        type: typeLabels[type] || type,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json(requestTypes)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
