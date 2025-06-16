import { BaseService } from './base-service'
import type { Stagiaire, SearchFilters, Statistics, ApiResponse } from '@/lib/types'

class StagiairesService extends BaseService {
  constructor() {
    super()
  }

  async getStagiaires(filters?: SearchFilters): Promise<ApiResponse<Stagiaire[]>> {
    try {
      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            params.append(key, String(value))
          }
        })
      }

      const queryString = params.toString()
      const endpoint = queryString ? `/stagiaires?${queryString}` : '/stagiaires'

      return await this.get<Stagiaire[]>(endpoint)
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getStagiaire(id: string): Promise<ApiResponse<Stagiaire>> {
    try {
      return await this.get<Stagiaire>(`/stagiaires/${id}`)
    } catch (error) {
      return this.handleError(error)
    }
  }

  async createStagiaire(stagiaire: Partial<Stagiaire>): Promise<ApiResponse<Stagiaire>> {
    try {
      return await this.post<Stagiaire>('/stagiaires', stagiaire)
    } catch (error) {
      return this.handleError(error)
    }
  }

  async updateStagiaire(id: string, stagiaire: Partial<Stagiaire>): Promise<ApiResponse<Stagiaire>> {
    try {
      return await this.put<Stagiaire>(`/stagiaires/${id}`, stagiaire)
    } catch (error) {
      return this.handleError(error)
    }
  }

  async deleteStagiaire(id: string): Promise<ApiResponse<void>> {
    try {
      return await this.delete<void>(`/stagiaires/${id}`)
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getStagiairesStats(): Promise<ApiResponse<Statistics>> {
    try {
      return await this.get<Statistics>('/stagiaires/stats')
    } catch (error) {
      return this.handleError(error)
    }
  }

  async searchStagiaires(query: string, filters?: Record<string, any>): Promise<ApiResponse<Stagiaire[]>> {
    try {
      const params = new URLSearchParams({ q: query })
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value))
          }
        })
      }
      return await this.get<Stagiaire[]>(`/search?${params.toString()}`)
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getAll(filters?: SearchFilters): Promise<Stagiaire[]> {
    try {
      const result = await this.getStagiaires(filters)
      return result.success ? result.data || [] : []
    } catch (error) {
      console.error('Error in getAll:', error)
      return []
    }
  }

  async getAllStagiaires(): Promise<Stagiaire[]> {
    return this.getAll()
  }

  async getStagiairesByTuteur(tuteurId: string): Promise<Stagiaire[]> {
    try {
      const result = await this.getStagiaires({ tuteurId })
      return result.success ? result.data || [] : []
    } catch (error) {
      console.error('Error in getStagiairesByTuteur:', error)
      return []
    }
  }

  async create(stagiaire: Partial<Stagiaire>): Promise<Stagiaire | null> {
    try {
      const result = await this.createStagiaire(stagiaire)
      return result.success ? result.data || null : null
    } catch (error) {
      console.error('Error in create:', error)
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.deleteStagiaire(id)
      return result.success
    } catch (error) {
      console.error('Error in delete:', error)
      return false
    }
  }
}

// Export singleton instance
export const stagiaireService = new StagiairesService()
export default stagiaireService