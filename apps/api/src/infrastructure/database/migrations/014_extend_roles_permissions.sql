-- apps/api/src/infrastructure/database/migrations/014_extend_roles_permissions.sql
-- Erweiterte Berechtigungen für granulare Kontrolle
CREATE TABLE
  IF NOT EXISTS permission_groups (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

-- Basis-Berechtigungsgruppen
INSERT INTO
  permission_groups (id, name, description)
VALUES
  (
    'pg_members',
    'Mitgliederverwaltung',
    'Berechtigungen für Mitgliederdaten'
  ),
  (
    'pg_events',
    'Eventverwaltung',
    'Berechtigungen für Events'
  ),
  (
    'pg_finance',
    'Finanzen',
    'Berechtigungen für Finanzdaten'
  ),
  (
    'pg_content',
    'Inhalte',
    'Berechtigungen für Content-Management'
  ),
  (
    'pg_system',
    'System',
    'System-Administrationsrechte'
  );

-- Erweiterte Permissions mit Gruppen
ALTER TABLE permissions
ADD COLUMN group_id VARCHAR(36),
ADD COLUMN conditions JSON COMMENT 'Zusätzliche Bedingungen für die Berechtigung',
ADD FOREIGN KEY (group_id) REFERENCES permission_groups (id);

-- Detaillierte Berechtigungen einfügen
INSERT INTO
  permissions (id, resource, action, group_id, beschreibung)
VALUES
  -- Mitglieder
  (
    'perm_member_view_basic',
    'member',
    'view_basic',
    'pg_members',
    'Basis-Mitgliederdaten einsehen'
  ),
  (
    'perm_member_view_contact',
    'member',
    'view_contact',
    'pg_members',
    'Kontaktdaten einsehen'
  ),
  (
    'perm_member_view_sensitive',
    'member',
    'view_sensitive',
    'pg_members',
    'Sensible Daten einsehen'
  ),
  (
    'perm_member_edit_own',
    'member',
    'edit_own',
    'pg_members',
    'Eigene Daten bearbeiten'
  ),
  (
    'perm_member_edit_all',
    'member',
    'edit_all',
    'pg_members',
    'Alle Mitgliederdaten bearbeiten'
  ),
  (
    'perm_member_assign_role',
    'member',
    'assign_role',
    'pg_members',
    'Rollen zuweisen'
  ),
  (
    'perm_member_export',
    'member',
    'export',
    'pg_members',
    'Mitgliederdaten exportieren'
  ),
  -- Events
  (
    'perm_event_create',
    'event',
    'create',
    'pg_events',
    'Events erstellen'
  ),
  (
    'perm_event_edit_own',
    'event',
    'edit_own',
    'pg_events',
    'Eigene Events bearbeiten'
  ),
  (
    'perm_event_edit_all',
    'event',
    'edit_all',
    'pg_events',
    'Alle Events bearbeiten'
  ),
  (
    'perm_event_approve',
    'event',
    'approve',
    'pg_events',
    'Events genehmigen'
  ),
  (
    'perm_event_delete',
    'event',
    'delete',
    'pg_events',
    'Events löschen'
  ),
  -- Finanzen
  (
    'perm_finance_view',
    'finance',
    'view',
    'pg_finance',
    'Finanzdaten einsehen'
  ),
  (
    'perm_finance_approve',
    'finance',
    'approve',
    'pg_finance',
    'Ausgaben genehmigen'
  ),
  (
    'perm_finance_export',
    'finance',
    'export',
    'pg_finance',
    'Finanzdaten exportieren'
  );

-- Rollen-Berechtigungen zuordnen
INSERT INTO
  role_permissions (role_id, permission_id)
VALUES
  -- Admin hat alles
  ('role_admin', 'perm_member_view_basic'),
  ('role_admin', 'perm_member_view_contact'),
  ('role_admin', 'perm_member_view_sensitive'),
  ('role_admin', 'perm_member_edit_all'),
  ('role_admin', 'perm_member_assign_role'),
  ('role_admin', 'perm_member_export'),
  -- Vorstand
  ('role_vorstand', 'perm_member_view_basic'),
  ('role_vorstand', 'perm_member_view_contact'),
  ('role_vorstand', 'perm_member_view_sensitive'),
  ('role_vorstand', 'perm_member_edit_all'),
  ('role_vorstand', 'perm_member_assign_role'),
  ('role_vorstand', 'perm_event_approve'),
  ('role_vorstand', 'perm_finance_view'),
  ('role_vorstand', 'perm_finance_approve'),
  -- Beirat
  ('role_beirat', 'perm_member_view_basic'),
  ('role_beirat', 'perm_member_view_contact'),
  ('role_beirat', 'perm_event_approve'),
  ('role_beirat', 'perm_finance_view'),
  -- Team Event
  ('role_team_event', 'perm_member_view_basic'),
  ('role_team_event', 'perm_event_create'),
  ('role_team_event', 'perm_event_edit_own'),
  -- Mitglied
  ('role_mitglied', 'perm_member_view_basic'),
  ('role_mitglied', 'perm_member_edit_own');

-- Hierarchie-Tabelle für Rollen
CREATE TABLE
  IF NOT EXISTS role_hierarchy (
    parent_role_id VARCHAR(36) NOT NULL,
    child_role_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (parent_role_id, child_role_id),
    FOREIGN KEY (parent_role_id) REFERENCES roles (id),
    FOREIGN KEY (child_role_id) REFERENCES roles (id)
  );

-- Hierarchie definieren
INSERT INTO
  role_hierarchy (parent_role_id, child_role_id)
VALUES
  ('role_admin', 'role_vorstand'),
  ('role_vorstand', 'role_beirat'),
  ('role_beirat', 'role_team_event'),
  ('role_beirat', 'role_team_medien'),
  ('role_beirat', 'role_team_technik'),
  ('role_beirat', 'role_team_verein'),
  ('role_team_event', 'role_mitglied'),
  ('role_team_medien', 'role_mitglied'),
  ('role_team_technik', 'role_mitglied'),
  ('role_team_verein', 'role_mitglied');
