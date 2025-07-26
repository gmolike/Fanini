-- apps/api/src/infrastructure/database/migrations/003_missing_tables_fix.sql
USE fanini_db;

-- Benachrichtigungen
CREATE TABLE IF NOT EXISTS benachrichtigungen (
  id VARCHAR(36) PRIMARY KEY,
  empfaenger_id VARCHAR(36) NOT NULL,
  typ ENUM('EVENT_ANMELDUNG', 'AUFGABE_ZUGEWIESEN', 'EVENT_REMINDER', 'KOMMENTAR_ERWAEHNUNG', 'EVENT_ABGESAGT', 'SYSTEM') NOT NULL,
  titel VARCHAR(255) NOT NULL,
  nachricht TEXT NOT NULL,
  kontext_typ VARCHAR(50),
  kontext_id VARCHAR(36),
  gelesen BOOLEAN DEFAULT FALSE,
  gelesen_am TIMESTAMP NULL,
  versendet_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  prioritaet ENUM('niedrig', 'mittel', 'hoch', 'kritisch') DEFAULT 'mittel',
  FOREIGN KEY (empfaenger_id) REFERENCES mitglieder(id) ON DELETE CASCADE,
  INDEX idx_empfaenger (empfaenger_id),
  INDEX idx_gelesen (gelesen),
  INDEX idx_versendet (versendet_am)
);

-- Social Media Posts
CREATE TABLE IF NOT EXISTS social_media_posts (
  id VARCHAR(36) PRIMARY KEY,
  inhalt TEXT NOT NULL,
  plattform JSON NOT NULL,
  event_id VARCHAR(36),
  post_datum TIMESTAMP,
  status ENUM('ENTWURF', 'GEPLANT', 'VEROEFFENTLICHT', 'ARCHIVIERT') DEFAULT 'ENTWURF',
  erstellt_von VARCHAR(36) NOT NULL,
  erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_von VARCHAR(36),
  approved_am TIMESTAMP NULL,
  hashtags JSON,
  medien_urls JSON,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
  FOREIGN KEY (erstellt_von) REFERENCES mitglieder(id),
  FOREIGN KEY (approved_von) REFERENCES mitglieder(id),
  INDEX idx_status (status),
  INDEX idx_post_datum (post_datum)
);

-- Allgemeine Kommentare (zusätzlich zu task_comments)
CREATE TABLE IF NOT EXISTS kommentare (
  id VARCHAR(36) PRIMARY KEY,
  text TEXT NOT NULL,
  event_id VARCHAR(36),
  aufgabe_id VARCHAR(36),
  dokument_id VARCHAR(36),
  autor_id VARCHAR(36) NOT NULL,
  erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  erwaehnte_personen_ids JSON,
  ist_intern BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (aufgabe_id) REFERENCES aufgaben(id) ON DELETE CASCADE,
  FOREIGN KEY (dokument_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (autor_id) REFERENCES mitglieder(id),
  INDEX idx_event (event_id),
  INDEX idx_aufgabe (aufgabe_id),
  INDEX idx_autor (autor_id),
  INDEX idx_erstellt (erstellt_am)
);
