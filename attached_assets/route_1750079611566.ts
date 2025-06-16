
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    
    const query = searchParams.get('q') || searchParams.get('query') || ''
    const type = searchParams.get('type') || 'all'
    const filters = {
      statut: searchParams.get('statut'),
      departement: searchParams.get('departement'),
      periode: searchParams.get('periode')
    }

    let results = {
      stagiaires: [],
      demandes: [],
      documents: [],
      users: []
    }

    if (!query && type === 'all') {
      return NextResponse.json({ 
        results, 
        message: 'Query parameter is required' 
      }, { status: 400 })
    }

    // Recherche dans les stagiaires
    if (type === 'all' || type === 'stagiaires') {
      try {
        let stagiaireQuery = supabase
          .from('stagiaires')
          .select(`
            *,
            users(name, email)
          `)

        if (query) {
          stagiaireQuery = stagiaireQuery.or(
            `nom.ilike.%${query}%,prenom.ilike.%${query}%,email.ilike.%${query}%,etablissement.ilike.%${query}%`
          )
        }

        if (filters.statut) {
          stagiaireQuery = stagiaireQuery.eq('statut', filters.statut)
        }

        if (filters.departement) {
          stagiaireQuery = stagiaireQuery.eq('specialite', filters.departement)
        }

        const { data: stagiaires, error } = await stagiaireQuery.limit(20)
        
        if (error) {
          console.error('Error searching stagiaires:', error)
        } else {
          results.stagiaires = stagiaires || []
        }
      } catch (error) {
        console.error('Error in stagiaires search:', error)
      }
    }

    // Recherche dans les demandes
    if (type === 'all' || type === 'demandes') {
      try {
        let demandeQuery = supabase
          .from('demandes')
          .select(`
            *,
            stagiaire:stagiaires(nom, prenom, email)
          `)

        if (query) {
          demandeQuery = demandeQuery.or(
            `type.ilike.%${query}%,statut.ilike.%${query}%,details.ilike.%${query}%`
          )
        }

        const { data: demandes, error } = await demandeQuery.limit(20)
        
        if (error) {
          console.error('Error searching demandes:', error)
        } else {
          results.demandes = demandes || []
        }
      } catch (error) {
        console.error('Error in demandes search:', error)
      }
    }

    // Recherche dans les documents
    if (type === 'all' || type === 'documents') {
      try {
        let documentQuery = supabase
          .from('documents')
          .select(`
            *,
            stagiaire:stagiaires(nom, prenom, email)
          `)

        if (query) {
          documentQuery = documentQuery.or(
            `nom.ilike.%${query}%,description.ilike.%${query}%,type.ilike.%${query}%`
          )
        }

        const { data: documents, error } = await documentQuery.limit(20)
        
        if (error) {
          console.error('Error searching documents:', error)
        } else {
          results.documents = documents || []
        }
      } catch (error) {
        console.error('Error in documents search:', error)
      }
    }

    return NextResponse.json({ 
      results,
      query,
      type,
      filters
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
