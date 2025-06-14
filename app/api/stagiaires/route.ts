import { NextRequest, NextResponse } from 'next/server'
import { stagiaireService } from '@/lib/services/stagiaires-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tuteurId = searchParams.get('tuteurId')
    const search = searchParams.get('search')
    const statut = searchParams.get('statut')
    const departement = searchParams.get('departement')

    if (search) {
      const result = await stagiaireService.searchStagiaires(search, {
        statut: statut || undefined,
        departement: departement || undefined,
        tuteurId: tuteurId || undefined
      })
      const stagiaires = result.success ? result.data : []
      return NextResponse.json(stagiaires)
    }

    if (tuteurId) {
      const stagiaires = await stagiaireService.getStagiairesByTuteur(tuteurId)
      return NextResponse.json(stagiaires)
    }

    const stagiaires = await stagiaireService.getAllStagiaires()
    return NextResponse.json(stagiaires)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const stagiaireData = await request.json()
    const result = await stagiaireService.createStagiaire(stagiaireData)
    if (result.success) {
      return NextResponse.json(result.data, { status: 201 })
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
