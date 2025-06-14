-- Désactiver temporairement RLS pour le développement
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE stagiaires DISABLE ROW LEVEL SECURITY;
ALTER TABLE demandes DISABLE ROW LEVEL SECURITY;
ALTER TABLE commentaires DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations DISABLE ROW LEVEL SECURITY;
ALTER TABLE competences_evaluation DISABLE ROW LEVEL SECURITY;
ALTER TABLE templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admins and RH can view all users" ON users;
DROP POLICY IF EXISTS "Stagiaires can view their own data" ON stagiaires;
DROP POLICY IF EXISTS "Tuteurs can view their stagiaires" ON stagiaires;
DROP POLICY IF EXISTS "Admins and RH can manage stagiaires" ON stagiaires;
DROP POLICY IF EXISTS "Stagiaires can view their own demandes" ON demandes;
DROP POLICY IF EXISTS "Tuteurs can view demandes of their stagiaires" ON demandes;
DROP POLICY IF EXISTS "Stagiaires can create their own demandes" ON demandes;

-- Réactiver RLS avec des politiques plus permissives pour le développement
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stagiaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE demandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Politiques permissives pour le développement
CREATE POLICY "Allow all for authenticated users" ON users
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON stagiaires
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON demandes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON documents
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON evaluations
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON notifications
  FOR ALL USING (auth.role() = 'authenticated');

-- Politiques de stockage permissives
CREATE POLICY "Allow all for authenticated users" ON storage.objects
  FOR ALL USING (auth.role() = 'authenticated');
