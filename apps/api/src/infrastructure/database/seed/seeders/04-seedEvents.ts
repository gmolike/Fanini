// seed/seeders/04-seedEvents.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { generateEvents } from '../generators/eventGenerator';
import { DEFAULT_SEED_CONFIG } from '../types';

export const seedEvents = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    const events = generateEvents(
      DEFAULT_SEED_CONFIG.minEvents,
      DEFAULT_SEED_CONFIG.publicEventRatio
    );

    for (const event of events) {
      await connection.execute(
        `INSERT INTO events (
          id, titel, beschreibung, kurzbeschreibung, datum, uhrzeit,
          dauer, ort, typ, sportbereich, status, ist_oeffentlich,
          ist_vertraulich, verantwortlich_id, stellvertreter_ids,
          budget, budget_verbraucht, max_teilnehmer, anmeldeschluss,
          erstellt_am, erstellt_von
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event.id, event.titel, event.beschreibung, event.kurzbeschreibung,
          event.datum, event.uhrzeit, event.dauer, event.ort, event.typ,
          event.sportbereich, event.status, event.ist_oeffentlich,
          event.ist_vertraulich, event.verantwortlich_id,
          event.stellvertreter_ids, event.budget, event.budget_verbraucht,
          event.max_teilnehmer, event.anmeldeschluss, event.erstellt_am,
          event.erstellt_von
        ]
      );
    }

    await connection.commit();
    console.log(`✅ ${events.length} Events seeded successfully`);
  } catch (error) {
    await connection.rollback();
    console.error('❌ Events seeding failed:', error);
    throw error;
  }
};
