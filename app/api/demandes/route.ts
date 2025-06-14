import { NextRequest, NextResponse } from 'next/server'
import { demandesService } from '@/lib/services/demandes-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      statut: searchParams.get('statut') || undefined,
      type: searchParams.get('type') || undefined,
      stagiaireId: searchParams.get('stagiaireId') || undefined,
      tuteurId: searchParams.get('tuteurId') || undefined,
    }

    const demandes = await demandesService.getAllDemandes(filters)
    return NextResponse.json(demandes)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const demandeData = await request.json()
    const demande = await demandesService.createDemande(demandeData)
    return NextResponse.json(demande, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
