import { NextRequest, NextResponse } from 'next/server'
import { usersService } from '@/lib/services/users-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    if (role) {
      const users = await usersService.getUsersByRole(role)
      return NextResponse.json(users)
    }

    const users = await usersService.getAllUsers()
    return NextResponse.json(users)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    const user = await usersService.createUser(userData)
    return NextResponse.json(user, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
