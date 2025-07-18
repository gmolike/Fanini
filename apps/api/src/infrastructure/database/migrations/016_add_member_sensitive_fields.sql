-- apps/api/src/infrastructure/database/migrations/016_add_member_sensitive_fields.sql

-- Definiere welche Felder sensibel sind und spezielle Berechtigungen brauchen
CREATE TABLE IF NOT EXISTS sensitive_fields (
  id VARCHAR(36) PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  field_name VARCHAR(100) NOT NULL,
  sensitivity_level ENUM('low', 'medium', 'high', 'critical') NOT NULL,
  required_permission VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_field (entity_type, field_name)
);

-- Sensitive Felder für Mitglieder definieren
INSERT INTO sensitive_fields (id, entity_type, field_name, sensitivity_level, required_permission, description) VALUES
  ('sf_member_email', 'member', 'email', 'medium', 'member.view_contact', 'E-Mail Adresse'),
  ('sf_member_phone', 'member', 'telefon', 'medium', 'member.view_contact', 'Telefonnummer'),
  ('sf_member_address', 'member', 'adresse', 'high', 'member.view_sensitive', 'Wohnadresse'),
  ('sf_member_birth', 'member', 'geburtsdatum', 'high', 'member.view_sensitive', 'Geburtsdatum'),
  ('sf_member_iban', 'member', 'iban', 'critical', 'member.view_sensitive', 'Bankverbindung'),
  ('sf_member_easyverein', 'member', 'easyverein_id', 'low', 'member.view_basic', 'EasyVerein ID'),
  ('sf_member_number', 'member', 'mitgliedsnummer', 'medium', 'member.view_basic', 'Mitgliedsnummer');

-- Erweitere Mitglieder-Tabelle um sensitive Felder
ALTER TABLE mitglieder
ADD COLUMN geburtsdatum DATE,
ADD COLUMN adresse_strasse VARCHAR(255),
ADD COLUMN adresse_hausnummer VARCHAR(20),
ADD COLUMN adresse_plz VARCHAR(10),
ADD COLUMN adresse_stadt VARCHAR(100),
ADD COLUMN iban VARCHAR(34),
ADD COLUMN notfallkontakt_name VARCHAR(100),
ADD COLUMN notfallkontakt_telefon VARCHAR(50),
ADD COLUMN datenschutz_einwilligung BOOLEAN DEFAULT FALSE,
ADD COLUMN datenschutz_datum TIMESTAMP NULL;

-- Field Access Log für Audit
CREATE TABLE IF NOT EXISTS field_access_log (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(36) NOT NULL,
  field_name VARCHAR(100) NOT NULL,
  action ENUM('view', 'export') NOT NULL,
  accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user (user_id),
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_time (accessed_at)
);

-- Visibility Overrides - individuelle Sichtbarkeitseinstellungen
CREATE TABLE IF NOT EXISTS member_visibility_overrides (
  member_id VARCHAR(36) NOT NULL,
  field_name VARCHAR(100) NOT NULL,
  visibility_level ENUM('private', 'team', 'members', 'public') NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (member_id, field_name),
  FOREIGN KEY (member_id) REFERENCES mitglieder(id) ON DELETE CASCADE
);
