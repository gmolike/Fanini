-- Migration: Views für Clean Architecture
USE fanini_db;

-- =====================================
-- VIEW: Aktive Mitglieder mit User-Daten
-- =====================================
DROP VIEW IF EXISTS v_active_members;

CREATE VIEW
  v_active_members AS
SELECT
  m.id,
  m.user_id,
  m.vorname,
  m.nachname,
  m.email,
  m.telefon,
  m.ist_aktiv,
  m.mitglied_seit,
  m.sichtbarkeit_email,
  m.sichtbarkeit_telefon,
  m.sichtbarkeit_profil,
  u.email as auth_email,
  u.role as auth_role,
  u.letzter_login,
  u.ist_aktiv as user_aktiv,
  u.must_change_password,
  r.name as role_name,
  r.hierarchie_ebene
FROM
  mitglieder m
  INNER JOIN users u ON m.user_id = u.id
  LEFT JOIN user_roles ur ON u.id = ur.user_id
  AND ur.gueltig_bis IS NULL
  LEFT JOIN roles r ON ur.role_id = r.id
WHERE
  m.deleted_at IS NULL
  AND u.ist_aktiv = 1;

-- =====================================
-- VIEW: Tasks mit Zuweisungen
-- =====================================
DROP VIEW IF EXISTS v_tasks_with_assignees;

CREATE VIEW
  v_tasks_with_assignees AS
SELECT
  t.*,
  GROUP_CONCAT (
    DISTINCT CONCAT (m.vorname, ' ', m.nachname)
    ORDER BY
      ta.zugewiesen_am SEPARATOR ', '
  ) as zugewiesene_namen,
  COUNT(DISTINCT ta.mitglied_id) as anzahl_zugewiesene
FROM
  tasks t
  LEFT JOIN task_assignments ta ON t.id = ta.task_id
  LEFT JOIN mitglieder m ON ta.mitglied_id = m.id
WHERE
  t.deleted_at IS NULL
GROUP BY
  t.id;

-- =====================================
-- VIEW: User Permissions (aufgelöst)
-- =====================================
DROP VIEW IF EXISTS v_user_permissions;

CREATE VIEW
  v_user_permissions AS
SELECT DISTINCT
  u.id as user_id,
  u.email,
  r.name as role_name,
  p.resource,
  p.action,
  p.conditions
FROM
  users u
  INNER JOIN user_roles ur ON u.id = ur.user_id
  INNER JOIN roles r ON ur.role_id = r.id
  INNER JOIN role_permissions rp ON r.id = rp.role_id
  INNER JOIN permissions p ON rp.permission_id = p.id
WHERE
  u.ist_aktiv = 1
  AND (
    ur.gueltig_bis IS NULL
    OR ur.gueltig_bis > NOW ()
  )
UNION
-- Vererbte Permissions
SELECT DISTINCT
  u.id as user_id,
  u.email,
  pr.name as role_name,
  p.resource,
  p.action,
  p.conditions
FROM
  users u
  INNER JOIN user_roles ur ON u.id = ur.user_id
  INNER JOIN role_hierarchy rh ON ur.role_id = rh.child_role_id
  INNER JOIN roles pr ON rh.parent_role_id = pr.id
  INNER JOIN role_permissions rp ON pr.id = rp.role_id
  INNER JOIN permissions p ON rp.permission_id = p.id
WHERE
  u.ist_aktiv = 1
  AND (
    ur.gueltig_bis IS NULL
    OR ur.gueltig_bis > NOW ()
  );
