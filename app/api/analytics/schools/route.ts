
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/services/server-auth-service'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '2025'

    const { data: stagiaires } = await supabase
      .from('stagiaires')
      .select('etablissement')
      .gte('created_at', `${period}-01-01`)
      .lt('created_at', `${parseInt(period) + 1}-01-01`)

    const schoolCounts: Record<string, number> = {}

    stagiaires?.forEach(s => {
      if (s.etablissement) {
        schoolCounts[s.etablissement] = (schoolCounts[s.etablissement] || 0) + 1
      }
    })

    const topSchools = Object.entries(schoolCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return NextResponse.json(topSchools)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
