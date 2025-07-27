-- Migration: Einheitliche Soft Deletes
USE fanini_db;

-- Tasks: Von geloescht zu deleted_at
ALTER TABLE tasks
ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL,
ADD COLUMN deleted_by VARCHAR(36) NULL DEFAULT NULL,
ADD INDEX idx_deleted (deleted_at);

-- Migriere alte boolean Daten
UPDATE tasks
SET
  deleted_at = aktualisiert_am,
  deleted_by = erstellt_von
WHERE
  geloescht = TRUE
  AND deleted_at IS NULL;

-- Foreign Key nur wenn Spalte existiert
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_deleted_by FOREIGN KEY (deleted_by) REFERENCES users (id) ON DELETE SET NULL;

-- Documents & Mitglieder
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS deleted_by VARCHAR(36) NULL,
ADD INDEX IF NOT EXISTS idx_deleted (deleted_at);

ALTER TABLE mitglieder
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS deleted_by VARCHAR(36) NULL,
ADD INDEX IF NOT EXISTS idx_deleted (deleted_at);
