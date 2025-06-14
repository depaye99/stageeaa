import { NextRequest, NextResponse } from 'next/server'
import { documentsService } from '@/lib/services/documents-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      type: searchParams.get('type') || undefined,
      format: searchParams.get('format') || undefined,
      stagiaireId: searchParams.get('stagiaireId') || undefined,
    }

    const documents = await documentsService.getAllDocuments(filters)
    return NextResponse.json(documents)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const metadata = JSON.parse(formData.get('metadata') as string)

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    const document = await documentsService.uploadDocument(file, metadata)
    return NextResponse.json(document, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
