-- apps/api/src/infrastructure/database/migrations/005_update_documents_extended.sql
ALTER TABLE documents
ADD COLUMN document_type ENUM (
  'document',
  'image',
  'spreadsheet',
  'form',
  'other'
) DEFAULT 'document',
ADD COLUMN folder_path VARCHAR(500),
ADD INDEX idx_document_type (document_type),
ADD INDEX idx_folder_path (folder_path);
