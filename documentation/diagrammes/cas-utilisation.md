# Diagramme de Cas d'Utilisation

\`\`\`mermaid
graph TB
    %% Acteurs
    S[Stagiaire]
    T[Tuteur]
    RH[RH]
    A[Admin]
    
    %% Cas d'utilisation - Authentification
    subgraph "Authentification"
        UC1[Se connecter]
        UC2[Se déconnecter]
        UC3[S'inscrire]
    end
    
    %% Cas d'utilisation - Gestion Demandes
    subgraph "Gestion des Demandes"
        UC4[Créer une demande]
        UC5[Consulter ses demandes]
        UC6[Modifier une demande]
        UC7[Valider/Rejeter demande]
        UC8[Traiter demande RH]
    end
    
    %% Cas d'utilisation - Documents
    subgraph "Gestion Documents"
        UC9[Téléverser document]
        UC10[Consulter documents]
        UC11[Télécharger document]
        UC12[Valider document]
    end
    
    %% Cas d'utilisation - Administration
    subgraph "Administration"
        UC13[Gérer utilisateurs]
        UC14[Générer statistiques]
        UC15[Configurer système]
        UC16[Créer évaluations]
    end
    
    %% Relations
    S --> UC1
    S --> UC2
    S --> UC3
    S --> UC4
    S --> UC5
    S --> UC6
    S --> UC9
    S --> UC10
    S --> UC11
    
    T --> UC1
    T --> UC2
    T --> UC7
    T --> UC10
    T --> UC11
    T --> UC16
    
    RH --> UC1
    RH --> UC2
    RH --> UC8
    RH --> UC10
    RH --> UC11
    RH --> UC12
    RH --> UC14
    
    A --> UC1
    A --> UC2
    A --> UC13
    A --> UC14
    A --> UC15
\`\`\`
