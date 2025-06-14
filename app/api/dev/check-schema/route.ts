import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  try {
    const supabase = createClient()

    // Check if users table exists and get its structure
    const { data: columns, error } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type, is_nullable, column_default")
      .eq("table_name", "users")
      .eq("table_schema", "public")
      .order("ordinal_position")

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        table_exists: false,
      })
    }

    // Test a simple insert to see what columns are actually available
    let insertTest = { success: false, error: null, available_columns: [] }
    try {
      const testData = {
        id: `test-${Date.now()}`,
        email: `test-${Date.now()}@example.com`,
        name: "Test User",
        role: "stagiaire",
      }

      const { data, error: insertError } = await supabase.from("users").insert([testData]).select().single()

      if (insertError) {
        insertTest = { success: false, error: insertError.message, available_columns: [] }
      } else {
        insertTest = { success: true, error: null, available_columns: Object.keys(data) }
        // Clean up
        await supabase.from("users").delete().eq("id", data.id)
      }
    } catch (err) {
      insertTest = { success: false, error: err.message, available_columns: [] }
    }

    return NextResponse.json({
      success: true,
      table_exists: columns && columns.length > 0,
      columns: columns || [],
      insert_test: insertTest,
      recommendations: {
        missing_columns: columns
          ? ["phone", "address", "department", "position", "avatar_url", "is_active", "last_login"].filter(
              (col) => !columns.find((c) => c.column_name === col),
            )
          : [],
      },
    })
  } catch (error) {
    console.error("Schema check error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
