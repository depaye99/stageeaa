import { NextRequest, NextResponse } from 'next/server'
import { demandesService } from '@/lib/services/demandes-service'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, message } = await request.json()
    const commentaire = await demandesService.addCommentaire(params.id, userId, message)
    return NextResponse.json(commentaire, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
