import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Get the user by email
    const { data: users, error: getUserError } = await supabase.auth.admin.listUsers()

    if (getUserError) {
      return NextResponse.json({ error: getUserError.message }, { status: 500 })
    }

    const user = users.users.find((u) => u.email === email)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.email_confirmed_at) {
      return NextResponse.json({
        success: true,
        message: "User email is already confirmed",
        user: {
          email: user.email,
          confirmed: true,
        },
      })
    }

    // Confirm the user's email
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      email_confirm: true,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Email confirmed for ${email}`,
      user: {
        email: data.user.email,
        confirmed: true,
      },
    })
  } catch (error) {
    console.error("Dev confirm email error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  try {
    const supabase = createClient()

    // List all unconfirmed users
    const { data: users, error } = await supabase.auth.admin.listUsers()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const unconfirmedUsers = users.users
      .filter((user) => !user.email_confirmed_at)
      .map((user) => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      }))

    return NextResponse.json({
      success: true,
      unconfirmed_users: unconfirmedUsers,
      count: unconfirmedUsers.length,
    })
  } catch (error) {
    console.error("Dev list unconfirmed users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
