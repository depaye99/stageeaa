import { stagiaireService } from "./stagiaires-service"
import { demandesService } from "./demandes-service"
import { documentsService } from "./documents-service"
import { evaluationsService } from "./evaluations-service"
import { notificationsService } from "./notifications-service"
import { usersService } from "./users-service"
import { templatesService } from "./templates-service"

// Export des services pour l'API
export const stagiairesApiService = stagiaireService
export const demandesApiService = demandesService
export const documentsApiService = documentsService
export const evaluationsApiService = evaluationsService
export const notificationsApiService = notificationsService
export const usersApiService = usersService
export const templatesApiService = templatesService

// Types pour l'API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Utilitaires pour les réponses API
export const createSuccessResponse = <T>(data: T, message?: string): ApiResponse<T> => ({\
  success: true,
  data,
  message
})

export const createErrorResponse = (error: string): ApiResponse => ({\
  success: false,
  error
})

export const createPaginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number\
): PaginatedResponse<T[]> => ({\
  success: true,
  data,
  pagination: {
    page,
    limit,
    total,\
    totalPages: Math.ceil(total / limit)
  }
})

// Configuration API
export const API_CONFIG = {\
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
}

// Client API générique
export class ApiClient {\
  private baseUrl: string
  private timeout: number

  constructor(baseUrl: string = API_CONFIG.BASE_URL, timeout: number = API_CONFIG.TIMEOUT) {
    this.baseUrl = baseUrl\
    this.timeout = timeout
  }
\
  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {\
    const url = `${this.baseUrl}${endpoint}`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {\
      const response = await fetch(url, {
        ...options,\
        signal: controller.signal,
        headers: {
          'Content-Type\': \'application/json',
          ...options.headers
        }
      })

      clearTimeout(timeoutId)

      if (!response.ok) {\
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      clearTimeout(timeoutId)
      \
      if (error instanceof Error) {\
        if (error.name === 'AbortError') {\
          throw new Error('Request timeout')
        }
        throw error
      }
      
      throw new Error('Unknown error occurred')
    }
  }
\
  async get<T = any>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {\
    const url = new URL(endpoint, this.baseUrl)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    return this.request<T>(url.pathname + url.search)
  }
\
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {\
    return this.request<T>(endpoint, {\
      method: \'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }
\
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {\
    return this.request<T>(endpoint, {\
      method: \'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }
\
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {\
    return this.request<T>(endpoint, {
      method: 'DELETE'
    })
  }
}

// Instance par défaut du client API
export const apiClient = new ApiClient()
