
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv'
  type: 'stagiaires' | 'demandes' | 'evaluations' | 'documents'
  filters?: Record<string, any>
}

export const exportService = {
  async exportData(options: ExportOptions) {
    try {
      const response = await fetch(`/api/export/${options.type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format: options.format,
          filters: options.filters
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'exportation')
      }

      // Télécharger le fichier
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `export-${options.type}-${Date.now()}.${options.format === 'excel' ? 'xlsx' : options.format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      return { success: true }
    } catch (error) {
      console.error('Export error:', error)
      return { success: false, error }
    }
  },

  async exportToPDF(data: any[], type: string) {
    return this.exportData({
      format: 'pdf',
      type: type as any,
      filters: { data }
    })
  },

  async exportToExcel(data: any[], type: string) {
    return this.exportData({
      format: 'excel',
      type: type as any,
      filters: { data }
    })
  },

  async exportToCSV(data: any[], type: string) {
    return this.exportData({
      format: 'csv',
      type: type as any,
      filters: { data }
    })
  }
}
