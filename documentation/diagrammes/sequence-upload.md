# Diagramme de Séquence - Téléversement de Fichiers

\`\`\`mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Frontend
    participant API as API Route
    participant S as Supabase Storage
    participant DB as Base de données
    
    U->>F: Sélection fichier
    F->>F: Validation (taille, type)
    F->>API: POST /api/documents (FormData)
    
    API->>API: Validation métadonnées
    API->>S: Upload fichier vers bucket
    S-->>API: URL fichier + confirmation
    
    API->>DB: Insertion métadonnées document
    DB-->>API: ID document créé
    
    API-->>F: Réponse succès + métadonnées
    F->>F: Mise à jour interface
    F-->>U: Confirmation téléversement
    
    Note over API,S: Le fichier est stocké dans<br/>Supabase Storage avec<br/>nomenclature : stagiaire_id/timestamp-filename
    
    Note over API,DB: Les métadonnées incluent :<br/>- nom, type, taille<br/>- URL publique<br/>- stagiaire_id
\`\`\`
