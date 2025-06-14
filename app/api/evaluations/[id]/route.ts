import { NextRequest, NextResponse } from 'next/server'
import { evaluationsService } from '@/lib/services/evaluations-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const evaluation = await evaluationsService.getById(params.id)
    if (!evaluation) {
      return NextResponse.json({ error: 'Évaluation non trouvée' }, { status: 404 })
    }
    return NextResponse.json(evaluation)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { evaluation, competences } = await request.json()
    const updatedEvaluation = await evaluationsService.update(params.id, evaluation, competences)
    return NextResponse.json(updatedEvaluation)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await evaluationsService.delete(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
