
// Types de base pour l'authentification
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'rh' | 'tuteur' | 'stagiaire';
  nom?: string;
  prenom?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: User | null;
  error?: string;
}

// Types pour les stagiaires
export interface Stagiaire {
  id: string;
  user_id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  ecole?: string;
  niveau?: string;
  departement?: string;
  tuteur_id?: string;
  date_debut?: string;
  date_fin?: string;
  type_stage?: 'academique' | 'professionnel';
  status?: 'actif' | 'termine' | 'suspendu';
  created_at?: string;
  updated_at?: string;
}

export interface StagiaireStats {
  total: number;
  actifs: number;
  termines: number;
  par_departement: Record<string, number>;
  par_ecole: Record<string, number>;
}

// Types pour les demandes
export interface Demande {
  id: string;
  stagiaire_id: string;
  type: 'conge' | 'prolongation' | 'attestation' | 'stage-academique' | 'stage-professionnel';
  titre: string;
  description?: string;
  status: 'en_attente' | 'approuvee' | 'rejetee';
  date_debut?: string;
  date_fin?: string;
  motif?: string;
  commentaire?: string;
  created_at?: string;
  updated_at?: string;
  stagiaire?: Stagiaire;
}

export interface DemandeFormData {
  type: string;
  titre: string;
  description?: string;
  date_debut?: string;
  date_fin?: string;
  motif?: string;
}

// Types pour les documents
export interface Document {
  id: string;
  nom: string;
  type: string;
  url: string;
  stagiaire_id: string;
  uploaded_by: string;
  size?: number;
  created_at?: string;
  stagiaire?: Stagiaire;
}

// Types pour les évaluations
export interface Evaluation {
  id: string;
  stagiaire_id: string;
  tuteur_id: string;
  type: 'mensuelle' | 'finale' | 'mi-parcours';
  note_technique?: number;
  note_comportement?: number;
  note_generale?: number;
  commentaires?: string;
  recommandations?: string;
  date_evaluation?: string;
  created_at?: string;
  stagiaire?: Stagiaire;
}

// Types pour les notifications
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at?: string;
}

// Types pour les templates
export interface Template {
  id: string;
  nom: string;
  type: 'attestation' | 'convention' | 'evaluation';
  contenu: string;
  variables: string[];
  created_at?: string;
}

// Types pour les statistiques
export interface Statistics {
  stagiaires: StagiaireStats;
  demandes: {
    total: number;
    en_attente: number;
    approuvees: number;
    rejetees: number;
  };
  evaluations: {
    total: number;
    moyenne_generale: number;
  };
  documents: {
    total: number;
    taille_totale: number;
  };
}

// Types pour les rapports
export interface ReportData {
  type: string;
  data: any[];
  total: number;
  filters?: Record<string, any>;
}

// Types pour les formulaires
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'date' | 'number';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

// Types pour l'API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Types pour les filtres
export interface FilterOptions {
  search?: string;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  departement?: string;
  ecole?: string;
  page?: number;
  limit?: number;
}

// Types pour les exports
export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  type: string;
  filters?: FilterOptions;
  fields?: string[];
}
