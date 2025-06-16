
import { NextRequest, NextResponse } from 'next/server'
import { notificationsService } from '@/lib/services/notifications-service'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await notificationsService.markAsRead(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
