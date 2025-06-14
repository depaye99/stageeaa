-- Insérer des utilisateurs de test
INSERT INTO users (id, email, name, role, phone, department, position) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@bridge-tech.com', 'Admin Bridge', 'admin', '+33123456789', 'Direction', 'Administrateur'),
  ('22222222-2222-2222-2222-222222222222', 'rh@bridge-tech.com', 'Marie Dupont', 'rh', '+33123456790', 'Ressources Humaines', 'Responsable RH'),
  ('33333333-3333-3333-3333-333333333333', 'tuteur@bridge-tech.com', 'Jean Martin', 'tuteur', '+33123456791', 'Développement', 'Développeur Senior'),
  ('44444444-4444-4444-4444-444444444444', 'stagiaire@bridge-tech.com', 'Sophie Leroy', 'stagiaire', '+33123456792', 'Développement', 'Stagiaire')
ON CONFLICT (id) DO NOTHING;

-- Insérer un stagiaire de test
INSERT INTO stagiaires (id, user_id, nom, prenom, email, telephone, formation, ecole, niveau, periode, date_debut, date_fin, tuteur_id, departement, statut) VALUES
  ('55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'Leroy', 'Sophie', 'stagiaire@bridge-tech.com', '+33123456792', 'Informatique', 'Université Paris', 'Master 2', '6 mois', '2024-01-15', '2024-07-15', '33333333-3333-3333-3333-333333333333', 'Développement', 'actif')
ON CONFLICT (id) DO NOTHING;

-- Insérer quelques demandes de test
INSERT INTO demandes (id, date, type, statut, details, stagiaire_id, tuteur_id, date_debut, date_fin) VALUES
  ('66666666-6666-6666-6666-666666666666', NOW(), 'conge', 'En attente', 'Demande de congé pour raisons personnelles', '55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', '2024-03-01', '2024-03-05'),
  ('77777777-7777-7777-7777-777777777777', NOW() - INTERVAL '1 day', 'attestation', 'Validé', 'Demande d''attestation de stage', '55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Insérer quelques notifications de test
INSERT INTO notifications (id, user_id, titre, message, type, lu, date) VALUES
  ('88888888-8888-8888-8888-888888888888', '44444444-4444-4444-4444-444444444444', 'Demande validée', 'Votre demande d''attestation a été validée', 'success', false, NOW()),
  ('99999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', 'Nouvelle demande', 'Une nouvelle demande de congé nécessite votre attention', 'info', false, NOW())
ON CONFLICT (id) DO NOTHING;
