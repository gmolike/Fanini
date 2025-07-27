-- Migration: Bereinigung doppelter Tabellen
USE fanini_db;

-- =====================================
-- 1. AUFGABEN → TASKS MIGRATION
-- =====================================
-- Nur migrieren wenn tasks leer ist
INSERT INTO
  tasks (
    id,
    titel,
    beschreibung,
    context_type,
    context_id,
    verantwortlich_id,
    status,
    prioritaet,
    frist,
    erstellt_von,
    erstellt_am,
    aktualisiert_am
  )
SELECT
  a.id,
  a.titel,
  a.beschreibung,
  'event' as context_type,
  a.event_id as context_id,
  a.verantwortlich_id,
  a.status,
  a.prioritaet,
  a.frist,
  a.erstellt_von,
  a.erstellt_am,
  a.aktualisiert_am
FROM
  aufgaben a
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      tasks t
    WHERE
      t.id = a.id
  );

-- Lösche Legacy-Tabelle
DROP TABLE IF EXISTS aufgaben;

-- =====================================
-- 2. EVENT_TEILNAHME VEREINHEITLICHEN
-- =====================================
-- Sichere unique constraint
ALTER TABLE event_teilnahmen
DROP INDEX IF EXISTS unique_teilnahme,
ADD UNIQUE KEY unique_teilnahme (event_id, mitglied_id);

-- Lösche Duplikat-Tabelle falls vorhanden
DROP TABLE IF EXISTS event_teilnahme;
