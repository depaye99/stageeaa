import { createClient } from '@/lib/supabase/client'
import type { Database } from "../supabase/database.types"

export type Evaluation = Database["public"]["Tables"]["evaluations"]["Row"]
export type EvaluationInsert = Database["public"]["Tables"]["evaluations"]["Insert"]
export type EvaluationUpdate = Database["public"]["Tables"]["evaluations"]["Update"]

export class EvaluationsService {
  private supabase = createClient()

  async getAll() {
    const { data, error } = await this.supabase
      .from('evaluations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async getById(id: string) {
    const { data, error } = await this.supabase
      .from('evaluations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async create(evaluation: EvaluationInsert) {
    const { data, error } = await this.supabase
      .from('evaluations')
      .insert(evaluation)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async update(id: string, updates: EvaluationUpdate) {
    const { data, error } = await this.supabase
      .from('evaluations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async delete(id: string) {
    const { error } = await this.supabase
      .from('evaluations')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async getByStagiaire(stagiaireId: string) {
    const { data, error } = await this.supabase
      .from('evaluations')
      .select('*')
      .eq('stagiaire_id', stagiaireId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async getByTuteur(tuteurId: string) {
    const { data, error } = await this.supabase
      .from('evaluations')
      .select('*')
      .eq('tuteur_id', tuteurId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}

export const evaluationsService = new EvaluationsService()