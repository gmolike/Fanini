-- apps/api/src/infrastructure/database/migrations/012_restructure_user_mitglieder.sql

-- Schritt 1: Neue Spalten zu users hinzufügen (falls noch nicht vorhanden)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'MITGLIED' COMMENT 'Primary role for quick checks',
  ADD COLUMN IF NOT EXISTS created_by VARCHAR(36),
  ADD COLUMN IF NOT EXISTS metadata JSON COMMENT 'Zusätzliche flexible Daten',
  ADD INDEX IF NOT EXISTS idx_auth_source (auth_source),
  ADD INDEX IF NOT EXISTS idx_role (role);

-- Schritt 2: Mitglieder Tabelle erweitern
ALTER TABLE mitglieder
  ADD COLUMN IF NOT EXISTS user_id VARCHAR(36) UNIQUE COMMENT 'Verknüpfung zu users Tabelle',
  ADD COLUMN IF NOT EXISTS mitgliedsnummer VARCHAR(50),
  ADD CONSTRAINT IF NOT EXISTS fk_mitglieder_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  ADD INDEX IF NOT EXISTS idx_user_id (user_id);

-- Schritt 3: Migration bestehender Mitglieder zu Users
-- Nur ausführen wenn noch keine Verknüpfung existiert
INSERT INTO users (
  id,
  email,
  vorname,
  nachname,
  mitgliedsnummer,
  auth_source,
  ist_aktiv,
  erstellt_am,
  aktualisiert_am,
  letzter_login
)
SELECT
  CONCAT('usr_', UUID()) as id,
  m.email,
  m.vorname,
  m.nachname,
  m.easyverein_id as mitgliedsnummer,
  'easyverein' as auth_source,
  m.ist_aktiv,
  m.erstellt_am,
  m.aktualisiert_am,
  m.letzter_login
FROM mitglieder m
WHERE NOT EXISTS (
  SELECT 1 FROM users u WHERE u.email = m.email
);

-- Schritt 4: User IDs in Mitglieder Tabelle verknüpfen
UPDATE mitglieder m
JOIN users u ON m.email = u.email
SET m.user_id = u.id
WHERE m.user_id IS NULL;

-- Schritt 5: Creators Tabelle anpassen (für Creator die keine Mitglieder sind)
CREATE TABLE IF NOT EXISTS creators_extended (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  kuenstlername VARCHAR(100) NOT NULL,
  profiltext TEXT NOT NULL,
  portfolio_link VARCHAR(500),
  ist_aktiv BOOLEAN DEFAULT TRUE,
  aktiv_seit DATE NOT NULL,
  deaktiviert_am DATE,
  instagram VARCHAR(100),
  twitter VARCHAR(100),
  website VARCHAR(500),
  erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  aktualisiert_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_aktiv (ist_aktiv)
);

-- Schritt 6: View für einfachen Zugriff auf Mitglieder mit User-Daten
CREATE OR REPLACE VIEW v_mitglieder_full AS
SELECT
  m.*,
  u.email as user_email,
  u.auth_source,
  u.letzter_login as user_letzter_login,
  u.ist_aktiv as user_ist_aktiv,
  ur.role_id,
  r.name as role_name
FROM mitglieder m
JOIN users u ON m.user_id = u.id
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id;

-- Schritt 7: Stored Procedure für neues Mitglied
DELIMITER $$

CREATE PROCEDURE IF NOT EXISTS create_mitglied_with_user(
  IN p_email VARCHAR(255),
  IN p_vorname VARCHAR(100),
  IN p_nachname VARCHAR(100),
  IN p_auth_source VARCHAR(50),
  IN p_easyverein_id VARCHAR(255),
  IN p_mitgliedsnummer VARCHAR(50),
  IN p_telefon VARCHAR(50),
  IN p_mitglied_seit DATE
)
BEGIN
  DECLARE v_user_id VARCHAR(36);
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  -- User erstellen
  SET v_user_id = CONCAT('usr_', UUID());

  INSERT INTO users (
    id, email, vorname, nachname, mitgliedsnummer,
    auth_source, easyverein_id, ist_aktiv
  ) VALUES (
    v_user_id, p_email, p_vorname, p_nachname, p_mitgliedsnummer,
    p_auth_source, p_easyverein_id, TRUE
  );

  -- Mitglied erstellen
  INSERT INTO mitglieder (
    id, user_id, vorname, nachname, email, telefon,
    easyverein_id, mitglied_seit, ist_aktiv
  ) VALUES (
    CONCAT('mbr_', UUID()), v_user_id, p_vorname, p_nachname,
    p_email, p_telefon, p_easyverein_id, p_mitglied_seit, TRUE
  );

  -- Standard-Rolle zuweisen
  INSERT INTO user_roles (user_id, role_id, zugewiesen_von)
  VALUES (v_user_id, 'role_mitglied', v_user_id);

  COMMIT;

  SELECT v_user_id as user_id;
END$$

DELIMITER ;

-- Schritt 8: Alte Spalten entfernen (VORSICHT! Nur nach erfolgreicher Migration)
-- Dies sollte in einer separaten Migration später ausgeführt werden
-- ALTER TABLE mitglieder DROP COLUMN email;
-- ALTER TABLE mitglieder DROP COLUMN letzter_login;
