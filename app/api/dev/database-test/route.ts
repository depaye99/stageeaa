import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Test 1: Check if tables exist and count records
    const tables = ["users", "stagiaires", "demandes", "documents", "evaluations", "notifications", "templates"]
    const tableStatus = {}

    for (const table of tables) {
      try {
        const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true })

        if (error) {
          tableStatus[table] = { exists: false, error: error.message, count: 0 }
        } else {
          tableStatus[table] = { exists: true, error: null, count: count || 0 }
        }
      } catch (err) {
        tableStatus[table] = { exists: false, error: err.message, count: 0 }
      }
    }

    // Test 2: Try to insert a test record
    let insertTest = { success: false, error: null }
    try {
      const testUser = {
        email: `test-${Date.now()}@example.com`,
        name: "Test User",
        role: "stagiaire",
        is_active: true,
      }

      const { data, error } = await supabase.from("users").insert([testUser]).select().single()

      if (error) {
        insertTest = { success: false, error: error.message }
      } else {
        insertTest = { success: true, error: null }
        // Clean up test record
        await supabase.from("users").delete().eq("id", data.id)
      }
    } catch (err) {
      insertTest = { success: false, error: err.message }
    }

    // Test 3: Check RLS policies
    const rlsStatus = {}
    for (const table of tables) {
      try {
        const { data, error } = await supabase.rpc("check_rls_status", { table_name: table })
        rlsStatus[table] = { rls_enabled: data || false, error: error?.message || null }
      } catch (err) {
        rlsStatus[table] = { rls_enabled: "unknown", error: err.message }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      database_connection: "OK",
      tables: tableStatus,
      insert_test: insertTest,
      rls_status: rlsStatus,
      summary: {
        total_tables: tables.length,
        existing_tables: Object.values(tableStatus).filter((t: any) => t.exists).length,
        total_records: Object.values(tableStatus).reduce((sum: number, t: any) => sum + (t.count || 0), 0),
      },
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { action } = await request.json()

    if (action === "create_sample_data") {
      // Create sample data for testing
      const sampleUser = {
        email: `sample-${Date.now()}@example.com`,
        name: "Sample User",
        role: "stagiaire",
        phone: "+33123456789",
        is_active: true,
      }

      const { data: user, error: userError } = await supabase.from("users").insert([sampleUser]).select().single()

      if (userError) {
        throw new Error(`Failed to create user: ${userError.message}`)
      }

      // Create sample stagiaire
      const sampleStagiaire = {
        user_id: user.id,
        entreprise: "Sample Corp",
        poste: "Développeur",
        statut: "actif",
      }

      const { data: stagiaire, error: stagiaireError } = await supabase
        .from("stagiaires")
        .insert([sampleStagiaire])
        .select()
        .single()

      if (stagiaireError) {
        throw new Error(`Failed to create stagiaire: ${stagiaireError.message}`)
      }

      // Create sample demande
      const sampleDemande = {
        stagiaire_id: stagiaire.id,
        type: "stage_academique",
        titre: "Demande de test",
        description: "Ceci est une demande de test",
        statut: "en_attente",
      }

      const { error: demandeError } = await supabase.from("demandes").insert([sampleDemande])

      if (demandeError) {
        throw new Error(`Failed to create demande: ${demandeError.message}`)
      }

      return NextResponse.json({
        success: true,
        message: "Sample data created successfully",
        created: {
          user: user.id,
          stagiaire: stagiaire.id,
        },
      })
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (error) {
    console.error("Database test POST error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
