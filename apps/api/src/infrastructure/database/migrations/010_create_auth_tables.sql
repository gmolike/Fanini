-- migrations/010_create_auth_tables.sql
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  vorname VARCHAR(100) NOT NULL,
  nachname VARCHAR(100) NOT NULL,
  mitgliedsnummer VARCHAR(50),
  auth_source ENUM('local', 'easyverein') NOT NULL DEFAULT 'easyverein',
  easyverein_id VARCHAR(255),
  password_hash VARCHAR(255), -- Nur für lokale User
  ist_aktiv BOOLEAN DEFAULT TRUE,
  erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  aktualisiert_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  letzter_login TIMESTAMP NULL,
  INDEX idx_email (email),
  INDEX idx_auth_source (auth_source),
  INDEX idx_easyverein_id (easyverein_id)
);

-- Rollen
CREATE TABLE IF NOT EXISTS roles (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  beschreibung TEXT,
  hierarchie_ebene INT NOT NULL,
  erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User-Rollen Verknüpfung
CREATE TABLE IF NOT EXISTS user_roles (
  user_id VARCHAR(36) NOT NULL,
  role_id VARCHAR(36) NOT NULL,
  zugewiesen_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  zugewiesen_von VARCHAR(36),
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Berechtigungen (keine Type Aliases mehr)
CREATE TABLE IF NOT EXISTS permissions (
  id VARCHAR(36) PRIMARY KEY,
  resource VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  beschreibung TEXT,
  UNIQUE KEY unique_permission (resource, action)
);

-- Rollen-Berechtigungen
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id VARCHAR(36) NOT NULL,
  permission_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

-- Standard-Rollen einfügen
INSERT INTO roles (id, name, beschreibung, hierarchie_ebene) VALUES
  ('role_admin', 'ADMIN', 'Systemadministrator mit vollständigen Rechten', 1),
  ('role_vorstand', 'VORSTAND', 'Vorstandsmitglied', 2),
  ('role_beirat', 'BEIRAT', 'Beiratsmitglied', 3),
  ('role_team_event', 'TEAM_EVENT', 'Team Event - Veranstaltungsorganisation', 4),
  ('role_team_medien', 'TEAM_MEDIEN', 'Team Medien - Social Media und Content', 4),
  ('role_team_technik', 'TEAM_TECHNIK', 'Team Technik - IT und Website', 4),
  ('role_team_verein', 'TEAM_VEREIN', 'Team Verein - Verwaltung', 4),
  ('role_mitglied', 'MITGLIED', 'Normales Vereinsmitglied', 5);
