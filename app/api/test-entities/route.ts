import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/services/server-auth-service'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Pour le test, on retourne des données statiques
    // En production, vous devriez avoir une vraie table test_entities
    const testEntities = [
      {
        id: '1',
        name: 'Entité Test 1',
        description: 'Description de test 1',
        status: 'active',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Entité Test 2',
        description: 'Description de test 2',
        status: 'inactive',
        created_at: new Date().toISOString()
      }
    ]

    return NextResponse.json({ data: testEntities })
  } catch (error: any) {
    console.error('Erreur lors de la récupération des entités de test:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des entités de test' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const body = await request.json()
    
    const newEntity = {
      id: Date.now().toString(),
      name: body.name,
      description: body.description || '',
      status: body.status || 'active',
      created_at: new Date().toISOString()
    }

    // En production, vous devriez insérer dans une vraie table
    // const { data, error } = await supabase
    //   .from('test_entities')
    //   .insert([newEntity])
    //   .select()
    //   .single()

    return NextResponse.json({ data: newEntity })
  } catch (error: any) {
    console.error('Erreur lors de la création de l\'entité:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'entité' },
      { status: 500 }
    )
  }
}
