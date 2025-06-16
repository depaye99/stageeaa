import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { email, password } = body

    // Validation des champs requis
    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
    }

    // Tentative de connexion
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error("Auth signin error:", authError)

      // Messages d'erreur personnalisés
      if (authError.message.includes("Invalid login credentials")) {
        return NextResponse.json(
          {
            error: `Identifiants invalides pour ${email}. Vérifiez votre email et mot de passe, ou créez un compte si vous n'en avez pas.`,
          },
          { status: 401 },
        )
      }

      if (authError.message.includes("Email not confirmed")) {
        return NextResponse.json(
          {
            error: "Email non confirmé. Vérifiez votre boîte mail et cliquez sur le lien de confirmation.",
          },
          { status: 401 },
        )
      }

      return NextResponse.json({ error: authError.message }, { status: 401 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Erreur de connexion" }, { status: 401 })
    }

    // Récupérer ou créer le profil utilisateur
    let { data: profile } = await supabase.from("users").select("*").eq("id", authData.user.id).single()

    // Si le profil n'existe pas, le créer
    if (!profile) {
      const { data: newProfile, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email!,
            name: authData.user.user_metadata?.name || authData.user.email!.split("@")[0],
            role: authData.user.user_metadata?.role || "stagiaire",
            phone: authData.user.user_metadata?.phone || null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (insertError) {
        console.error("Profile creation error:", insertError)
      } else {
        profile = newProfile
      }
    }

    // Mettre à jour la dernière connexion
    await supabase
      .from("users")
      .update({
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", authData.user.id)

    return NextResponse.json({
      success: true,
      user: profile || {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name || authData.user.email!.split("@")[0],
        role: authData.user.user_metadata?.role || "stagiaire",
      },
      message: "Connexion réussie",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Erreur serveur lors de la connexion" }, { status: 500 })
  }
}
