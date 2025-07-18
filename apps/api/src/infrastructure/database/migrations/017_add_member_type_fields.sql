-- apps/api/src/infrastructure/database/migrations/017_add_member_type_fields.sql
ALTER TABLE mitglieder
ADD COLUMN member_type ENUM('easyverein', 'creator', 'sponsor', 'partner') DEFAULT 'easyverein',
ADD COLUMN is_local BOOLEAN GENERATED ALWAYS AS (member_type != 'easyverein') STORED,
ADD INDEX idx_member_type (member_type),
ADD INDEX idx_is_local (is_local);

-- Creator-spezifische Felder in creators Tabelle sind bereits vorhanden
