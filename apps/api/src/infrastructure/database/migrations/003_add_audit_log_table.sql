-- apps/api/src/infrastructure/database/migrations/003_audit_log_system.sql
USE fanini_db;
GO

-- =====================================
-- AUDIT LOG SYSTEM
-- =====================================

-- 1. Haupt Audit Log Tabelle
CREATE TABLE audit_logs (
  id VARCHAR(36) PRIMARY KEY,
  timestamp DATETIME2 NOT NULL DEFAULT GETDATE(),
  user_id VARCHAR(36) NOT NULL,
  user_name VARCHAR(255),
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(255) NOT NULL,
  entity_name VARCHAR(255),
  changes NVARCHAR(MAX), -- JSON in SQL Server
  metadata NVARCHAR(MAX), -- JSON in SQL Server

  -- Context Information
  ip_address VARCHAR(45),
  user_agent NVARCHAR(MAX),
  session_id VARCHAR(255),
  request_id VARCHAR(36)
);
GO

-- Indexes
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_session ON audit_logs(session_id);
GO

-- Foreign Key
ALTER TABLE audit_logs
ADD CONSTRAINT fk_audit_user
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
GO

-- 2. Partitionierung für SQL Server (Partition Function und Scheme)
-- Partition Function
CREATE PARTITION FUNCTION pf_audit_logs_by_year (DATETIME2)
AS RANGE RIGHT FOR VALUES (
  '2024-01-01',
  '2025-01-01',
  '2026-01-01',
  '2027-01-01',
  '2028-01-01'
);
GO

-- Partition Scheme
CREATE PARTITION SCHEME ps_audit_logs_by_year
AS PARTITION pf_audit_logs_by_year
ALL TO ([PRIMARY]);
GO

-- Recreate table with partitioning
CREATE TABLE audit_logs_partitioned (
  id VARCHAR(36) NOT NULL,
  timestamp DATETIME2 NOT NULL DEFAULT GETDATE(),
  user_id VARCHAR(36) NOT NULL,
  user_name VARCHAR(255),
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(255) NOT NULL,
  entity_name VARCHAR(255),
  changes NVARCHAR(MAX),
  metadata NVARCHAR(MAX),
  ip_address VARCHAR(45),
  user_agent NVARCHAR(MAX),
  session_id VARCHAR(255),
  request_id VARCHAR(36),
  CONSTRAINT pk_audit_logs_partitioned PRIMARY KEY (id, timestamp)
) ON ps_audit_logs_by_year(timestamp);
GO

-- 3. Audit Log Retention Policy
CREATE TABLE audit_log_retention_policies (
  id VARCHAR(36) PRIMARY KEY,
  entity_type VARCHAR(50),
  action VARCHAR(50),
  retention_days INT NOT NULL DEFAULT 730,
  is_permanent BIT DEFAULT 0,
  description NVARCHAR(MAX),
  created_at DATETIME2 DEFAULT GETDATE()
);
GO

-- Unique constraint
ALTER TABLE audit_log_retention_policies
ADD CONSTRAINT uc_entity_action UNIQUE (entity_type, action);
GO

-- 4. Audit Log Archive
CREATE TABLE audit_log_archives (
  id VARCHAR(36) PRIMARY KEY,
  requested_by VARCHAR(36) NOT NULL,
  requested_at DATETIME2 DEFAULT GETDATE(),
  filters NVARCHAR(MAX),
  entry_count INT NOT NULL,
  file_path NVARCHAR(500),
  expires_at DATETIME2,
  download_count INT DEFAULT 0,
  last_downloaded_at DATETIME2 NULL
);
GO

-- Indexes
CREATE INDEX idx_archive_user ON audit_log_archives(requested_by);
CREATE INDEX idx_archive_expires ON audit_log_archives(expires_at);
GO

-- Foreign Key
ALTER TABLE audit_log_archives
ADD CONSTRAINT fk_archive_user
FOREIGN KEY (requested_by) REFERENCES users(id);
GO

-- 5. Sensitive Field Masking Rules
CREATE TABLE audit_sensitive_fields (
  id VARCHAR(36) PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  field_name VARCHAR(100) NOT NULL,
  masking_type VARCHAR(50) NOT NULL DEFAULT 'partial',
  masking_pattern VARCHAR(255),
  applies_to_roles NVARCHAR(MAX),
  created_at DATETIME2 DEFAULT GETDATE()
);
GO

-- Unique constraint
ALTER TABLE audit_sensitive_fields
ADD CONSTRAINT uc_sensitive_entity_field UNIQUE (entity_type, field_name);
GO

-- 6. Integration mit Approval System
ALTER TABLE approval_requests
ADD audit_log_id VARCHAR(36);
GO

ALTER TABLE approval_requests
ADD CONSTRAINT fk_approval_audit
FOREIGN KEY (audit_log_id) REFERENCES audit_logs(id);
GO

-- 7. Default Retention Policies
INSERT INTO audit_log_retention_policies (id, entity_type, action, retention_days, is_permanent, description) VALUES
  (NEWID(), '*', 'created', 2555, 1, 'Erstellungen werden dauerhaft aufbewahrt'),
  (NEWID(), '*', 'deleted', 2555, 1, 'Löschungen werden dauerhaft aufbewahrt'),
  (NEWID(), '*', 'approved', 1825, 0, 'Genehmigungen werden 5 Jahre aufbewahrt'),
  (NEWID(), '*', 'rejected', 1095, 0, 'Ablehnungen werden 3 Jahre aufbewahrt'),
  (NEWID(), 'member', 'updated', 1095, 0, 'Mitglieder-Updates werden 3 Jahre aufbewahrt'),
  (NEWID(), 'finance', '*', 2555, 1, 'Finanz-Logs werden 7 Jahre aufbewahrt (gesetzlich)'),
  (NEWID(), '*', 'exported', 365, 0, 'Export-Logs werden 1 Jahr aufbewahrt'),
  (NEWID(), '*', 'viewed', 90, 0, 'View-Logs werden 90 Tage aufbewahrt'),
  (NEWID(), '*', 'status_changed', 1095, 0, 'Status-Änderungen werden 3 Jahre aufbewahrt');
GO

-- 8. Default Sensitive Field Rules
INSERT INTO audit_sensitive_fields (id, entity_type, field_name, masking_type, masking_pattern) VALUES
  (NEWID(), 'member', 'email', 'partial', 'SHOW_FIRST:2,SHOW_DOMAIN:true'),
  (NEWID(), 'member', 'phone', 'partial', 'SHOW_FIRST:3,SHOW_LAST:2'),
  (NEWID(), 'member', 'birthdate', 'full', 'REPLACE:[DATUM]'),
  (NEWID(), 'member', 'address', 'full', 'REPLACE:[ADRESSE]'),
  (NEWID(), 'member', 'iban', 'partial', 'SHOW_FIRST:2,SHOW_LAST:2'),
  (NEWID(), '*', 'password', 'full', 'REPLACE:[GESCHÜTZT]'),
  (NEWID(), '*', 'passwordHash', 'full', 'REPLACE:[HASH]');
GO

-- 9. Migrate existing audit logs (if any exist)
IF OBJECT_ID('event_audit_logs', 'U') IS NOT NULL
BEGIN
  INSERT INTO audit_logs (
    id,
    timestamp,
    user_id,
    user_name,
    action,
    entity_type,
    entity_id,
    entity_name,
    changes,
    metadata
  )
  SELECT
    CONCAT('mig_evt_', NEWID()) as id,
    e.changed_at as timestamp,
    e.changed_by as user_id,
    (SELECT TOP 1 CONCAT(vorname, ' ', nachname) FROM members WHERE user_id = e.changed_by) as user_name,
    CASE
      WHEN e.action = 'created' THEN 'created'
      WHEN e.action = 'updated' THEN 'updated'
      WHEN e.action = 'status_changed' THEN 'status_changed'
      WHEN e.action = 'deleted' THEN 'deleted'
      ELSE e.action
    END as action,
    'event' as entity_type,
    e.event_id as entity_id,
    (SELECT title FROM events WHERE id = e.event_id) as entity_name,
    CASE
      WHEN e.field_name IS NOT NULL THEN
        JSON_QUERY('[{"field":"' + e.field_name + '","oldValue":"' + ISNULL(e.old_value,'') + '","newValue":"' + ISNULL(e.new_value,'') + '","fieldType":"string"}]')
      ELSE NULL
    END as changes,
    JSON_OBJECT(
      'migrated': CAST(1 as bit),
      'source': 'event_audit_logs',
      'originalAction': e.action,
      'migrationDate': GETDATE()
    ) as metadata
  FROM event_audit_logs e
  WHERE NOT EXISTS (
    SELECT 1 FROM audit_logs
    WHERE entity_type = 'event'
    AND entity_id = e.event_id
    AND timestamp = e.changed_at
  );
END
GO

-- 10. Views für Reporting
CREATE VIEW v_audit_log_summary AS
SELECT
  CAST(timestamp AS DATE) as date,
  entity_type,
  action,
  COUNT(*) as count,
  COUNT(DISTINCT user_id) as unique_users
FROM audit_logs
GROUP BY CAST(timestamp AS DATE), entity_type, action;
GO

CREATE VIEW v_audit_user_activity AS
SELECT
  user_id,
  user_name,
  COUNT(*) as total_actions,
  COUNT(DISTINCT CAST(timestamp AS DATE)) as active_days,
  MIN(timestamp) as first_action,
  MAX(timestamp) as last_action
FROM audit_logs
GROUP BY user_id, user_name;
GO

-- 11. Stored Procedures
-- Procedure für Audit Log Cleanup
CREATE PROCEDURE sp_audit_log_cleanup
AS
BEGIN
  DECLARE @entity_type VARCHAR(50);
  DECLARE @action VARCHAR(50);
  DECLARE @retention_days INT;
  DECLARE @is_permanent BIT;

  DECLARE retention_cursor CURSOR FOR
    SELECT entity_type, action, retention_days, is_permanent
    FROM audit_log_retention_policies
    WHERE is_permanent = 0;

  OPEN retention_cursor;

  FETCH NEXT FROM retention_cursor INTO @entity_type, @action, @retention_days, @is_permanent;

  WHILE @@FETCH_STATUS = 0
  BEGIN
    -- Lösche alte Einträge basierend auf Policy
    IF @entity_type = '*' AND @action = '*'
    BEGIN
      DELETE FROM audit_logs
      WHERE timestamp < DATEADD(DAY, -@retention_days, GETDATE());
    END
    ELSE IF @entity_type = '*'
    BEGIN
      DELETE FROM audit_logs
      WHERE action = @action
      AND timestamp < DATEADD(DAY, -@retention_days, GETDATE());
    END
    ELSE IF @action = '*'
    BEGIN
      DELETE FROM audit_logs
      WHERE entity_type = @entity_type
      AND timestamp < DATEADD(DAY, -@retention_days, GETDATE());
    END
    ELSE
    BEGIN
      DELETE FROM audit_logs
      WHERE entity_type = @entity_type
      AND action = @action
      AND timestamp < DATEADD(DAY, -@retention_days, GETDATE());
    END

    FETCH NEXT FROM retention_cursor INTO @entity_type, @action, @retention_days, @is_permanent;
  END

  CLOSE retention_cursor;
  DEALLOCATE retention_cursor;
END
GO

-- Procedure für DSGVO Export
CREATE PROCEDURE sp_audit_log_export_user
  @user_id VARCHAR(36)
AS
BEGIN
  SELECT
    id,
    timestamp,
    action,
    entity_type,
    entity_id,
    entity_name,
    changes,
    metadata
  FROM audit_logs
  WHERE user_id = @user_id
  ORDER BY timestamp DESC;
END
GO

-- 12. SQL Server Agent Jobs (müssen separat eingerichtet werden)
-- Job für tägliche Bereinigung
-- Job für wöchentliche Archive-Bereinigung

-- 13. Trigger für automatisches Audit Logging
CREATE TRIGGER tr_member_update_audit
ON members
AFTER UPDATE
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @changes NVARCHAR(MAX) = '[]';
  DECLARE @user_id VARCHAR(36);

  -- Für jeden aktualisierten Datensatz
  INSERT INTO audit_logs (
    id, user_id, action, entity_type, entity_id, entity_name, changes, metadata
  )
  SELECT
    NEWID(),
    ISNULL(CAST(SESSION_CONTEXT(N'user_id') AS VARCHAR(36)), i.user_id),
    'updated',
    'member',
    i.id,
    CONCAT(i.vorname, ' ', i.nachname),
    (
      SELECT
        'field' = CASE
          WHEN i.vorname != d.vorname THEN 'vorname'
          WHEN i.nachname != d.nachname THEN 'nachname'
          WHEN i.email != d.email THEN 'email'
        END,
        'oldValue' = CASE
          WHEN i.vorname != d.vorname THEN d.vorname
          WHEN i.nachname != d.nachname THEN d.nachname
          WHEN i.email != d.email THEN d.email
        END,
        'newValue' = CASE
          WHEN i.vorname != d.vorname THEN i.vorname
          WHEN i.nachname != d.nachname THEN i.nachname
          WHEN i.email != d.email THEN i.email
        END
      FROM inserted i
      INNER JOIN deleted d ON i.id = d.id
      WHERE i.vorname != d.vorname
         OR i.nachname != d.nachname
         OR i.email != d.email
      FOR JSON PATH
    ),
    '{"source":"database_trigger"}'
  FROM inserted i
  INNER JOIN deleted d ON i.id = d.id
  WHERE i.vorname != d.vorname
     OR i.nachname != d.nachname
     OR i.email != d.email;
END
GO
