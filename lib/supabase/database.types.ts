export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: "stagiaire" | "tuteur" | "rh" | "admin" | "finance"
          phone: string | null
          address: string | null
          avatar_url: string | null
          department: string | null
          position: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: "stagiaire" | "tuteur" | "rh" | "admin" | "finance"
          phone?: string | null
          address?: string | null
          avatar_url?: string | null
          department?: string | null
          position?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: "stagiaire" | "tuteur" | "rh" | "admin" | "finance"
          phone?: string | null
          address?: string | null
          avatar_url?: string | null
          department?: string | null
          position?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stagiaires: {
        Row: {
          id: string
          user_id: string
          nom: string
          prenom: string
          email: string
          telephone: string | null
          adresse: string | null
          date_naissance: string | null
          formation: string | null
          ecole: string | null
          niveau: string | null
          periode: string
          date_debut: string | null
          date_fin: string | null
          tuteur_id: string | null
          departement: string | null
          statut: "actif" | "termine" | "en_attente"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nom: string
          prenom: string
          email: string
          telephone?: string | null
          adresse?: string | null
          date_naissance?: string | null
          formation?: string | null
          ecole?: string | null
          niveau?: string | null
          periode: string
          date_debut?: string | null
          date_fin?: string | null
          tuteur_id?: string | null
          departement?: string | null
          statut?: "actif" | "termine" | "en_attente"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nom?: string
          prenom?: string
          email?: string
          telephone?: string | null
          adresse?: string | null
          date_naissance?: string | null
          formation?: string | null
          ecole?: string | null
          niveau?: string | null
          periode?: string
          date_debut?: string | null
          date_fin?: string | null
          tuteur_id?: string | null
          departement?: string | null
          statut?: "actif" | "termine" | "en_attente"
          created_at?: string
          updated_at?: string
        }
      }
      demandes: {
        Row: {
          id: string
          date: string
          type: "stage_academique" | "stage_professionnel" | "conge" | "prolongation" | "attestation"
          statut: "En attente" | "Validé" | "Refusé"
          details: string
          stagiaire_id: string
          tuteur_id: string | null
          tuteur_decision: "En attente" | "Validé" | "Refusé"
          rh_decision: "En attente" | "Validé" | "Refusé"
          date_debut: string | null
          date_fin: string | null
          duree: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          type: "stage_academique" | "stage_professionnel" | "conge" | "prolongation" | "attestation"
          statut?: "En attente" | "Validé" | "Refusé"
          details: string
          stagiaire_id: string
          tuteur_id?: string | null
          tuteur_decision?: "En attente" | "Validé" | "Refusé"
          rh_decision?: "En attente" | "Validé" | "Refusé"
          date_debut?: string | null
          date_fin?: string | null
          duree?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          type?: "stage_academique" | "stage_professionnel" | "conge" | "prolongation" | "attestation"
          statut?: "En attente" | "Validé" | "Refusé"
          details?: string
          stagiaire_id?: string
          tuteur_id?: string | null
          tuteur_decision?: "En attente" | "Validé" | "Refusé"
          rh_decision?: "En attente" | "Validé" | "Refusé"
          date_debut?: string | null
          date_fin?: string | null
          duree?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          date: string
          nom: string
          description: string | null
          format: "PDF" | "DOC" | "IMG"
          stagiaire_id: string
          type:
            | "cv"
            | "lettre_motivation"
            | "lettre_recommandation"
            | "piece_identite"
            | "certificat_scolarite"
            | "convention"
            | "attestation"
            | "autre"
          url: string
          taille: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          nom: string
          description?: string | null
          format: "PDF" | "DOC" | "IMG"
          stagiaire_id: string
          type:
            | "cv"
            | "lettre_motivation"
            | "lettre_recommandation"
            | "piece_identite"
            | "certificat_scolarite"
            | "convention"
            | "attestation"
            | "autre"
          url: string
          taille?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          nom?: string
          description?: string | null
          format?: "PDF" | "DOC" | "IMG"
          stagiaire_id?: string
          type?:
            | "cv"
            | "lettre_motivation"
            | "lettre_recommandation"
            | "piece_identite"
            | "certificat_scolarite"
            | "convention"
            | "attestation"
            | "autre"
          url?: string
          taille?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      evaluations: {
        Row: {
          id: string
          stagiaire_id: string
          tuteur_id: string
          date: string
          commentaire: string
          note_globale: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          stagiaire_id: string
          tuteur_id: string
          date: string
          commentaire: string
          note_globale: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          stagiaire_id?: string
          tuteur_id?: string
          date?: string
          commentaire?: string
          note_globale?: number
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          titre: string
          message: string
          type: "info" | "success" | "warning" | "error"
          lu: boolean
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          titre: string
          message: string
          type: "info" | "success" | "warning" | "error"
          lu?: boolean
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          titre?: string
          message?: string
          type?: "info" | "success" | "warning" | "error"
          lu?: boolean
          date?: string
          created_at?: string
        }
      }
    }
    Views: {
      stagiaires_view: {
        Row: {
          id: string
          nom: string
          prenom: string
          email: string
          telephone: string | null
          formation: string | null
          ecole: string | null
          periode: string
          tuteur_nom: string | null
          departement: string | null
          statut: string
          nb_demandes: number
          nb_documents: number
        }
      }
      demandes_view: {
        Row: {
          id: string
          date: string
          type: string
          statut: string
          details: string
          stagiaire_nom: string
          stagiaire_prenom: string
          tuteur_nom: string | null
          tuteur_decision: string
          rh_decision: string
          nb_commentaires: number
        }
      }
    }
    Functions: {
      get_dashboard_stats: {
        Args: {
          user_id: string
          role: string
        }
        Returns: Json
      }
      search_stagiaires: {
        Args: {
          search_term: string
          status_filter?: string
          department_filter?: string
        }
        Returns: {
          id: string
          nom: string
          prenom: string
          email: string
          formation: string
          ecole: string
          tuteur_nom: string
          departement: string
          statut: string
        }[]
      }
    }
  }
}
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      stagiaires: {
        Row: {
          id: string
          user_id: string
          nom: string
          prenom: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nom: string
          prenom: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nom?: string
          prenom?: string
          created_at?: string
          updated_at?: string
        }
      }
      demandes: {
        Row: {
          id: string
          stagiaire_id: string
          type: string
          statut: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          stagiaire_id: string
          type: string
          statut?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          stagiaire_id?: string
          type?: string
          statut?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
