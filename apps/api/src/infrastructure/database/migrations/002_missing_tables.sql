// apps/api/src/infrastructure/database/migrations/002_missing_tables.sql
USE fanini_db;

-- Protokolle
CREATE TABLE IF NOT EXISTS protokolle (
  id VARCHAR(36) PRIMARY KEY,
  bereich_id VARCHAR(100) NOT NULL,
  datum DATE NOT NULL,
  titel VARCHAR(255) NOT NULL,
  typ ENUM('VORSTANDSSITZUNG', 'BEIRATSSITZUNG', 'TEAM_MEETING', 'MITGLIEDERVERSAMMLUNG', 'SONSTIGES') NOT NULL,
  teilnehmer_ids JSON,
  protokollant_id VARCHAR(36) NOT NULL,
  sitzungsleiter_id VARCHAR(36) NOT NULL,
  status ENUM('ENTWURF', 'FERTIG', 'GENEHMIGT') DEFAULT 'ENTWURF',
  inhalt TEXT,
  genehmigt_am TIMESTAMP NULL,
  genehmigt_von VARCHAR(36),
  erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  aktualisiert_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (protokollant_id) REFERENCES mitglieder(id),
  FOREIGN KEY (sitzungsleiter_id) REFERENCES mitglieder(id),
  FOREIGN KEY (genehmigt_von) REFERENCES mitglieder(id),
  INDEX idx_datum (datum),
  INDEX idx_status (status),
  INDEX idx_bereich (bereich_id)
);

-- Tagesordnungspunkte
CREATE TABLE IF NOT EXISTS tagesordnungspunkte (
  id VARCHAR(36) PRIMARY KEY,
  protokoll_id VARCHAR(36),
  titel VARCHAR(255) NOT NULL,
  beschreibung TEXT,
  prioritaet ENUM('NIEDRIG', 'MITTEL', 'HOCH', 'KRITISCH') DEFAULT 'MITTEL',
  eingereicht_von VARCHAR(36) NOT NULL,
  eingereicht_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  bereich_id VARCHAR(100) NOT NULL,
  ergebnis TEXT,
  massnahmen JSON,
  erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  aktualisiert_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (protokoll_id) REFERENCES protokolle(id) ON DELETE CASCADE,
  FOREIGN KEY (eingereicht_von) REFERENCES mitglieder(id),
  INDEX idx_protokoll (protokoll_id),
  INDEX idx_prioritaet (prioritaet)
);

-- Email Vorlagen
CREATE TABLE IF NOT EXISTS email_vorlagen (
  id VARCHAR(36) PRIMARY KEY,
  titel VARCHAR(255) NOT NULL,
  betreff VARCHAR(255) NOT NULL,
  inhalt TEXT NOT NULL,
  kategorie ENUM('MITGLIEDSCHAFT', 'EVENT', 'AUFGABE', 'NEWSLETTER', 'FINANZEN', 'SONSTIGES') NOT NULL,
  platzhalter JSON,
  ist_aktiv BOOLEAN DEFAULT TRUE,
  erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  aktualisiert_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_kategorie (kategorie),
  INDEX idx_aktiv (ist_aktiv)
);
