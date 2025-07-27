-- apps/api/src/infrastructure/database/migrations/002_extended_approval_system.sql
USE fanini_db;

-- =====================================
-- EXTENDED APPROVAL SYSTEM
-- =====================================

-- 1. Approval Field Rules
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='approval_field_rules' AND xtype='U')
BEGIN
  CREATE TABLE approval_field_rules (
    id VARCHAR(36) PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    rule_name VARCHAR(255) NOT NULL,
    approval_type VARCHAR(20) DEFAULT 'immediate',
    auto_approve_after_hours INT NULL,
    applies_to_roles NVARCHAR(MAX),
    condition_type VARCHAR(20) DEFAULT 'always',
    condition_config NVARCHAR(MAX),
    min_approvers INT DEFAULT 1,
    max_approvers INT NULL,
    approver_selection VARCHAR(20) DEFAULT 'any',
    self_approval_allowed BIT DEFAULT 0,
    bypass_roles NVARCHAR(MAX),
    escalation_enabled BIT DEFAULT 0,
    notification_template_id VARCHAR(36),
    notification_channels NVARCHAR(MAX),
    priority VARCHAR(20) DEFAULT 'medium',
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT unique_entity_field_rule UNIQUE (entity_type, field_name, rule_name)
  );
  CREATE INDEX idx_entity_type ON approval_field_rules (entity_type);
  CREATE INDEX idx_active_rules ON approval_field_rules (is_active, entity_type);
END

-- 2. Approval Groups
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='approval_groups' AND xtype='U')
BEGIN
  CREATE TABLE approval_groups (
    id VARCHAR(36) PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(MAX),
    group_type VARCHAR(50) NOT NULL, -- ENUM replaced with VARCHAR
    config NVARCHAR(MAX), -- JSON replaced with NVARCHAR(MAX)
    parent_group_id VARCHAR(36) NULL,
    escalation_timeout_hours INT DEFAULT 48,
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE()
  );
END

-- 3. Approval Rule Groups
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='approval_rule_groups' AND xtype='U')
BEGIN
  CREATE TABLE approval_rule_groups (
    rule_id VARCHAR(36) NOT NULL,
    group_id VARCHAR(36) NOT NULL,
    group_order INT DEFAULT 0,
    is_optional BIT DEFAULT 0,
    PRIMARY KEY (rule_id, group_id)
  );
END

-- 4. Approval Escalations
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='approval_escalations' AND xtype='U')
BEGIN
  CREATE TABLE approval_escalations (
    id VARCHAR(36) PRIMARY KEY,
    rule_id VARCHAR(36) NOT NULL,
    escalation_level INT NOT NULL,
    trigger_after_hours INT NOT NULL,
    trigger_on_rejection BIT DEFAULT 0,
    escalate_to_group_id VARCHAR(36) NOT NULL,
    override_min_approvers INT NULL,
    auto_approve BIT DEFAULT 0,
    notification_urgency VARCHAR(20) DEFAULT 'high',
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT unique_rule_level UNIQUE (rule_id, escalation_level)
  );
END

-- 5. Approval Contexts
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='approval_contexts' AND xtype='U')
BEGIN
  CREATE TABLE approval_contexts (
    id VARCHAR(36) PRIMARY KEY,
    context_name VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    condition_query NVARCHAR(MAX),
    condition_params NVARCHAR(MAX),
    override_rules NVARCHAR(MAX),
    valid_from DATE NULL,
    valid_until DATE NULL,
    priority INT DEFAULT 100,
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE()
  );
END

-- 6. Approval Notification Templates
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='approval_notification_templates' AND xtype='U')
BEGIN
  CREATE TABLE approval_notification_templates (
    id VARCHAR(36) PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL,
    template_type VARCHAR(50) NOT NULL, -- ENUM replaced with VARCHAR
    subject_template NVARCHAR(MAX) NOT NULL, -- TEXT replaced with NVARCHAR(MAX)
    body_template NVARCHAR(MAX) NOT NULL, -- TEXT replaced with NVARCHAR(MAX)
    available_variables NVARCHAR(MAX), -- JSON replaced with NVARCHAR(MAX)
    include_change_details BIT DEFAULT 1, -- BOOLEAN replaced with BIT
    include_approve_link BIT DEFAULT 1, -- BOOLEAN replaced with BIT
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
  );
END

-- 7. Approval Action Log
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='approval_action_log' AND xtype='U')
BEGIN
  CREATE TABLE approval_action_log (
    id VARCHAR(36) PRIMARY KEY,
    request_id VARCHAR(36) NOT NULL,
    action_type VARCHAR(20) NOT NULL, -- ENUM replaced with VARCHAR
    performed_by VARCHAR(36),
    performed_at DATETIME DEFAULT GETDATE(),
    details NVARCHAR(MAX), -- JSON replaced with NVARCHAR(MAX)
    ip_address VARCHAR(45),
    user_agent VARCHAR(255)
  );
END

-- 8. Foreign Keys hinzufügen
ALTER TABLE approval_groups ADD CONSTRAINT fk_approval_groups_parent
  FOREIGN KEY (parent_group_id) REFERENCES approval_groups(id);

ALTER TABLE approval_rule_groups ADD CONSTRAINT fk_rule_groups_rule
  FOREIGN KEY (rule_id) REFERENCES approval_field_rules(id) ON DELETE CASCADE;

ALTER TABLE approval_rule_groups ADD CONSTRAINT fk_rule_groups_group
  FOREIGN KEY (group_id) REFERENCES approval_groups(id);

ALTER TABLE approval_escalations ADD CONSTRAINT fk_escalations_rule
  FOREIGN KEY (rule_id) REFERENCES approval_field_rules(id) ON DELETE CASCADE;

ALTER TABLE approval_escalations ADD CONSTRAINT fk_escalations_group
  FOREIGN KEY (escalate_to_group_id) REFERENCES approval_groups(id);

ALTER TABLE approval_action_log ADD CONSTRAINT fk_action_log_request
  FOREIGN KEY (request_id) REFERENCES approval_requests(id);

ALTER TABLE approval_action_log ADD CONSTRAINT fk_action_log_user
  FOREIGN KEY (performed_by) REFERENCES users(id);

-- 9. Erweitere approval_requests
ALTER TABLE approval_requests ADD rule_id VARCHAR(36);

ALTER TABLE approval_requests ADD CONSTRAINT fk_requests_rule
  FOREIGN KEY (rule_id) REFERENCES approval_field_rules(id);

-- 10. Fehlende User-ID Spalten
ALTER TABLE task_assignments ADD zugewiesen_von_user_id VARCHAR(36);
ALTER TABLE task_assignments ADD CONSTRAINT fk_task_assignments_zugewiesen_von_user
  FOREIGN KEY (zugewiesen_von_user_id) REFERENCES users(id);

ALTER TABLE tasks ADD aktualisiert_von_user_id VARCHAR(36);
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_aktualisiert_von_user
  FOREIGN KEY (aktualisiert_von_user_id) REFERENCES users(id);

ALTER TABLE task_audit_log ADD ausgefuehrt_von_user_id VARCHAR(36);
ALTER TABLE task_audit_log ADD CONSTRAINT fk_task_audit_ausgefuehrt_von_user
  FOREIGN KEY (ausgefuehrt_von_user_id) REFERENCES users(id);
