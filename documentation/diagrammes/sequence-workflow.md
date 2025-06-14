# Diagramme de Séquence - Démarrage Workflow de Demande

\`\`\`mermaid
sequenceDiagram
    participant S as Stagiaire
    participant F as Frontend
    participant API as API Demandes
    participant DB as Base de données
    participant N as Service Notifications
    participant T as Tuteur
    participant RH as RH
    
    S->>F: Création nouvelle demande
    F->>API: POST /api/demandes
    API->>DB: Insertion demande (statut: en_attente)
    DB-->>API: ID demande créé
    
    API->>N: Trigger notification tuteur
    N->>DB: Création notification
    N-->>T: Email/notification tuteur
    
    API-->>F: Confirmation création
    F-->>S: Demande créée avec succès
    
    %% Workflow validation tuteur
    T->>F: Consultation demande
    T->>API: PUT /api/demandes/{id}/approve
    API->>DB: Mise à jour statut demande
    
    API->>N: Trigger notification RH
    N->>DB: Création notification
    N-->>RH: Email/notification RH
    
    API->>N: Notification stagiaire
    N-->>S: Notification validation tuteur
    
    %% Workflow validation RH
    RH->>F: Traitement demande
    RH->>API: PUT /api/demandes/{id}/final-approval
    API->>DB: Statut final (approuvée/rejetée)
    
    API->>N: Notification finale
    N-->>S: Notification décision finale
    
    Note over S,RH: Le workflow suit un processus<br/>à deux niveaux de validation
\`\`\`
