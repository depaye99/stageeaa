-- Activer l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Supprimer les tables existantes si elles existent (pour reset)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS competences_evaluation CASCADE;
DROP TABLE IF EXISTS evaluations CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS commentaires CASCADE;
DROP TABLE IF EXISTS demandes CASCADE;
DROP TABLE IF EXISTS templates CASCADE;
DROP TABLE IF EXISTS stagiaires CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Table des utilisateurs
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('stagiaire', 'tuteur', 'rh', 'admin', 'finance')),
  phone VARCHAR(20),
  address TEXT,
  avatar_url TEXT,
  department VARCHAR(100),
  position VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des stagiaires
CREATE TABLE stagiaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telephone VARCHAR(20),
  adresse TEXT,
  date_naissance DATE,
  formation VARCHAR(255),
  ecole VARCHAR(255),
  niveau VARCHAR(100),
  periode VARCHAR(100) NOT NULL,
  date_debut DATE,
  date_fin DATE,
  tuteur_id UUID REFERENCES users(id),
  departement VARCHAR(100),
  statut VARCHAR(50) NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('actif', 'termine', 'en_attente')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des demandes
CREATE TABLE demandes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('stage_academique', 'stage_professionnel', 'conge', 'prolongation', 'attestation')),
  statut VARCHAR(50) NOT NULL DEFAULT 'En attente' CHECK (statut IN ('En attente', 'Validé', 'Refusé')),
  details TEXT NOT NULL,
  stagiaire_id UUID REFERENCES stagiaires(id) ON DELETE CASCADE,
  tuteur_id UUID REFERENCES users(id),
  tuteur_decision VARCHAR(50) DEFAULT 'En attente' CHECK (tuteur_decision IN ('En attente', 'Validé', 'Refusé')),
  rh_decision VARCHAR(50) DEFAULT 'En attente' CHECK (rh_decision IN ('En attente', 'Validé', 'Refusé')),
  date_debut DATE,
  date_fin DATE,
  duree VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  titre VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  lu BOOLEAN NOT NULL DEFAULT FALSE,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Désactiver RLS pour le développement
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE stagiaires DISABLE ROW LEVEL SECURITY;
ALTER TABLE demandes DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
