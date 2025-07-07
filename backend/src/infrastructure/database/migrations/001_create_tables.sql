CREATE DATABASE IF NOT EXISTS fanini_db CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci;

USE fanini_db;

CREATE TABLE
  IF NOT EXISTS mitglieder (
    id VARCHAR(36) PRIMARY KEY,
    easyverein_id VARCHAR(255) UNIQUE,
    vorname VARCHAR(100) NOT NULL,
    nachname VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefon VARCHAR(50),
    ist_aktiv BOOLEAN DEFAULT TRUE,
    hat_vertraulichkeitserklaerung BOOLEAN DEFAULT FALSE,
    mitglied_seit DATE NOT NULL,
    austritts_datum DATE,
    profilbild VARCHAR(500),
    beschreibung TEXT,
    sichtbarkeit_email ENUM ('oeffentlich', 'intern', 'vorstand', 'privat') DEFAULT 'intern',
    sichtbarkeit_telefon ENUM ('oeffentlich', 'intern', 'vorstand', 'privat') DEFAULT 'privat',
    sichtbarkeit_profil ENUM ('oeffentlich', 'intern', 'vorstand', 'privat') DEFAULT 'intern',
    erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    aktualisiert_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    letzter_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_aktiv (ist_aktiv)
  );

CREATE TABLE
  IF NOT EXISTS events (
    id VARCHAR(36) PRIMARY KEY,
    titel VARCHAR(255) NOT NULL,
    beschreibung TEXT NOT NULL,
    kurzbeschreibung VARCHAR(500),
    datum DATE NOT NULL,
    uhrzeit TIME NOT NULL,
    dauer_minuten INT,
    ort JSON NOT NULL,
    typ ENUM (
      'vereinstreffen',
      'sportveranstaltung',
      'fanfahrt',
      'social',
      'sitzung',
      'workshop',
      'turnier',
      'sonstiges'
    ) NOT NULL,
    sportbereich ENUM (
      'league_of_legends',
      'valorant',
      'fussball',
      'esports_allgemein',
      'sonstiges'
    ),
    status ENUM (
      'entwurf',
      'geplant',
      'genehmigt',
      'aktiv',
      'abgeschlossen',
      'abgesagt'
    ) DEFAULT 'entwurf',
    ist_oeffentlich BOOLEAN DEFAULT FALSE,
    ist_vertraulich BOOLEAN DEFAULT FALSE,
    verantwortlich_id VARCHAR(36) NOT NULL,
    budget DECIMAL(10, 2),
    budget_verbraucht DECIMAL(10, 2) DEFAULT 0,
    max_teilnehmer INT,
    anmeldeschluss DATETIME,
    erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    erstellt_von VARCHAR(36) NOT NULL,
    genehmigt_am TIMESTAMP NULL,
    genehmigt_von VARCHAR(36),
    FOREIGN KEY (verantwortlich_id) REFERENCES mitglieder (id),
    FOREIGN KEY (erstellt_von) REFERENCES mitglieder (id),
    INDEX idx_datum (datum),
    INDEX idx_status (status)
  );
