// seed/seeders/06-seedEventParticipations.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { dateHelpers, generateId } from '../helpers';

export const seedEventParticipations = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    // Get all events and members
    const [events] = await connection.execute('SELECT id, max_teilnehmer, datum FROM events WHERE status != "ABGESAGT"');
    const [members] = await connection.execute('SELECT id FROM mitglieder WHERE ist_aktiv = 1');

    const memberIds = (members as any[]).map(m => m.id);
    const participations = [];

    for (const event of events as any[]) {
      // 30-80% der möglichen Teilnehmer
      const maxParticipants = event.max_teilnehmer || 30;
      const participantCount = Math.floor(maxParticipants * (0.3 + Math.random() * 0.5));

      // Shuffle members and take first N
      const shuffled = [...memberIds].sort(() => Math.random() - 0.5);
      const participants = shuffled.slice(0, Math.min(participantCount, memberIds.length));

      for (const memberId of participants) {
        const status = Math.random() > 0.1 ? 'ANGEMELDET' : 'ABGESAGT';

        participations.push({
          id: generateId('etp'),
          event_id: event.id,
          mitglied_id: memberId,
          angemeldet_am: dateHelpers.randomDate(
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            new Date()
          ),
          status,
          ist_bestaetigt: status === 'ANGEMELDET',
          kommentar: Math.random() > 0.8 ? 'Bringe noch 2 Freunde mit' : null
        });
      }
    }

    // Bulk insert
    for (const participation of participations) {
      await connection.execute(
        `INSERT INTO event_teilnahmen (
          id, event_id, mitglied_id, angemeldet_am, status,
          ist_bestaetigt, kommentar
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          participation.id,
          participation.event_id,
          participation.mitglied_id,
          participation.angemeldet_am,
          participation.status,
          participation.ist_bestaetigt,
          participation.kommentar
        ]
      );
    }

    await connection.commit();
    console.log(`✅ ${participations.length} Event participations seeded successfully`);
  } catch (error) {
    await connection.rollback();
    console.error('❌ Event participations seeding failed:', error);
    throw error;
  }
};

export default seedEventParticipations;
