
import { NextRequest, NextResponse } from 'next/server'
import { stagiaireService } from '@/lib/services/stagiaires-service'

export async function GET() {
  try {
    const stagiaires = await stagiaireService.getAll()
    return NextResponse.json(stagiaires)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
