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

    // Call the SQL function to confirm user
    const { data, error } = await supabase.rpc("confirm_user_email", {
      user_email: email,
    })

    if (error) {
      console.error("Error confirming user:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `User ${email} has been confirmed`,
    })
  } catch (error) {
    console.error("Dev confirm user error:", error)
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

    // Get list of unconfirmed users
    const { data, error } = await supabase.rpc("list_unconfirmed_users")

    if (error) {
      console.error("Error listing unconfirmed users:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      unconfirmed_users: data || [],
    })
  } catch (error) {
    console.error("Dev list users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
