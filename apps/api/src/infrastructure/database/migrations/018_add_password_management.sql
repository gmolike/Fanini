-- apps/api/src/infrastructure/database/migrations/018_add_password_management.sql
ALTER TABLE users
ADD COLUMN password_expires_at TIMESTAMP NULL,
ADD COLUMN must_change_password BOOLEAN DEFAULT FALSE,
ADD COLUMN password_set_by VARCHAR(36),
ADD COLUMN password_set_at TIMESTAMP NULL,
ADD INDEX idx_password_expires (password_expires_at),
ADD INDEX idx_must_change (must_change_password);

-- Password History für Audit
CREATE TABLE IF NOT EXISTS password_history (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  action ENUM('set', 'change', 'reset', 'expire') NOT NULL,
  performed_by VARCHAR(36) NOT NULL,
  performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  temporary BOOLEAN DEFAULT FALSE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (performed_by) REFERENCES users(id),
  INDEX idx_user (user_id),
  INDEX idx_performed_at (performed_at)
);
