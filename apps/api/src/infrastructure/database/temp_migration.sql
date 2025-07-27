
DROP DATABASE IF EXISTS fanini_db;
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;



CREATE TABLE permission_groups (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
  id VARCHAR(36) PRIMARY KEY,
  resource VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  group_id VARCHAR(36),
  conditions JSON,
  beschreibung TEXT,
  UNIQUE KEY unique_permission (resource, action),
  FOREIGN KEY (group_id) REFERENCES permission_groups(id),
  INDEX idx_resource_action (resource, action)
);

CREATE TABLE roles (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  beschreibung TEXT,
  hierarchie_ebene INT NOT NULL,
  erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_hierarchie (hierarchie_ebene)
);

CREATE TABLE settings (
  id VARCHAR(36) PRIMARY KEY DEFAULT 'global-settings',
  association_name VARCHAR(255) NOT NULL DEFAULT 'Faninitiative Spandau e.V.',
  founded_year INT NOT NULL DEFAULT 2025,
  passion_percentage INT NOT NULL DEFAULT 100,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  contact_address_street VARCHAR(255),
  contact_address_zip VARCHAR(10),
  contact_address_city VARCHAR(100),
  primary_color VARCHAR(7) DEFAULT '#34687e',
  secondary_color VARCHAR(7) DEFAULT '#b94f46',
  accent_color VARCHAR(7) DEFAULT '#e8f0f4',
  logo_url VARCHAR(500),
  logo_alt VARCHAR(255),
  feature_events BOOLEAN DEFAULT TRUE,
  feature_members BOOLEAN DEFAULT TRUE,
  feature_gallery BOOLEAN DEFAULT TRUE,
  feature_newsletter BOOLEAN DEFAULT TRUE,
  feature_creators BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT single_settings CHECK (id = 'global-settings')
);


CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  vorname VARCHAR(100) NOT NULL,
  nachname VARCHAR(100) NOT NULL,
  mitgliedsnummer VARCHAR(50),
  auth_source ENUM('local', 'easyverein') NOT NULL DEFAULT 'easyverein',
  easyverein_id VARCHAR(255),
  password_hash VARCHAR(255),
  ist_aktiv BOOLEAN DEFAULT TRUE,
  role VARCHAR(50) DEFAULT 'MITGLIED',
  created_by VARCHAR(36),
  metadata JSON,
  password_expires_at TIMESTAMP NULL,
  must_change_password BOOLEAN DEFAULT FALSE,
  password_set_by VARCHAR(36),
  password_set_at TIMESTAMP NULL,
  erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  aktualisiert_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  letzter_login TIMESTAMP NULL,
  INDEX idx_email (email),
  INDEX idx_auth_source (auth_source),
  INDEX idx_easyverein_id (easyverein_id),
  INDEX idx_role (role),
  INDEX idx_password_expires (password_expires_at),
  INDEX idx_must_change (must_change_password)
);

CREATE TABLE mitglieder (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) UNIQUE,
  easyverein_id VARCHAR(255) UNIQUE,
  mitgliedsnummer VARCHAR(50),
  vorname VARCHAR(100) NOT NULL,
  nachname VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefon VARCHAR(50),
  geburtsdatum DATE,
  adresse_strasse VARCHAR(255),
  adresse_hausnummer VARCHAR(20),
  adresse_plz VARCHAR(10),
  adresse_stadt VARCHAR(100),
  iban VARCHAR(34),
  notfallkontakt_name VARCHAR(100),
  notfallkontakt_telefon VARCHAR(50),
  ist_aktiv BOOLEAN DEFAULT TRUE,
  hat_vertraulichkeitserklaerung BOOLEAN DEFAULT FALSE,
  datenschutz_einwilligung BOOLEAN DEFAULT FALSE,
  datenschutz_datum TIMESTAMP NULL,
  mitglied_seit DATE NOT NULL,
  austritts_datum DATE,
  profilbild VARCHAR(500),
  beschreibung TEXT,
  sichtbarkeit_email ENUM('oeffentlich', 'intern', 'vorstand', 'privat') DEFAULT 'intern',
  sichtbarkeit_telefon ENUM('oeffentlich', 'intern', 'vorstand', 'privat') DEFAULT 'privat',
  sichtbarkeit_profil ENUM('oeffentlich', 'intern', 'vorstand', 'privat') DEFAULT 'intern',
  member_type ENUM('easyverein', 'creator', 'sponsor', 'partner') DEFAULT 'easyverein',
  is_local BOOLEAN GENERATED ALWAYS AS (member_type != 'easyverein') STORED,
  erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  aktualisiert_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  letzter_login TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL,
  deleted_by VARCHAR(36),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (deleted_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_email (email),
  INDEX idx_aktiv (ist_aktiv),
  INDEX idx_user_id (user_id),
  INDEX idx_member_type (member_type),
  INDEX idx_is_local (is_local),
  INDEX idx_deleted (deleted_at)
);


CREATE TABLE role_permissions (
  role_id VARCHAR(36) NOT NULL,
  permission_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

CREATE TABLE role_hierarchy (
  parent_role_id VARCHAR(36) NOT NULL,
  child_role_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (parent_role_id, child_role_id),
  FOREIGN KEY (parent_role_id) REFERENCES roles(id),
  FOREIGN KEY (child_role_id) REFERENCES roles(id)
);

CREATE TABLE user_roles (
  user_id VARCHAR(36) NOT NULL,
  role_id VARCHAR(36) NOT NULL,
  zugewiesen_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  zugewiesen_von VARCHAR(36),
  gueltig_bis TIMESTAMP NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (zugewiesen_von) REFERENCES users(id)
);


CREATE TABLE events (
  id VARCHAR(36) PRIMARY KEY,
  titel VARCHAR(255) NOT NULL,
  beschreibung TEXT NOT NULL,
  kurzbeschreibung VARCHAR(500),
  datum DATE NOT NULL,
  uhrzeit TIME NOT NULL,
  dauer_minuten INT,
  ort JSON NOT NULL,
  typ ENUM('vereinstreffen', 'sportveranstaltung', 'fanfahrt', 'social', 'sitzung', 'workshop', 'turnier', 'sonstiges') NOT NULL,
  sportbereich ENUM('league_of_legends', 'valorant', 'fussball', 'esports_allgemein', 'sonstiges'),
  status ENUM('entwurf', 'geplant', 'genehmigt', 'aktiv', 'abgeschlossen', 'abgesagt') DEFAULT 'entwurf',
  ist_oeffentlich BOOLEAN DEFAULT FALSE,
  ist_vertraulich BOOLEAN DEFAULT FALSE,
  verantwortlich_id VARCHAR(36) NOT NULL,
  stellvertreter_ids JSON,
  budget DECIMAL(10, 2),
  budget_verbraucht DECIMAL(10, 2) DEFAULT 0,
  max_teilnehmer INT,
  anmeldeschluss DATETIME,
  ticket_link VARCHAR(500),
  erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  erstellt_von VARCHAR(36) NOT NULL,
  erstellt_von_user_id VARCHAR(36),
  aktualisiert_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  aktualisiert_von VARCHAR(36),
  aktualisiert_von_user_id VARCHAR(36),
  genehmigt_am TIMESTAMP NULL,
  genehmigt_von VARCHAR(36),
  deleted_at TIMESTAMP NULL,
  deleted_by VARCHAR(36),
  FOREIGN KEY (verantwortlich_id) REFERENCES mitglieder(id),
  FOREIGN KEY (erstellt_von) REFERENCES mitglieder(id),
  FOREIGN KEY (erstellt_von_user_id) REFERENCES users(id),
  FOREIGN KEY (aktualisiert_von) REFERENCES mitglieder(id),
  FOREIGN KEY (aktualisiert_von_user_id) REFERENCES users(id),
  FOREIGN KEY (genehmigt_von) REFERENCES mitglieder(id),
  FOREIGN KEY (deleted_by) REFERENCES users(id),
  INDEX idx_datum (datum),
  INDEX idx_status (status),
  INDEX idx_oeffentlich (ist_oeffentlich),
  INDEX idx_typ (typ),
  INDEX idx_genehmigt (genehmigt_am),
  INDEX idx_deleted (deleted_at),
  INDEX idx_date_status (datum, status, deleted_at)
);

CREATE TABLE event_audit_log (
  id VARCHAR(36) PRIMARY KEY,
  event_id VARCHAR(36) NOT NULL,
  action VARCHAR(50) NOT NULL,
  field_name VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  changed_by VARCHAR(36) NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id),
  INDEX idx_event_audit (event_id, changed_at)
);

CREATE TABLE event_teilnahmen (
  id VARCHAR(36) PRIMARY KEY,
  event_id VARCHAR(36) NOT NULL,
  mitglied_id VARCHAR(36) NOT NULL,
  angemeldet_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('angemeldet', 'bestaetigt', 'abgesagt', 'teilgenommen') DEFAULT 'angemeldet',
  kommentar TEXT,
  ist_bestaetigt BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (mitglied_id) REFERENCES mitglieder(id),
  UNIQUE KEY unique_teilnahme (event_id, mitglied_id),
  INDEX idx_event (event_id),
  INDEX idx_mitglied (mitglied_id),
  INDEX idx_status (status)
);


CREATE TABLE tasks (
  id VARCHAR(36) PRIMARY KEY,
  titel VARCHAR(255) NOT NULL,
  beschreibung TEXT,
  context_type ENUM('event', 'team', 'general') NOT NULL,
  context_id VARCHAR(36),
  verantwortlich_id VARCHAR(36),
  status ENUM('offen', 'in_bearbeitung', 'review', 'erledigt', 'blockiert') NOT NULL DEFAULT 'offen',
  prioritaet ENUM('niedrig', 'mittel', 'hoch', 'kritisch') NOT NULL DEFAULT 'mittel',
  frist DATETIME,
  materialien JSON,
  abhaengig_von JSON,
  ist_standardaufgabe BOOLEAN DEFAULT FALSE,
  kategorie VARCHAR(100),
  erstellt_von VARCHAR(36) NOT NULL,
  erstellt_von_user_id VARCHAR(36),
  erstellt_am TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  aktualisiert_am TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  erledigt_am DATETIME,
  erledigt_von VARCHAR(36),
  deleted_at TIMESTAMP NULL,
  deleted_by VARCHAR(36),
  FOREIGN KEY (verantwortlich_id) REFERENCES mitglieder(id),
  FOREIGN KEY (erstellt_von) REFERENCES mitglieder(id),
  FOREIGN KEY (erstellt_von_user_id) REFERENCES users(id),
  FOREIGN KEY (erledigt_von) REFERENCES mitglieder(id),
  FOREIGN KEY (deleted_by) REFERENCES users(id),
  INDEX idx_context (context_type, context_id, deleted_at),
  INDEX idx_status (status),
  INDEX idx_frist (frist),
  INDEX idx_deleted (deleted_at)
);

CREATE TABLE task_assignments (
  task_id VARCHAR(36) NOT NULL,
  mitglied_id VARCHAR(36) NOT NULL,
  zugewiesen_am TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  zugewiesen_von VARCHAR(36) NOT NULL,
  kommentar TEXT,
  PRIMARY KEY (task_id, mitglied_id),
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (mitglied_id) REFERENCES mitglieder(id),
  FOREIGN KEY (zugewiesen_von) REFERENCES mitglieder(id)
);

CREATE TABLE task_comments (
  id VARCHAR(36) PRIMARY KEY,
  task_id VARCHAR(36) NOT NULL,
  autor_id VARCHAR(36) NOT NULL,
  text TEXT NOT NULL,
  erwaehnte_personen JSON,
  erstellt_am TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (autor_id) REFERENCES mitglieder(id),
  INDEX idx_task_comments (task_id, erstellt_am)
);

CREATE TABLE task_audit_log (
  id VARCHAR(36) PRIMARY KEY,
  task_id VARCHAR(36) NOT NULL,
  aktion VARCHAR(50) NOT NULL,
  ausgefuehrt_von VARCHAR(36) NOT NULL,
  ausgefuehrt_von_user_id VARCHAR(36),
  ausgefuehrt_am TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  alte_werte JSON,
  neue_werte JSON,
  ip_adresse VARCHAR(45),
  user_agent TEXT,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (ausgefuehrt_von) REFERENCES mitglieder(id),
  FOREIGN KEY (ausgefuehrt_von_user_id) REFERENCES users(id),
  INDEX idx_task_audit (task_id, ausgefuehrt_am)
);


CREATE TABLE documents (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category ENUM('satzung', 'protokolle', 'formulare', 'richtlinien', 'guides') NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_size INT UNSIGNED NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  version VARCHAR(20) NOT NULL,
  status ENUM('current', 'outdated', 'draft') DEFAULT 'current',
  published_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NULL,
  author VARCHAR(100),
  downloads INT UNSIGNED DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  google_drive_file_id VARCHAR(255) UNIQUE,
  is_public BOOLEAN DEFAULT FALSE,
  created_by VARCHAR(36),
  document_type ENUM('document', 'image', 'spreadsheet', 'form', 'other') DEFAULT 'document',
  folder_path VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  deleted_by VARCHAR(36),
  FOREIGN KEY (created_by) REFERENCES mitglieder(id),
  FOREIGN KEY (deleted_by) REFERENCES users(id),
  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_featured (is_featured),
  INDEX idx_google_drive_id (google_drive_file_id),
  INDEX idx_document_type (document_type),
  INDEX idx_folder_path (folder_path),
  INDEX idx_deleted (deleted_at)
);

CREATE TABLE document_tags (
  document_id VARCHAR(36) NOT NULL,
  tag VARCHAR(50) NOT NULL,
  PRIMARY KEY (document_id, tag),
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  INDEX idx_tag (tag)
);


CREATE TABLE creators (
  id VARCHAR(36) PRIMARY KEY,
  member_id VARCHAR(36) NOT NULL,
  artist_name VARCHAR(100) NOT NULL,
  real_name VARCHAR(100),
  profile_image VARCHAR(500),
  description TEXT NOT NULL,
  portfolio VARCHAR(500) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  active_since DATE NOT NULL,
  deactivated_at DATE,
  instagram VARCHAR(100),
  twitter VARCHAR(100),
  facebook VARCHAR(100),
  youtube VARCHAR(100),
  tiktok VARCHAR(100),
  website VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES mitglieder(id),
  INDEX idx_active (is_active),
  INDEX idx_member (member_id)
);

CREATE TABLE creators_extended (
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

CREATE TABLE creator_types (
  creator_id VARCHAR(36) NOT NULL,
  type ENUM('grafik', 'foto', 'video', 'musik', 'other') NOT NULL,
  PRIMARY KEY (creator_id, type),
  FOREIGN KEY (creator_id) REFERENCES creators(id) ON DELETE CASCADE
);

CREATE TABLE creator_works (
  id VARCHAR(36) PRIMARY KEY,
  creator_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('image', 'video', 'audio', 'text') NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  is_public BOOLEAN DEFAULT FALSE,
  order_position INT DEFAULT 0,
  views INT UNSIGNED DEFAULT 0,
  likes INT UNSIGNED DEFAULT 0,
  FOREIGN KEY (creator_id) REFERENCES creators(id) ON DELETE CASCADE,
  INDEX idx_creator (creator_id),
  INDEX idx_public (is_public),
  INDEX idx_type (type)
);


CREATE TABLE kommentare (
  id VARCHAR(36) PRIMARY KEY,
  text TEXT NOT NULL,
  event_id VARCHAR(36),
  aufgabe_id VARCHAR(36),
  dokument_id VARCHAR(36),
  autor_id VARCHAR(36) NOT NULL,
  erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  erwaehnte_personen_ids JSON,
  ist_intern BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (aufgabe_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (dokument_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (autor_id) REFERENCES mitglieder(id),
  INDEX idx_event (event_id),
  INDEX idx_aufgabe (aufgabe_id),
  INDEX idx_autor (autor_id),
  INDEX idx_erstellt (erstellt_am)
);

CREATE TABLE benachrichtigungen (
  id VARCHAR(36) PRIMARY KEY,
  empfaenger_id VARCHAR(36) NOT NULL,
  typ ENUM('EVENT_ANMELDUNG', 'AUFGABE_ZUGEWIESEN', 'EVENT_REMINDER', 'KOMMENTAR_ERWAEHNUNG', 'EVENT_ABGESAGT', 'SYSTEM') NOT NULL,
  titel VARCHAR(255) NOT NULL,
  nachricht TEXT NOT NULL,
  kontext_typ VARCHAR(50),
  kontext_id VARCHAR(36),
  gelesen BOOLEAN DEFAULT FALSE,
  gelesen_am TIMESTAMP NULL,
  versendet_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  prioritaet ENUM('niedrig', 'mittel', 'hoch', 'kritisch') DEFAULT 'mittel',
  FOREIGN KEY (empfaenger_id) REFERENCES mitglieder(id) ON DELETE CASCADE,
  INDEX idx_empfaenger_unread (empfaenger_id, gelesen, versendet_am),
  INDEX idx_gelesen (gelesen),
  INDEX idx_versendet (versendet_am)
);

CREATE TABLE email_vorlagen (
  id VARCHAR(36) PRIMARY KEY,
  titel VARCHAR(255) NOT NULL,
  betreff VARCHAR(255) NOT NULL,
  inhalt TEXT NOT NULL,
  kategorie ENUM('MITGLIEDSCHAFT', 'EVENT', 'AUFGABE', 'NEWSLETTER', 'FINANZEN', 'SONSTIGES') NOT NULL,
  platzhalter JSON,
  ist_aktiv BOOLEAN DEFAULT TRUE,
  erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  aktualisiert_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_kategorie (kategorie),
  INDEX idx_aktiv (ist_aktiv)
);

CREATE TABLE social_media_posts (
  id VARCHAR(36) PRIMARY KEY,
  inhalt TEXT NOT NULL,
  plattform JSON NOT NULL,
  event_id VARCHAR(36),
  post_datum TIMESTAMP,
  status ENUM('ENTWURF', 'GEPLANT', 'VEROEFFENTLICHT', 'ARCHIVIERT') DEFAULT 'ENTWURF',
  erstellt_von VARCHAR(36) NOT NULL,
  erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_von VARCHAR(36),
  approved_am TIMESTAMP NULL,
  hashtags JSON,
  medien_urls JSON,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
  FOREIGN KEY (erstellt_von) REFERENCES mitglieder(id),
  FOREIGN KEY (approved_von) REFERENCES mitglieder(id),
  INDEX idx_status (status),
  INDEX idx_post_datum (post_datum)
);

CREATE TABLE newsletters (
  id VARCHAR(36) PRIMARY KEY,
  edition INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  published_at TIMESTAMP NOT NULL,
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  header_image VARCHAR(500),
  introduction TEXT NOT NULL,
  closing_message TEXT,
  next_edition_hint TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_edition (edition),
  INDEX idx_published (published_at)
);

CREATE TABLE newsletter_subscriptions (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  accepts_marketing BOOLEAN DEFAULT TRUE,
  confirmed_at TIMESTAMP NULL,
  unsubscribed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_confirmed (confirmed_at)
);


CREATE TABLE gremien (
  id VARCHAR(36) PRIMARY KEY,
  type ENUM('vorstand', 'beirat', 'team_event', 'team_medien', 'team_technik', 'team_verein', 'kassenpruefung') NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  header_image VARCHAR(500),
  gradient VARCHAR(100) NOT NULL,
  meeting_schedule VARCHAR(255),
  contact_email VARCHAR(255),
  established_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type)
);

CREATE TABLE gremium_members (
  id VARCHAR(36) PRIMARY KEY,
  gremium_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(100) NOT NULL,
  image VARCHAR(500),
  description TEXT,
  member_since DATE NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  order_position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (gremium_id) REFERENCES gremien(id) ON DELETE CASCADE,
  INDEX idx_gremium (gremium_id)
);

CREATE TABLE protokolle (
  id VARCHAR(36) PRIMARY KEY,
  bereich_id VARCHAR(100) NOT NULL,
  datum DATE NOT NULL,
  titel VARCHAR(255) NOT NULL,
  typ ENUM('VORSTANDSSITZUNG', 'BEIRATSSITZUNG', 'TEAM_MEETING', 'MITGLIEDERVERSAMMLUNG', 'SONSTIGES') NOT NULL,
  teilnehmer_ids JSON,
  protokollant_id VARCHAR(36) NOT NULL,
  sitzungsleiter_id VARCHAR(36) NOT NULL,
  status ENUM('ENTWURF', 'FERTIG', 'GENEHMIGT') DEFAULT 'ENTWURF',
  inhalt TEXT,
  genehmigt_am TIMESTAMP NULL,
  genehmigt_von VARCHAR(36),
  erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  aktualisiert_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (protokollant_id) REFERENCES mitglieder(id),
  FOREIGN KEY (sitzungsleiter_id) REFERENCES mitglieder(id),
  FOREIGN KEY (genehmigt_von) REFERENCES mitglieder(id),
  INDEX idx_datum (datum),
  INDEX idx_status (status),
  INDEX idx_bereich (bereich_id)
);

CREATE TABLE tagesordnungspunkte (
  id VARCHAR(36) PRIMARY KEY,
  protokoll_id VARCHAR(36),
  titel VARCHAR(255) NOT NULL,
  beschreibung TEXT,
  prioritaet ENUM('NIEDRIG', 'MITTEL', 'HOCH', 'KRITISCH') DEFAULT 'MITTEL',
  eingereicht_von VARCHAR(36) NOT NULL,
  eingereicht_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  bereich_id VARCHAR(100) NOT NULL,
  ergebnis TEXT,
  massnahmen JSON,
  erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  aktualisiert_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (protokoll_id) REFERENCES protokolle(id) ON DELETE CASCADE,
  FOREIGN KEY (eingereicht_von) REFERENCES mitglieder(id),
  INDEX idx_protokoll (protokoll_id),
  INDEX idx_prioritaet (prioritaet)
);

CREATE TABLE faqs (
  id VARCHAR(36) PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category ENUM('mitgliedschaft', 'events', 'verein', 'technik', 'sonstige') NOT NULL,
  order_position INT NOT NULL DEFAULT 0,
  views INT UNSIGNED DEFAULT 0,
  is_popular BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_popular (is_popular),
  INDEX idx_order (order_position)
);


CREATE TABLE ausgaben (
  id VARCHAR(36) PRIMARY KEY,
  event_id VARCHAR(36),
  beschreibung VARCHAR(255) NOT NULL,
  betrag DECIMAL(10, 2) NOT NULL,
  kategorie ENUM('verpflegung', 'transport', 'material', 'unterkunft', 'sonstiges') NOT NULL,
  beleg_url VARCHAR(500),
  rechnungsnummer VARCHAR(100),
  status ENUM('eingereicht', 'genehmigt', 'abgelehnt', 'erstattet') DEFAULT 'eingereicht',
  eingereicht_von VARCHAR(36) NOT NULL,
  eingereicht_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  genehmigt_von VARCHAR(36),
  genehmigt_am TIMESTAMP NULL,
  ablehnungsgrund TEXT,
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (eingereicht_von) REFERENCES mitglieder(id),
  FOREIGN KEY (genehmigt_von) REFERENCES mitglieder(id),
  INDEX idx_event (event_id),
  INDEX idx_status (status),
  INDEX idx_eingereicht (eingereicht_am)
);


CREATE TABLE refresh_tokens (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP NULL,
  revoked_by VARCHAR(36) NULL,
  device_info VARCHAR(255),
  ip_address VARCHAR(45),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (revoked_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_token (token),
  INDEX idx_user (user_id),
  INDEX idx_expires (expires_at),
  INDEX idx_revoked (revoked_at),
  INDEX idx_cleanup (expires_at, revoked_at)
);

CREATE TABLE password_history (
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


CREATE TABLE upload_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size INT UNSIGNED NOT NULL,
  upload_type ENUM('document', 'image', 'event_photo', 'profile_image') NOT NULL,
  google_drive_file_id VARCHAR(255),
  folder_id VARCHAR(255) NOT NULL,
  status ENUM('success', 'failed') NOT NULL,
  error_message TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  FOREIGN KEY (user_id) REFERENCES mitglieder(id),
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_uploaded_at (uploaded_at),
  INDEX idx_upload_type (upload_type)
);

CREATE TABLE field_access_log (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(36) NOT NULL,
  field_name VARCHAR(100) NOT NULL,
  action ENUM('view', 'export') NOT NULL,
  accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user (user_id),
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_time (accessed_at)
);


CREATE TABLE approval_requests (
  id VARCHAR(36) PRIMARY KEY,
  request_type ENUM('member_edit', 'role_assignment', 'event_creation', 'finance_expense') NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id VARCHAR(36) NOT NULL,
  requested_by VARCHAR(36) NOT NULL,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
  old_data JSON,
  new_data JSON,
  changes_summary TEXT,
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  due_date DATETIME,
  applied_at TIMESTAMP NULL,
  FOREIGN KEY (requested_by) REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_resource (resource_type, resource_id),
  INDEX idx_requested_by (requested_by)
);

CREATE TABLE approval_actions (
  id VARCHAR(36) PRIMARY KEY,
  request_id VARCHAR(36) NOT NULL,
  action ENUM('approved', 'rejected', 'commented') NOT NULL,
  performed_by VARCHAR(36) NOT NULL,
  performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  comment TEXT,
  FOREIGN KEY (request_id) REFERENCES approval_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (performed_by) REFERENCES users(id),
  INDEX idx_request (request_id)
);

CREATE TABLE approval_rules (
  id VARCHAR(36) PRIMARY KEY,
  resource_type VARCHAR(50) NOT NULL,
  action VARCHAR(50),
  required_role_id VARCHAR(36) NOT NULL,
  min_approvers INT DEFAULT 1,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (required_role_id) REFERENCES roles(id),
  INDEX idx_resource_action (resource_type, action)
);

CREATE TABLE approval_notifications (
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


CREATE TABLE sensitive_fields (
  id VARCHAR(36) PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  field_name VARCHAR(100) NOT NULL,
  sensitivity_level ENUM('low', 'medium', 'high', 'critical') NOT NULL,
  required_permission VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_field (entity_type, field_name)
);

CREATE TABLE member_visibility_overrides (
  member_id VARCHAR(36) NOT NULL,
  field_name VARCHAR(100) NOT NULL,
  visibility_level ENUM('private', 'team', 'members', 'public') NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (member_id, field_name),
  FOREIGN KEY (member_id) REFERENCES mitglieder(id) ON DELETE CASCADE
);


CREATE VIEW v_mitglieder_full AS
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

CREATE VIEW v_active_members AS
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

CREATE VIEW v_tasks_with_assignees AS
SELECT
  t.*,
  GROUP_CONCAT(
    DISTINCT CONCAT(m.vorname, ' ', m.nachname)
    ORDER BY ta.zugewiesen_am SEPARATOR ', '
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

CREATE VIEW v_user_permissions AS
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
    OR ur.gueltig_bis > NOW()
  )
UNION
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
    OR ur.gueltig_bis > NOW()
  );


DELIMITER $$

CREATE PROCEDURE create_mitglied_with_user(
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

  SET v_user_id = CONCAT('usr_', UUID());

  INSERT INTO users (
    id, email, vorname, nachname, mitgliedsnummer,
    auth_source, easyverein_id, ist_aktiv
  ) VALUES (
    v_user_id, p_email, p_vorname, p_nachname, p_mitgliedsnummer,
    p_auth_source, p_easyverein_id, TRUE
  );

  INSERT INTO mitglieder (
    id, user_id, vorname, nachname, email, telefon,
    easyverein_id, mitglied_seit, ist_aktiv
  ) VALUES (
    CONCAT('mbr_', UUID()), v_user_id, p_vorname, p_nachname,
    p_email, p_telefon, p_easyverein_id, p_mitglied_seit, TRUE
  );

  INSERT INTO user_roles (user_id, role_id, zugewiesen_von)
  VALUES (v_user_id, 'role_mitglied', v_user_id);

  COMMIT;

  SELECT v_user_id as user_id;
END$$

CREATE PROCEDURE cleanup_expired_tokens()
BEGIN
  DELETE FROM refresh_tokens
  WHERE expires_at < NOW()
  OR (revoked_at IS NOT NULL AND revoked_at < DATE_SUB(NOW(), INTERVAL 30 DAY));
END$$

DELIMITER ;


CREATE EVENT IF NOT EXISTS refresh_token_cleanup
ON SCHEDULE EVERY 1 DAY
STARTS (DATE(NOW()) + INTERVAL 1 DAY + INTERVAL 3 HOUR)
DO CALL cleanup_expired_tokens();


INSERT INTO settings (id) VALUES ('global-settings');