// seed/seeders/20-seedGremien.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { generateId } from '../helpers/index.js';

const seedGremien = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    const gremien = [
      {
        id: generateId('grm'),
        type: 'vorstand',
        name: 'Vorstand',
        description: 'Der geschäftsführende Vorstand leitet den Verein und vertritt ihn nach außen.',
        short_description: 'Vereinsleitung und Vertretung',
        gradient: 'bg-gradient-to-r from-blue-600 to-blue-800',
        meeting_schedule: 'Jeden ersten Montag im Monat, 19:00 Uhr',
        contact_email: 'vorstand@faninitiative-spandau.de',
        established_date: new Date('2025-01-15')
      },
      {
        id: generateId('grm'),
        type: 'beirat',
        name: 'Beirat',
        description: 'Der Beirat unterstützt den Vorstand bei strategischen Entscheidungen.',
        short_description: 'Beratung und Unterstützung',
        gradient: 'bg-gradient-to-r from-green-600 to-green-800',
        meeting_schedule: 'Monatlich nach Bedarf',
        contact_email: 'beirat@faninitiative-spandau.de',
        established_date: new Date('2025-01-15')
      },
      {
        id: generateId('grm'),
        type: 'team_event',
        name: 'Team Event',
        description: 'Organisation und Durchführung aller Vereinsveranstaltungen.',
        short_description: 'Eventplanung und -durchführung',
        gradient: 'bg-gradient-to-r from-purple-600 to-purple-800',
        meeting_schedule: 'Wöchentlich vor Events',
        contact_email: 'events@faninitiative-spandau.de',
        established_date: new Date('2025-02-01')
      },
      {
        id: generateId('grm'),
        type: 'team_medien',
        name: 'Team Medien',
        description: 'Social Media, Content Creation und Öffentlichkeitsarbeit.',
        short_description: 'Medien und Kommunikation',
        gradient: 'bg-gradient-to-r from-pink-600 to-pink-800',
        meeting_schedule: 'Jeden Mittwoch, 18:00 Uhr',
        contact_email: 'medien@faninitiative-spandau.de',
        established_date: new Date('2025-02-01')
      }
    ];

    // Insert Gremien
    for (const gremium of gremien) {
      const gremiumId = await connection.execute(
        `INSERT INTO gremien
         (id, type, name, description, short_description, gradient,
          meeting_schedule, contact_email, established_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [gremium.id, gremium.type, gremium.name, gremium.description,
         gremium.short_description, gremium.gradient, gremium.meeting_schedule,
         gremium.contact_email, gremium.established_date]
      );

      // Add members to gremien
      if (gremium.type === 'vorstand') {
        await connection.execute(
          `INSERT INTO gremium_members
           (id, gremium_id, name, role, member_since, email)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [generateId('gmb'), gremium.id, 'Thomas Müller', '1. Vorsitzender',
           new Date('2025-01-15'), 'vorstand1@faninitiative-spandau.de']
        );
        await connection.execute(
          `INSERT INTO gremium_members
           (id, gremium_id, name, role, member_since, email)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [generateId('gmb'), gremium.id, 'Sandra Schmidt', '2. Vorsitzende',
           new Date('2025-01-15'), 'vorstand2@faninitiative-spandau.de']
        );
      }
    }

    await connection.commit();
    console.log('✅ Gremien seeded successfully');
  } catch (error) {
    await connection.rollback();
    console.error('❌ Gremien seeding failed:', error);
    throw error;
  }
};

export default seedGremien;
