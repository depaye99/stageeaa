
import { NextRequest, NextResponse } from 'next/server'
import { templatesService } from '@/lib/services/templates-service'

export async function GET() {
  try {
    const templates = await templatesService.getAll()
    return NextResponse.json(templates)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const template = await templatesService.create(data)
    return NextResponse.json(template, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
