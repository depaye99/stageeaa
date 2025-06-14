import { NextResponse } from 'next/server'
import { documentsService } from '@/lib/services/documents-service'

export async function GET() {
  try {
    const stats = await documentsService.getDocumentsStats()
    return NextResponse.json(stats)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
