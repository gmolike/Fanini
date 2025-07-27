-- Migration: User-Tracking für Audit
USE fanini_db;

-- =====================================
-- PRÜFE EXISTIERENDE STRUKTUR
-- =====================================

-- Events: Füge User-Tracking nur hinzu wenn nicht vorhanden
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'fanini_db'
AND TABLE_NAME = 'events'
AND COLUMN_NAME = 'erstellt_von_user_id';

SET @sql = IF(@col_exists = 0,
  'ALTER TABLE events ADD COLUMN erstellt_von_user_id VARCHAR(36) AFTER erstellt_von',
  'SELECT "Column already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Gleiche Prüfung für andere Spalten...

-- =====================================
-- DATEN MIGRATION (Korrekte Richtung!)
-- =====================================

-- Von Mitglied-ID zur User-ID
UPDATE events e
INNER JOIN mitglieder m ON e.erstellt_von = m.id
SET e.erstellt_von_user_id = m.user_id
WHERE e.erstellt_von_user_id IS NULL
AND m.user_id IS NOT NULL;

-- Für direkte User-Referenzen
UPDATE events e
INNER JOIN users u ON e.erstellt_von = u.id
SET e.erstellt_von_user_id = u.id
WHERE e.erstellt_von_user_id IS NULL
AND e.erstellt_von LIKE 'usr_%';
