import { NextRequest, NextResponse } from 'next/server'
import { demandesService } from '@/lib/services/demandes-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const demande = await demandesService.getDemandeById(params.id)
    if (!demande) {
      return NextResponse.json({ error: 'Demande non trouvée' }, { status: 404 })
    }
    return NextResponse.json(demande)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()
    const demande = await demandesService.updateDemande(params.id, updates)
    return NextResponse.json(demande)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await demandesService.deleteDemande(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
