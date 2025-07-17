-- apps/api/src/infrastructure/database/migrations/011_create_refresh_tokens.sql
CREATE TABLE
  IF NOT EXISTS refresh_tokens (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP NULL,
    revoked_by VARCHAR(36) NULL,
    device_info VARCHAR(255),
    ip_address VARCHAR(45),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (revoked_by) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_token (token),
    INDEX idx_user (user_id),
    INDEX idx_expires (expires_at),
    INDEX idx_revoked (revoked_at)
  );

-- Index für Performance bei der Token-Bereinigung
CREATE INDEX idx_cleanup ON refresh_tokens (expires_at, revoked_at);

-- Kommentar zur Tabelle
ALTER TABLE refresh_tokens COMMENT = 'Speichert Refresh Tokens für JWT Authentication mit Audit Trail';

-- Optional: Stored Procedure für Token Cleanup
DELIMITER $$

CREATE PROCEDURE IF NOT EXISTS cleanup_expired_tokens()
BEGIN
    DELETE FROM refresh_tokens
    WHERE expires_at < NOW()
    OR (revoked_at IS NOT NULL AND revoked_at < DATE_SUB(NOW(), INTERVAL 30 DAY));
END$$

DELIMITER ;

-- Event für automatische Bereinigung (täglich um 3 Uhr nachts)
CREATE EVENT IF NOT EXISTS refresh_token_cleanup
ON SCHEDULE EVERY 1 DAY
STARTS (DATE(NOW()) + INTERVAL 1 DAY + INTERVAL 3 HOUR)
DO CALL cleanup_expired_tokens();
