import type React from "react"
// Types de base pour l'application
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "rh" | "tuteur" | "stagiaire"
  phone?: string
  created_at: string
  updated_at: string
}

export interface Stagiaire {
  id: string
  user_id: string
  nom: string
  prenom: string
  email: string
  telephone?: string
  ecole?: string
  niveau?: string
  departement?: string
  specialite?: string
  tuteur_id?: string
  date_debut?: string
  date_fin?: string
  statut: "en_attente" | "actif" | "termine" | "suspendu"
  created_at: string
  updated_at: string
  users?: User
  tuteur?: User
}

export interface Demande {
  id: string
  stagiaire_id: string
  tuteur_id?: string
  type: "conge" | "prolongation" | "attestation" | "stage_academique" | "stage_professionnel"
  titre: string
  description: string
  statut: "En attente" | "Validé" | "Rejeté"
  date_debut?: string
  date_fin?: string
  motif_rejet?: string
  commentaire_approbation?: string
  created_at: string
  updated_at: string
  stagiaires?: Stagiaire
  tuteur?: User
}

export interface Document {
  id: string
  stagiaire_id: string
  nom: string
  type: "cv" | "lettre_motivation" | "convention" | "rapport" | "evaluation" | "autre"
  format: string
  taille: number
  url: string
  created_at: string
  updated_at: string
  stagiaires?: Stagiaire
}

export interface Evaluation {
  id: string
  stagiaire_id: string
  tuteur_id: string
  periode: string
  note_globale: number
  commentaires: string
  competences: Record<string, number>
  points_forts: string[]
  axes_amelioration: string[]
  created_at: string
  updated_at: string
  stagiaires?: Stagiaire
  tuteur?: User
}

export interface Notification {
  id: string
  user_id: string
  titre: string
  message: string
  type: "info" | "success" | "warning" | "error"
  lu: boolean
  created_at: string
  updated_at: string
}

export interface Template {
  id: string
  nom: string
  type: "email" | "document" | "rapport"
  contenu: string
  variables: string[]
  created_at: string
  updated_at: string
}

// Types pour les statistiques
export interface DashboardStats {
  stagiaires_total?: number
  stagiaires_actifs?: number
  demandes_total?: number
  demandes_en_cours?: number
  demandes_validees?: number
  documents_total?: number
  evaluations_total?: number
}

// Types pour les filtres
export interface StagiaireFilters {
  statut?: string
  departement?: string
  ecole?: string
  tuteurId?: string
}

export interface DemandeFilters {
  statut?: string
  type?: string
  stagiaireId?: string
  tuteurId?: string
}

export interface DocumentFilters {
  type?: string
  format?: string
  stagiaireId?: string
}

// Types pour les formulaires
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  nom: string
  prenom: string
  telephone: string
  role: string
}

export interface DemandeFormData {
  type: string
  titre: string
  description: string
  date_debut?: string
  date_fin?: string
}

// Types pour les réponses API
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

// Types pour les composants
export interface TableColumn<T = any> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, item: T) => React.ReactNode
}

export interface SelectOption {
  value: string
  label: string
}

// Types pour les hooks
export interface UseApiOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export interface UseApiReturn<T = any> {
  data: T | null
  loading: boolean
  error: string | null
  execute: (...args: any[]) => Promise<void>
  reset: () => void
}

// Types pour l'authentification
export interface AuthUser extends User {
  session?: any
}

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
}

// Types pour les permissions
export type Permission =
  | "read_stagiaires"
  | "write_stagiaires"
  | "read_demandes"
  | "write_demandes"
  | "approve_demandes"
  | "read_documents"
  | "write_documents"
  | "read_evaluations"
  | "write_evaluations"
  | "read_users"
  | "write_users"
  | "admin_access"

export interface RolePermissions {
  [role: string]: Permission[]
}

// Types pour les exports
export interface ExportOptions {
  format: "csv" | "excel" | "pdf"
  filters?: Record<string, any>
  columns?: string[]
}

// Types pour les rapports
export interface ReportData {
  title: string
  data: any[]
  charts?: ChartData[]
  summary?: Record<string, number>
}

export interface ChartData {
  type: "bar" | "line" | "pie" | "doughnut"
  data: any
  options?: any
}
