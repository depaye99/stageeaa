import { NextRequest, NextResponse } from 'next/server'
import { notificationsService } from '@/lib/services/notifications-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 })
    }

    const notifications = unreadOnly 
      ? await notificationsService.getUnread(userId)
      : await notificationsService.getAll(userId)
    
    return NextResponse.json(notifications)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const notificationData = await request.json()
    const notification = await notificationsService.create(notificationData)
    return NextResponse.json(notification, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
