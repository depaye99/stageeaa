import { NextRequest, NextResponse } from 'next/server'
import { documentsService } from '@/lib/services/documents-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const document = await documentsService.getDocumentById(params.id)
    if (!document) {
      return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 })
    }
    return NextResponse.json(document)
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
    const document = await documentsService.updateDocument(params.id, updates)
    return NextResponse.json(document)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await documentsService.deleteDocument(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
