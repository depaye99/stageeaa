
import { NextResponse } from 'next/server'
import { demandesService } from '@/lib/services/demandes-service'

export async function GET() {
  try {
    const stats = await demandesService.getDemandesStats()
    return NextResponse.json(stats)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
