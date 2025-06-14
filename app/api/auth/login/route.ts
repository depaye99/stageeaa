import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      let errorMessage = "Identifiants incorrects"
      
      // Personnaliser le message selon le type d'erreur
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email ou mot de passe incorrect"
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Veuillez confirmer votre email avant de vous connecter"
      } else if (error.message.includes("Too many requests")) {
        errorMessage = "Trop de tentatives de connexion. Veuillez réessayer plus tard"
      }
      
      return NextResponse.json({ error: errorMessage }, { status: 401 })
    }

    // Récupérer les informations utilisateur complètes
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    return NextResponse.json({
      user: userData,
      session: data.session,
    })
  } catch (error) {
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
