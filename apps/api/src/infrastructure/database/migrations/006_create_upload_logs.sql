-- apps/api/src/infrastructure/database/migrations/006_create_upload_logs.sql
CREATE TABLE
  IF NOT EXISTS upload_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INT UNSIGNED NOT NULL,
    upload_type ENUM (
      'document',
      'image',
      'event_photo',
      'profile_image'
    ) NOT NULL,
    google_drive_file_id VARCHAR(255),
    folder_id VARCHAR(255) NOT NULL,
    status ENUM ('success', 'failed') NOT NULL,
    error_message TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_uploaded_at (uploaded_at),
    INDEX idx_upload_type (upload_type),
    FOREIGN KEY (user_id) REFERENCES mitglieder (id)
  );
