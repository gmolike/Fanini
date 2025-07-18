-- apps/api/src/infrastructure/database/migrations/015_create_approval_system.sql

-- Approval Requests für Änderungen die Genehmigung benötigen
CREATE TABLE IF NOT EXISTS approval_requests (
  id VARCHAR(36) PRIMARY KEY,
  request_type ENUM('member_edit', 'role_assignment', 'event_creation', 'finance_expense') NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id VARCHAR(36) NOT NULL,
  requested_by VARCHAR(36) NOT NULL,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
  old_data JSON COMMENT 'Originaldaten vor der Änderung',
  new_data JSON COMMENT 'Geplante neue Daten',
  changes_summary TEXT COMMENT 'Zusammenfassung der Änderungen',
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  due_date DATETIME,
  FOREIGN KEY (requested_by) REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_resource (resource_type, resource_id),
  INDEX idx_requested_by (requested_by)
);

-- Approval Actions - wer hat was genehmigt/abgelehnt
CREATE TABLE IF NOT EXISTS approval_actions (
  id VARCHAR(36) PRIMARY KEY,
  request_id VARCHAR(36) NOT NULL,
  action ENUM('approved', 'rejected', 'requested_info', 'commented') NOT NULL,
  performed_by VARCHAR(36) NOT NULL,
  performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  comment TEXT,
  FOREIGN KEY (request_id) REFERENCES approval_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (performed_by) REFERENCES users(id),
  INDEX idx_request (request_id)
);

-- Approval Rules - definiert wer was genehmigen muss
CREATE TABLE IF NOT EXISTS approval_rules (
  id VARCHAR(36) PRIMARY KEY,
  resource_type VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  field_name VARCHAR(100) COMMENT 'Spezifisches Feld das Genehmigung braucht',
  required_role_id VARCHAR(36) NOT NULL,
  min_approvers INT DEFAULT 1,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (required_role_id) REFERENCES roles(id),
  UNIQUE KEY unique_rule (resource_type, action, field_name)
);

-- Standard Approval Rules
INSERT INTO approval_rules (id, resource_type, action, field_name, required_role_id, min_approvers, description) VALUES
  ('ar_member_sensitive', 'member', 'edit', 'mitgliedsnummer', 'role_vorstand', 1, 'Änderung der Mitgliedsnummer'),
  ('ar_member_role', 'member', 'assign_role', NULL, 'role_beirat', 1, 'Rollenzuweisung'),
  ('ar_member_status', 'member', 'edit', 'ist_aktiv', 'role_beirat', 1, 'Statusänderung'),
  ('ar_event_approval', 'event', 'approve', NULL, 'role_beirat', 2, 'Event-Genehmigung'),
  ('ar_finance_high', 'expense', 'approve', NULL, 'role_vorstand', 1, 'Ausgaben über 500€');

-- Benachrichtigungen für Approvals
CREATE TABLE IF NOT EXISTS approval_notifications (
  id VARCHAR(36) PRIMARY KEY,
  request_id VARCHAR(36) NOT NULL,
  notified_user_id VARCHAR(36) NOT NULL,
  notification_type ENUM('new_request', 'status_change', 'reminder') NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP NULL,
  FOREIGN KEY (request_id) REFERENCES approval_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (notified_user_id) REFERENCES users(id),
  INDEX idx_user_unread (notified_user_id, read_at)
);
