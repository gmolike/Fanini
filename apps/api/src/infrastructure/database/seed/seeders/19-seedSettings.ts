// seed/seeders/19-seedSettings.ts
import { Connection, PoolConnection } from 'mysql2/promise';

const seedSettings = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    await connection.execute(
      `INSERT INTO settings (
        id, association_name, founded_year, passion_percentage,
        contact_email, contact_phone, contact_address_street,
        contact_address_zip, contact_address_city,
        primary_color, secondary_color, accent_color,
        logo_url, logo_alt,
        feature_events, feature_members, feature_gallery,
        feature_newsletter, feature_creators
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'global-settings',
        'Faninitiative Spandau e.V.',
        2025,
        100,
        'info@faninitiative-spandau.de',
        '+49 30 12345678',
        'Neuendorfer Straße',
        '13585',
        'Berlin-Spandau',
        '#34687e',  // Spandau Blau
        '#b94f46',  // Spandau Rot
        '#e8f0f4',  // Hellblau
        'https://storage.example.com/logos/fanini-logo.svg',
        'Faninitiative Spandau Logo',
        true,  // Events aktiviert
        true,  // Mitglieder aktiviert
        true,  // Galerie aktiviert
        true,  // Newsletter aktiviert
        true   // Creator aktiviert
      ]
    );

    await connection.commit();
    console.log('✅ Settings seeded successfully');
  } catch (error) {
    await connection.rollback();
    console.error('❌ Settings seeding failed:', error);
    throw error;
  }
};

export default seedSettings;
