-- Migration: Performance Indizes
USE fanini_db;

-- Compound Indexes nur wenn nicht vorhanden
ALTER TABLE events ADD INDEX IF NOT EXISTS idx_date_status (datum, status, deleted_at);

ALTER TABLE tasks ADD INDEX IF NOT EXISTS idx_context (context_type, context_id, deleted_at);

ALTER TABLE benachrichtigungen ADD INDEX IF NOT EXISTS idx_unread (empfaenger_id, gelesen, versendet_am);

-- Cleanup alte boolean Spalte
ALTER TABLE tasks
DROP COLUMN IF EXISTS geloescht;
