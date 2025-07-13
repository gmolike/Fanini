-- apps/api/src/infrastructure/database/migrations/007_update_events_table.sql
-- Stellvertreter IDs
ALTER TABLE events
ADD COLUMN stellvertreter_ids JSON COMMENT 'Array von stellvertretenden Mitglieder-IDs';

-- Ticket Link
ALTER TABLE events
ADD COLUMN ticket_link VARCHAR(500);

-- Aktualisierungs-Tracking
ALTER TABLE events
ADD COLUMN aktualisiert_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE events
ADD COLUMN aktualisiert_von VARCHAR(36);

-- Indices
CREATE INDEX idx_oeffentlich ON events (ist_oeffentlich);

CREATE INDEX idx_typ ON events (typ);

CREATE INDEX idx_genehmigt ON events (genehmigt_am);
