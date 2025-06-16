
import { NextRequest, NextResponse } from 'next/server'
import { templatesService } from '@/lib/services/templates-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const template = await templatesService.getById(params.id)
    if (!template) {
      return NextResponse.json({ error: 'Template non trouvé' }, { status: 404 })
    }
    return NextResponse.json(template)
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
    const template = await templatesService.update(params.id, updates)
    return NextResponse.json(template)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await templatesService.delete(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
