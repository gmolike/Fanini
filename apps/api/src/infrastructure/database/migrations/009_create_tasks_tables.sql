-- Haupt-Task-Tabelle
CREATE TABLE
  IF NOT EXISTS tasks (
    id VARCHAR(36) PRIMARY KEY,
    titel VARCHAR(255) NOT NULL,
    beschreibung TEXT,
    context_type ENUM ('event', 'team', 'general') NOT NULL,
    context_id VARCHAR(36),
    verantwortlich_id VARCHAR(36),
    status ENUM (
      'offen',
      'in_bearbeitung',
      'review',
      'erledigt',
      'blockiert'
    ) NOT NULL DEFAULT 'offen',
    prioritaet ENUM ('niedrig', 'mittel', 'hoch', 'kritisch') NOT NULL DEFAULT 'mittel',
    frist DATETIME,
    materialien JSON,
    abhaengig_von JSON,
    ist_standardaufgabe BOOLEAN DEFAULT FALSE,
    kategorie VARCHAR(100),
    erstellt_von VARCHAR(36) NOT NULL,
    erstellt_am TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    aktualisiert_am TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    erledigt_am DATETIME,
    erledigt_von VARCHAR(36),
    geloescht BOOLEAN DEFAULT FALSE,
    INDEX idx_context (context_type, context_id),
    INDEX idx_status (status),
    INDEX idx_frist (frist),
    INDEX idx_geloescht (geloescht),
    FOREIGN KEY (verantwortlich_id) REFERENCES mitglieder (id),
    FOREIGN KEY (erstellt_von) REFERENCES mitglieder (id)
  );

-- Task-Zuweisungen
CREATE TABLE
  IF NOT EXISTS task_assignments (
    task_id VARCHAR(36) NOT NULL,
    mitglied_id VARCHAR(36) NOT NULL,
    zugewiesen_am TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    zugewiesen_von VARCHAR(36) NOT NULL,
    kommentar TEXT,
    PRIMARY KEY (task_id, mitglied_id),
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
    FOREIGN KEY (mitglied_id) REFERENCES mitglieder (id),
    FOREIGN KEY (zugewiesen_von) REFERENCES mitglieder (id)
  );

-- Task-Kommentare
CREATE TABLE
  IF NOT EXISTS task_comments (
    id VARCHAR(36) PRIMARY KEY,
    task_id VARCHAR(36) NOT NULL,
    autor_id VARCHAR(36) NOT NULL,
    text TEXT NOT NULL,
    erwaehnte_personen JSON,
    erstellt_am TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
    FOREIGN KEY (autor_id) REFERENCES mitglieder (id),
    INDEX idx_task_comments (task_id, erstellt_am)
  );

-- Audit-Log für Tasks
CREATE TABLE
  IF NOT EXISTS task_audit_log (
    id VARCHAR(36) PRIMARY KEY,
    task_id VARCHAR(36) NOT NULL,
    aktion VARCHAR(50) NOT NULL,
    ausgefuehrt_von VARCHAR(36) NOT NULL,
    ausgefuehrt_am TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    alte_werte JSON,
    neue_werte JSON,
    ip_adresse VARCHAR(45),
    user_agent TEXT,
    INDEX idx_task_audit (task_id, ausgefuehrt_am),
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
    FOREIGN KEY (ausgefuehrt_von) REFERENCES mitglieder (id)
  );
