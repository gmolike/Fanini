-- =====================================
-- GLOBALE EINSTELLUNGEN
-- =====================================
CREATE TABLE
  IF NOT EXISTS settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT 'global-settings',
    -- Vereinsinformationen
    association_name VARCHAR(255) NOT NULL DEFAULT 'Faninitiative Spandau e.V.',
    founded_year INT NOT NULL DEFAULT 2025,
    passion_percentage INT NOT NULL DEFAULT 100,
    -- Kontaktdaten
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_address_street VARCHAR(255),
    contact_address_zip VARCHAR(10),
    contact_address_city VARCHAR(100),
    -- Branding
    primary_color VARCHAR(7) DEFAULT '#34687e',
    secondary_color VARCHAR(7) DEFAULT '#b94f46',
    accent_color VARCHAR(7) DEFAULT '#e8f0f4',
    logo_url VARCHAR(500),
    logo_alt VARCHAR(255),
    -- Feature Flags
    feature_events BOOLEAN DEFAULT TRUE,
    feature_members BOOLEAN DEFAULT TRUE,
    feature_gallery BOOLEAN DEFAULT TRUE,
    feature_newsletter BOOLEAN DEFAULT TRUE,
    feature_creators BOOLEAN DEFAULT TRUE,
    -- Metadaten
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Sicherstellen, dass nur eine Settings-Zeile existiert
    CONSTRAINT single_settings CHECK (id = 'global-settings')
  );

-- Initial Settings einfügen
INSERT INTO
  settings (
    id,
    association_name,
    founded_year,
    passion_percentage,
    contact_email,
    contact_phone,
    contact_address_street,
    contact_address_zip,
    contact_address_city,
    primary_color,
    secondary_color,
    accent_color,
    logo_url,
    logo_alt
  )
VALUES
  (
    'global-settings',
    'Faninitiative Spandau e.V.',
    2025,
    100,
    'info@fanini.live',
    '+49 30 12345678',
    'Vereinsstraße 1',
    '13587',
    'Berlin-Spandau',
    '#34687e',
    '#b94f46',
    '#e8f0f4',
    '/images/logo.svg',
    'Faninitiative Spandau e.V. Logo'
  ) ON DUPLICATE KEY
UPDATE updated_at = CURRENT_TIMESTAMP;
