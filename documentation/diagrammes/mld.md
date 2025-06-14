# Modèle Logique de Données (MLD)

\`\`\`mermaid
erDiagram
    users ||--o{ stagiaires : "est"
    users ||--o{ tuteurs : "est"
    users ||--o{ notifications : "reçoit"
    
    stagiaires ||--o{ demandes : "fait"
    stagiaires ||--o{ documents : "possède"
    stagiaires ||--o{ evaluations : "évalué"
    
    tuteurs ||--o{ stagiaires : "supervise"
    tuteurs ||--o{ demandes : "valide"
    tuteurs ||--o{ evaluations : "évalue"
    
    demandes ||--o{ commentaires : "a"
    demandes ||--o{ documents : "contient"
    
    evaluations ||--o{ competences_evaluations : "contient"
    competences ||--o{ competences_evaluations : "évaluée"
    
    users {
        uuid id PK
        text email UK
        text name
        text role
        timestamp created_at
        timestamp updated_at
    }
    
    stagiaires {
        uuid id PK
        uuid user_id FK
        text nom
        text prenom
        text email
        text telephone
        text etablissement
        text niveau_etude
        text specialite
        uuid tuteur_id FK
        date date_debut_stage
        date date_fin_stage
        text statut
        timestamp created_at
        timestamp updated_at
    }
    
    tuteurs {
        uuid id PK
        uuid user_id FK
        text nom
        text prenom
        text email
        text departement
        text specialite
        timestamp created_at
        timestamp updated_at
    }
    
    demandes {
        uuid id PK
        text type
        text statut
        uuid stagiaire_id FK
        uuid tuteur_id FK
        date date_debut
        date date_fin
        text motif
        text commentaire
        json documents
        timestamp created_at
        timestamp updated_at
    }
    
    documents {
        uuid id PK
        text nom
        text type
        text format
        text url
        integer taille
        uuid stagiaire_id FK
        uuid demande_id FK
        timestamp created_at
    }
    
    evaluations {
        uuid id PK
        uuid stagiaire_id FK
        uuid tuteur_id FK
        text periode
        text type
        decimal note_globale
        text commentaire_general
        timestamp created_at
        timestamp updated_at
    }
    
    competences {
        uuid id PK
        text nom
        text description
        text categorie
        timestamp created_at
    }
    
    competences_evaluations {
        uuid id PK
        uuid evaluation_id FK
        uuid competence_id FK
        integer note
        text commentaire
    }
    
    commentaires {
        uuid id PK
        uuid demande_id FK
        uuid user_id FK
        text contenu
        timestamp created_at
    }
    
    notifications {
        uuid id PK
        uuid user_id FK
        text titre
        text contenu
        text type
        boolean lu
        timestamp created_at
    }
\`\`\`
