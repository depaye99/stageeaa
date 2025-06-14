import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  return NextResponse.json({
    success: true,
    message: "Configuration instructions for disabling email confirmation",
    instructions: [
      "1. Go to your Supabase Dashboard",
      "2. Navigate to Authentication > Settings",
      "3. Scroll down to 'User Signups'",
      "4. DISABLE 'Enable email confirmations'",
      "5. Set 'Site URL' to: http://localhost:3000",
      "6. Add to 'Redirect URLs': http://localhost:3000/**",
      "7. Save the settings",
    ],
    alternative: "Or use the manual confirmation API below",
  })
}
