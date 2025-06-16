import type { 
  Stagiaire, StagiaireInsert, StagiaireUpdate,
  Demande, DemandeInsert, DemandeUpdate,
  Document, DocumentInsert, DocumentUpdate,
  User, UserInsert, UserUpdate,
  Template, TemplateInsert, TemplateUpdate,
  ApiResponse, PaginatedResponse
} from '@/lib/types'

// Configuration API centralisée
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

// Utilitaire pour les requêtes API
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.error || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Request failed:', error)
    throw error
  }
}

// Service générique pour les opérations CRUD
class GenericApiService<T, TInsert, TUpdate> {
  constructor(private endpoint: string) {}

  async getAll(filters?: Record<string, any>): Promise<T[]> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    const query = params.toString() ? `?${params}` : ''
    return apiRequest<T[]>(`${this.endpoint}${query}`)
  }

  async getById(id: string): Promise<T> {
    return apiRequest<T>(`${this.endpoint}/${id}`)
  }

  async create(data: TInsert): Promise<T> {
    return apiRequest<T>(this.endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async update(id: string, data: TUpdate): Promise<T> {
    return apiRequest<T>(`${this.endpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete(id: string): Promise<void> {
    return apiRequest<void>(`${this.endpoint}/${id}`, {
      method: 'DELETE',
    })
  }

  async getStats(): Promise<any> {
    return apiRequest<any>(`${this.endpoint}/stats`)
  }
}

// Classes spécialisées avec méthodes spécifiques
class StagiairesApiService extends GenericApiService<Stagiaire, StagiaireInsert, StagiaireUpdate> {
  constructor() {
    super('/api/stagiaires')
  }

  async getStagiairesStats(): Promise<any> {
    return apiRequest<any>(`${this.endpoint}/stats`)
  }

  async searchStagiaires(searchTerm: string, filters?: Record<string, any>): Promise<Stagiaire[]> {
    const params = new URLSearchParams()
    params.append('search', searchTerm)
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    return apiRequest<Stagiaire[]>(`${this.endpoint}?${params}`)
  }

  async getStagiairesByTuteur(tuteurId: string): Promise<Stagiaire[]> {
    return apiRequest<Stagiaire[]>(`${this.endpoint}?tuteurId=${tuteurId}`)
  }
}

class DemandesApiService extends GenericApiService<Demande, DemandeInsert, DemandeUpdate> {
  constructor() {
    super('/api/demandes')
  }

  async getDemandesStats(): Promise<any> {
    return apiRequest<any>(`${this.endpoint}/stats`)
  }

  async getAllDemandes(filters?: Record<string, any>): Promise<Demande[]> {
    return this.getAll(filters)
  }

  async approuveDemande(id: string, commentaire?: string): Promise<Demande> {
    return apiRequest<Demande>(`${this.endpoint}/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ commentaire }),
    })
  }

  async rejeterDemande(id: string, motif: string): Promise<Demande> {
    return apiRequest<Demande>(`${this.endpoint}/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ motif }),
    })
  }

  async getDemandesByStatut(statut: string): Promise<Demande[]> {
    return apiRequest<Demande[]>(`${this.endpoint}?statut=${statut}`)
  }

  async getDemandesByStagiaire(stagiaireId: string): Promise<Demande[]> {
    return apiRequest<Demande[]>(`${this.endpoint}?stagiaireId=${stagiaireId}`)
  }

  async getDemandesByTuteur(tuteurId: string): Promise<Demande[]> {
    return apiRequest<Demande[]>(`${this.endpoint}?tuteurId=${tuteurId}`)
  }
}

class DocumentsApiService extends GenericApiService<Document, DocumentInsert, DocumentUpdate> {
  constructor() {
    super('/api/documents')
  }

  async getDocumentsStats(): Promise<any> {
    return apiRequest<any>(`${this.endpoint}/stats`)
  }

  async getDocumentsByStagiaire(stagiaireId: string): Promise<Document[]> {
    return apiRequest<Document[]>(`${this.endpoint}?stagiaireId=${stagiaireId}`)
  }

  async getDocumentsByType(): Promise<any[]> {
    return apiRequest<any[]>(`${this.endpoint}?groupBy=type`)
  }
}

class UsersApiService extends GenericApiService<User, UserInsert, UserUpdate> {
  constructor() {
    super('/api/users')
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return apiRequest<User[]>(`${this.endpoint}?role=${role}`)
  }

  async updateUserRole(id: string, role: string): Promise<User> {
    return apiRequest<User>(`${this.endpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    })
  }
}

// Export des instances spécialisées
export const stagiairesApiService = new StagiairesApiService()
export const demandesApiService = new DemandesApiService()
export const documentsApiService = new DocumentsApiService()
export const usersApiService = new UsersApiService()

// Extensions spécifiques pour certains services
export const demandesApiServiceExtended = {
  ...demandesApiService,

  async approve(id: string, commentaire?: string): Promise<Demande> {
    return apiRequest<Demande>(`/api/demandes/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ commentaire }),
    })
  },

  async reject(id: string, motif: string): Promise<Demande> {
    return apiRequest<Demande>(`/api/demandes/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ motif }),
    })
  },

  async addComment(id: string, commentaire: string): Promise<void> {
    return apiRequest<void>(`/api/demandes/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ commentaire }),
    })
  }
}

// Export de l'objet api pour les tests CRUD (maintient la compatibilité)
export const api = {
  testEntities: {
    async getAll(): Promise<any[]> {
      return apiRequest<any[]>("/api/test-entities")
    },

    async getById(id: string): Promise<any> {
      return apiRequest<any>(`/api/test-entities/${id}`)
    },

    async create(entity: any): Promise<any> {
      return apiRequest<any>("/api/test-entities", {
        method: "POST",
        body: JSON.stringify(entity),
      })
    },

    async update(id: string, entity: any): Promise<any> {
      return apiRequest<any>(`/api/test-entities/${id}`, {
        method: "PUT",
        body: JSON.stringify(entity),
      })
    },

    async delete(id: string): Promise<void> {
      return apiRequest<void>(`/api/test-entities/${id}`, { 
        method: "DELETE" 
      })
    },
  }
}

// Services de recherche et statistiques
export const searchApiService = {
  async globalSearch(query: string, filters?: Record<string, any>): Promise<any> {
    const params = new URLSearchParams({ query })
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    return apiRequest<any>(`/api/search?${params}`)
  }
}

export const reportsApiService = {
  async getMonthlyStats(period: string, department?: string): Promise<any> {
    const params = new URLSearchParams({ period })
    if (department && department !== 'all') {
      params.append('department', department)
    }
    return apiRequest<any>(`/api/reports/monthly?${params}`)
  },

  async getDepartmentStats(period: string): Promise<any> {
    return apiRequest<any>(`/api/reports/departments?period=${period}`)
  },

  async getPerformanceStats(period: string): Promise<any> {
    return apiRequest<any>(`/api/reports/performance?period=${period}`)
  },

  async getSchoolsStats(period: string): Promise<any> {
    return apiRequest<any>(`/api/reports/schools?period=${period}`)
  },

  async getRequestTypesStats(period: string): Promise<any> {
    return apiRequest<any>(`/api/reports/request-types?period=${period}`)
  }
}

// Service d'export
export const exportService = {
  async exportToCSV(type: "demandes" | "stagiaires" | "documents", filters?: any): Promise<Blob> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }

    const response = await fetch(`/api/export/${type}?format=csv&${params}`)
    if (!response.ok) {
      throw new Error('Erreur lors de l\'export CSV')
    }
    return response.blob()
  },

  async exportToPDF(type: "demandes" | "stagiaires" | "documents", filters?: any): Promise<Blob> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }

    const response = await fetch(`/api/export/${type}?format=pdf&${params}`)
    if (!response.ok) {
      throw new Error('Erreur lors de l\'export PDF')
    }
    return response.blob()
  }
}