
import { BaseService } from './base-service'
import type { Document, DocumentInsert, DocumentUpdate } from '@/lib/types'

export class DocumentsService extends BaseService {
  private readonly tableName = 'documents'

  async getAllDocuments(filters?: Record<string, any>): Promise<Document[]> {
    let query = this.supabase
      .from(this.tableName)
      .select(`
        *,
        stagiaire:stagiaires(nom, prenom, email)
      `)

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'stagiaireId') {
            query = query.eq('stagiaire_id', value)
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

  async getDocumentById(id: string): Promise<Document | null> {
    return this.getById<Document>(this.tableName, id, `
      *,
      stagiaire:stagiaires(nom, prenom, email)
    `)
  }

  async createDocument(document: DocumentInsert): Promise<Document> {
    return this.create<Document>(this.tableName, document)
  }

  async updateDocument(id: string, updates: DocumentUpdate): Promise<Document> {
    return this.update<Document>(this.tableName, id, updates)
  }

  async deleteDocument(id: string): Promise<void> {
    return this.delete(this.tableName, id)
  }

  async getDocumentsStats(): Promise<any> {
    const total = await this.getCount(this.tableName)
    const parType = await this.getDocumentsByType()

    return {
      total,
      par_type: parType
    }
  }

  async getDocumentsByType(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('type')
      .order('type')

    if (error) throw error

    const typeCounts = (data || []).reduce((acc: Record<string, number>, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1
      return acc
    }, {})

    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count
    }))
  }

  async getDocumentsByStagiaire(stagiaireId: string): Promise<Document[]> {
    return this.getAllDocuments({ stagiaireId })
  }
}

export const documentsService = new DocumentsService()
