-- apps/api/src/infrastructure/database/migrations/002_extended_approval_system.sql
USE fanini_db;

-- =====================================
-- EXTENDED APPROVAL SYSTEM
-- =====================================
-- 1. Approval Field Rules
CREATE TABLE
  approval_field_rules (
    id VARCHAR(36) PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    rule_name VARCHAR(255) NOT NULL,
    approval_type VARCHAR(20) DEFAULT 'immediate',
    auto_approve_after_hours INT,
    applies_to_roles JSON,
    condition_type VARCHAR(20) DEFAULT 'always',
    condition_config JSON,
    min_approvers INT DEFAULT 1,
    max_approvers INT,
    approver_selection VARCHAR(20) DEFAULT 'any',
    self_approval_allowed BOOLEAN DEFAULT FALSE,
    bypass_roles JSON,
    escalation_enabled BOOLEAN DEFAULT FALSE,
    notification_template_id VARCHAR(36),
    notification_channels JSON,
    priority VARCHAR(20) DEFAULT 'medium',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_entity_field_rule UNIQUE (entity_type, field_name, rule_name),
    INDEX idx_entity_type (entity_type),
    INDEX idx_active_rules (is_active, entity_type)
  );

-- 2. Approval Groups
CREATE TABLE
  approval_groups (
    id VARCHAR(36) PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    group_type VARCHAR(50) NOT NULL,
    config JSON,
    parent_group_id VARCHAR(36),
    escalation_timeout_hours INT DEFAULT 48,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

-- 3. Approval Rule Groups
CREATE TABLE
  approval_rule_groups (
    rule_id VARCHAR(36) NOT NULL,
    group_id VARCHAR(36) NOT NULL,
    group_order INT DEFAULT 0,
    is_optional BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (rule_id, group_id)
  );

-- 4. Approval Escalations
CREATE TABLE
  approval_escalations (
    id VARCHAR(36) PRIMARY KEY,
    rule_id VARCHAR(36) NOT NULL,
    escalation_level INT NOT NULL,
    trigger_after_hours INT NOT NULL,
    trigger_on_rejection BOOLEAN DEFAULT FALSE,
    escalate_to_group_id VARCHAR(36) NOT NULL,
    override_min_approvers INT,
    auto_approve BOOLEAN DEFAULT FALSE,
    notification_urgency VARCHAR(20) DEFAULT 'high',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_rule_level UNIQUE (rule_id, escalation_level)
  );

-- 5. Approval Contexts
CREATE TABLE
  approval_contexts (
    id VARCHAR(36) PRIMARY KEY,
    context_name VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    condition_query TEXT,
    condition_params JSON,
    override_rules JSON,
    valid_from DATE,
    valid_until DATE,
    priority INT DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

-- 6. Approval Notification Templates
CREATE TABLE
  approval_notification_templates (
    id VARCHAR(36) PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL,
    template_type VARCHAR(50) NOT NULL,
    subject_template TEXT NOT NULL,
    body_template TEXT NOT NULL,
    available_variables JSON,
    include_change_details BOOLEAN DEFAULT TRUE,
    include_approve_link BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

-- 7. Approval Action Log
CREATE TABLE
  approval_action_log (
    id VARCHAR(36) PRIMARY KEY,
    request_id VARCHAR(36) NOT NULL,
    action_type VARCHAR(20) NOT NULL,
    performed_by VARCHAR(36),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details JSON,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255)
  );

-- 8. Foreign Keys hinzufügen
ALTER TABLE approval_groups ADD CONSTRAINT fk_approval_groups_parent FOREIGN KEY (parent_group_id) REFERENCES approval_groups (id);

ALTER TABLE approval_rule_groups ADD CONSTRAINT fk_rule_groups_rule FOREIGN KEY (rule_id) REFERENCES approval_field_rules (id) ON DELETE CASCADE;

ALTER TABLE approval_rule_groups ADD CONSTRAINT fk_rule_groups_group FOREIGN KEY (group_id) REFERENCES approval_groups (id);

ALTER TABLE approval_escalations ADD CONSTRAINT fk_escalations_rule FOREIGN KEY (rule_id) REFERENCES approval_field_rules (id) ON DELETE CASCADE;

ALTER TABLE approval_escalations ADD CONSTRAINT fk_escalations_group FOREIGN KEY (escalate_to_group_id) REFERENCES approval_groups (id);

ALTER TABLE approval_action_log ADD CONSTRAINT fk_action_log_request FOREIGN KEY (request_id) REFERENCES approval_requests (id);

ALTER TABLE approval_action_log ADD CONSTRAINT fk_action_log_user FOREIGN KEY (performed_by) REFERENCES users (id);

-- 9. Erweitere approval_requests - Einfacher Ansatz
ALTER TABLE approval_requests
ADD rule_id VARCHAR(36);

ALTER TABLE approval_requests ADD CONSTRAINT fk_requests_rule FOREIGN KEY (rule_id) REFERENCES approval_field_rules (id);
