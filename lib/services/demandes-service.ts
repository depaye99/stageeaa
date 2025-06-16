import { BaseService } from './base-service'
import type { Demande, DemandeInsert, DemandeUpdate } from '@/lib/types'

class DemandesService extends BaseService {
  private readonly tableName = 'demandes'

  constructor() {
    super()
  }

  async getAllDemandes(filters?: Record<string, any>): Promise<Demande[]> {
    let query = this.supabase
      .from(this.tableName)
      .select(`
        *,
        stagiaire:stagiaires(nom, prenom, email),
        tuteur:users!demandes_tuteur_id_fkey(name, email)
      `)

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'stagiaireId') {
            query = query.eq('stagiaire_id', value)
          } else if (key === 'tuteurId') {
            query = query.eq('tuteur_id', value)
          } else {
            query = query.eq(key, value)
          }
        }
      })
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getDemandeById(id: string): Promise<Demande | null> {
    return this.getById<Demande>(this.tableName, id, `
      *,
      stagiaire:stagiaires(nom, prenom, email),
      tuteur:users!demandes_tuteur_id_fkey(name, email)
    `)
  }

  async createDemande(demande: DemandeInsert): Promise<Demande> {
    return this.create<Demande>(this.tableName, demande)
  }

  async updateDemande(id: string, updates: DemandeUpdate): Promise<Demande> {
    return this.update<Demande>(this.tableName, id, updates)
  }

  async deleteDemande(id: string): Promise<void> {
    return this.delete(this.tableName, id)
  }

  async approuveDemande(id: string, commentaire?: string): Promise<Demande> {
    return this.updateDemande(id, {
      statut: 'approuvee',
      commentaire_tuteur: commentaire,
      updated_at: new Date().toISOString()
    })
  }

  async rejeterDemande(id: string, motif: string): Promise<Demande> {
    return this.updateDemande(id, {
      statut: 'refusee',
      motif_refus: motif,
      updated_at: new Date().toISOString()
    })
  }

  async getDemandesStats(): Promise<any> {
    const total = await this.getCount(this.tableName)
    const enAttente = await this.getCount(this.tableName, { statut: 'en_attente' })
    const approuvees = await this.getCount(this.tableName, { statut: 'approuvee' })
    const refusees = await this.getCount(this.tableName, { statut: 'refusee' })

    return {
      total,
      en_attente: enAttente,
      approuvees,
      refusees
    }
  }

  async getDemandesByStatut(statut: string): Promise<Demande[]> {
    return this.getAllDemandes({ statut })
  }

  async getDemandesByStagiaire(stagiaireId: string): Promise<Demande[]> {
    return this.getAllDemandes({ stagiaireId })
  }

  async getDemandesByTuteur(tuteurId: string): Promise<Demande[]> {
    return this.getAllDemandes({ tuteurId })
  }
}

// Export singleton instance
export const demandesService = new DemandesService()
export default demandesService