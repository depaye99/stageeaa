# Architecture du Projet

\`\`\`mermaid
graph TB
    %% Frontend Layer
    subgraph "Frontend - Next.js 14"
        UI[Interface Utilisateur]
        COMP[Composants React]
        PAGES[Pages/Routes]
        MIDDLEWARE[Middleware Auth]
    end
    
    %% Backend Layer
    subgraph "Backend - API Routes"
        AUTH_API[API Auth]
        DEMANDES_API[API Demandes]
        DOCS_API[API Documents]
        STATS_API[API Statistiques]
        USERS_API[API Utilisateurs]
    end
    
    %% Services Layer
    subgraph "Services Layer"
        AUTH_SERVICE[Auth Service]
        DEMANDES_SERVICE[Demandes Service]
        DOCS_SERVICE[Documents Service]
        NOTIF_SERVICE[Notifications Service]
    end
    
    %% Database Layer
    subgraph "Supabase Backend"
        SUPABASE_AUTH[Supabase Auth]
        SUPABASE_DB[PostgreSQL Database]
        SUPABASE_STORAGE[Supabase Storage]
        SUPABASE_REALTIME[Realtime Subscriptions]
    end
    
    %% External Services
    subgraph "Services Externes"
        EMAIL[Service Email]
        PDF[Générateur PDF]
        EXPORT[Export CSV/Excel]
    end
    
    %% Connections
    UI --> COMP
    COMP --> PAGES
    PAGES --> MIDDLEWARE
    MIDDLEWARE --> AUTH_API
    
    PAGES --> DEMANDES_API
    PAGES --> DOCS_API
    PAGES --> STATS_API
    PAGES --> USERS_API
    
    AUTH_API --> AUTH_SERVICE
    DEMANDES_API --> DEMANDES_SERVICE
    DOCS_API --> DOCS_SERVICE
    STATS_API --> DEMANDES_SERVICE
    
    AUTH_SERVICE --> SUPABASE_AUTH
    DEMANDES_SERVICE --> SUPABASE_DB
    DOCS_SERVICE --> SUPABASE_STORAGE
    NOTIF_SERVICE --> SUPABASE_REALTIME
    
    DEMANDES_SERVICE --> EMAIL
    STATS_API --> PDF
    STATS_API --> EXPORT
    
    %% Styling
    classDef frontend fill:#e1f5fe
    classDef backend fill:#f3e5f5
    classDef services fill:#e8f5e8
    classDef database fill:#fff3e0
    classDef external fill:#fce4ec
    
    class UI,COMP,PAGES,MIDDLEWARE frontend
    class AUTH_API,DEMANDES_API,DOCS_API,STATS_API,USERS_API backend
    class AUTH_SERVICE,DEMANDES_SERVICE,DOCS_SERVICE,NOTIF_SERVICE services
    class SUPABASE_AUTH,SUPABASE_DB,SUPABASE_STORAGE,SUPABASE_REALTIME database
    class EMAIL,PDF,EXPORT external
\`\`\`

## Technologies utilisées :
- **Frontend** : Next.js 14, React, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes, Supabase
- **Base de données** : PostgreSQL (Supabase)
- **Authentification** : Supabase Auth
- **Stockage** : Supabase Storage
- **Déploiement** : Replit/Vercel
