import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Configuration Supabase avec variables d'environnement sécurisées
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration')
}

// Client Supabase avec clé de service pour bypasser RLS
const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase configuration error' },
        { status: 500 }
      )
    }

    const { email, password, nom, prenom, telephone, role } = await request.json()

    // Validation des champs requis
    if (!email || !password || !nom || !prenom) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      )
    }

    // Créer l'utilisateur avec le client admin
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        nom,
        prenom,
        telephone,
        role: role || 'stagiaire'
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    // Créer l'enregistrement dans la table users
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name: `${prenom} ${nom}`,
        role: role || 'stagiaire',
        phone: telephone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (userError) {
      console.error('User table error:', userError)
      // Optionnel: supprimer l'utilisateur auth si l'insertion dans users échoue
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Erreur lors de la création du profil utilisateur' },
        { status: 500 }
      )
    }

    // Si c'est un stagiaire, créer aussi l'enregistrement dans la table stagiaires
    if (role === 'stagiaire' || !role) {
      const { error: stagiaireError } = await supabaseAdmin
        .from('stagiaires')
        .insert({
          id: crypto.randomUUID(),
          user_id: authData.user.id,
          nom,
          prenom,
          email,
          telephone,
          statut: 'en_attente',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (stagiaireError) {
        console.error('Stagiaire table error:', stagiaireError)
        // Nous continuons même si cette insertion échoue car l'utilisateur principal est créé
      }
    }

    return NextResponse.json(
      { 
        message: 'Compte créé avec succès', 
        user: {
          id: authData.user.id,
          email: authData.user.email,
          nom,
          prenom,
          role: role || 'stagiaire'
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
