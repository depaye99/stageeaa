
import { NextRequest, NextResponse } from 'next/server'
import { notificationsService } from '@/lib/services/notifications-service'

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 })
    }
    
    await notificationsService.markAllAsRead(userId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
