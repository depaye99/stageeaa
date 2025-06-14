# Diagramme de Séquence - Connexion

\`\`\`mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Frontend (Next.js)
    participant M as Middleware
    participant S as Supabase Auth
    participant DB as Base de données
    
    U->>F: Saisit email/mot de passe
    F->>F: Validation côté client
    F->>S: POST /auth/login
    S->>S: Vérification credentials
    
    alt Authentification réussie
        S->>S: Génération JWT token
        S-->>F: Token + données utilisateur
        F->>F: Stockage token (cookies)
        F->>DB: Récupération profil utilisateur
        DB-->>F: Données profil
        F->>M: Redirection vers dashboard
        M->>M: Vérification token
        M-->>F: Autorisation accordée
        F-->>U: Redirection vers dashboard
    else Authentification échouée
        S-->>F: Erreur d'authentification
        F-->>U: Message d'erreur
    end
    
    Note over F,S: Les tokens sont automatiquement<br/>renouvelés par Supabase
\`\`\`
