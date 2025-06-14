-- Désactiver temporairement RLS pour permettre l'inscription
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE stagiaires DISABLE ROW LEVEL SECURITY;
ALTER TABLE demandes DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Allow all for authenticated users" ON users;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON stagiaires;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON demandes;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON documents;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON evaluations;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON notifications;
