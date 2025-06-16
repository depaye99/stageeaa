
import { createClient } from '@/lib/supabase/client'
import type { Database } from "../supabase/database.types"

export interface Template {
  id: string
  nom: string
  type: string
  contenu: string
  variables: string[]
  created_at: string
  updated_at: string
}

export interface TemplateInsert {
  nom: string
  type: string
  contenu: string
  variables?: string[]
}

export interface TemplateUpdate {
  nom?: string
  type?: string
  contenu?: string
  variables?: string[]
}

export class TemplatesService {
  private supabase = createClient()

  async getAll(): Promise<Template[]> {
    try {
      const { data, error } = await this.supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur lors de la récupération des templates:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erreur dans getAll templates:', error)
      return []
    }
  }

  async getById(id: string): Promise<Template | null> {
    try {
      const { data, error } = await this.supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Erreur lors de la récupération du template:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erreur dans getById template:', error)
      return null
    }
  }

  async create(template: TemplateInsert): Promise<Template | null> {
    try {
      const { data, error } = await this.supabase
        .from('templates')
        .insert([template])
        .select()
        .single()

      if (error) {
        console.error('Erreur lors de la création du template:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erreur dans create template:', error)
      return null
    }
  }

  async update(id: string, template: TemplateUpdate): Promise<Template | null> {
    try {
      const { data, error } = await this.supabase
        .from('templates')
        .update(template)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erreur lors de la mise à jour du template:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erreur dans update template:', error)
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('templates')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erreur lors de la suppression du template:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Erreur dans delete template:', error)
      return false
    }
  }

  async create(template: TemplateInsert): Promise<Template> {
    // Simulated creation
    const newTemplate: Template = {
      id: Date.now().toString(),
      ...template,
      variables: template.variables || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    return newTemplate
  }

  async update(id: string, updates: TemplateUpdate): Promise<Template | null> {
    const template = await this.getById(id)
    if (!template) return null
    
    return {
      ...template,
      ...updates,
      updated_at: new Date().toISOString()
    }
  }

  async delete(id: string): Promise<void> {
    // Simulated deletion
    console.log(`Template ${id} deleted`)
  }

  async generateDocument(templateId: string, variables: Record<string, string>): Promise<string> {
    const template = await this.getById(templateId)
    if (!template) throw new Error('Template not found')
    
    let content = template.contenu
    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value)
    })
    
    return content
  }

  extractVariables(content: string): string[] {
    const matches = content.match(/{{(\w+)}}/g) || []
    return matches.map(match => match.replace(/[{}]/g, ''))
  }
}

export const templatesService = new TemplatesService()
