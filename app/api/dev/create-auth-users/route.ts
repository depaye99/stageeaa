import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  try {
    const supabase = createClient()

    const testUsers = [
      { email: "admin@test.com", password: "password123", name: "Admin Test", role: "admin" },
      { email: "rh@test.com", password: "password123", name: "RH Test", role: "rh" },
      { email: "tuteur@test.com", password: "password123", name: "Tuteur Test", role: "tuteur" },
      { email: "stagiaire@test.com", password: "password123", name: "Stagiaire Test", role: "stagiaire" },
    ]

    const results = []

    for (const user of testUsers) {
      try {
        // Try to create the user in Supabase Auth
        const { data, error } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            name: user.name,
            role: user.role,
          },
        })

        if (error) {
          if (error.message.includes("already registered")) {
            results.push({ email: user.email, status: "already_exists" })
          } else {
            results.push({ email: user.email, status: "error", error: error.message })
          }
        } else {
          // Update our users table with the correct ID
          const { error: updateError } = await supabase.from("users").upsert({
            id: data.user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (updateError) {
            results.push({ email: user.email, status: "auth_created_db_error", error: updateError.message })
          } else {
            results.push({ email: user.email, status: "created", id: data.user.id })
          }
        }
      } catch (err) {
        results.push({
          email: user.email,
          status: "error",
          error: err instanceof Error ? err.message : "Unknown error",
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Test users creation attempted",
      results,
    })
  } catch (error) {
    console.error("Dev create auth users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
