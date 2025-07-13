-- apps/api/src/infrastructure/database/migrations/004_update_documents_google_drive.sql
ALTER TABLE documents
ADD COLUMN google_drive_file_id VARCHAR(255) UNIQUE,
ADD COLUMN is_public BOOLEAN DEFAULT FALSE,
ADD COLUMN created_by VARCHAR(36),
ADD INDEX idx_google_drive_id (google_drive_file_id),
ADD FOREIGN KEY (created_by) REFERENCES mitglieder (id);
