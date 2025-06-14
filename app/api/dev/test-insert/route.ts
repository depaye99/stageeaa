import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  try {
    const supabase = createClient()
    const { table, data } = await request.json()

    if (!table || !data) {
      return NextResponse.json({ error: "Table and data are required" }, { status: 400 })
    }

    // Add timestamps
    const insertData = {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: result, error } = await supabase.from(table).insert([insertData]).select().single()

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      message: `Record inserted successfully in ${table}`,
      data: result,
    })
  } catch (error) {
    console.error("Test insert error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
