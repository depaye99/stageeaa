import { NextRequest, NextResponse } from 'next/server'
import { templatesService } from '@/lib/services/templates-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      type: searchParams.get('type') || undefined,
    }

    const templates = await templatesService.getAll(filters)
    return NextResponse.json(templates)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const templateData = await request.json()
    const template = await templatesService.create(templateData)
    return NextResponse.json(template, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
