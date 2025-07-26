// seed/seeders/05-seedTasks.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { generateId, dateHelpers } from '../helpers';

const TASK_TEMPLATES = [
  { titel: 'Busfahrt organisieren', kategorie: 'transport', prioritaet: 'HOCH' },
  { titel: 'Verpflegung bestellen', kategorie: 'verpflegung', prioritaet: 'MITTEL' },
  { titel: 'Fahnen vorbereiten', kategorie: 'material', prioritaet: 'MITTEL' },
  { titel: 'Trommeln mitbringen', kategorie: 'material', prioritaet: 'NIEDRIG' },
  { titel: 'Anmeldungen verwalten', kategorie: 'organisation', prioritaet: 'HOCH' },
  { titel: 'Social Media Ankündigung', kategorie: 'marketing', prioritaet: 'MITTEL' },
  { titel: 'Fotograf organisieren', kategorie: 'medien', prioritaet: 'NIEDRIG' },
  { titel: 'Technik-Check durchführen', kategorie: 'technik', prioritaet: 'HOCH' }
];

export const seedTasks = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    // Get all events
    const [events] = await connection.execute('SELECT id, datum FROM events');

    const tasks = [];
    for (const event of events as any[]) {
      // 2-5 Tasks pro Event
      const taskCount = Math.floor(Math.random() * 4) + 2;

      for (let i = 0; i < taskCount; i++) {
        const template = TASK_TEMPLATES[i % TASK_TEMPLATES.length];
        const status = ['OFFEN', 'IN_BEARBEITUNG', 'ERLEDIGT'][Math.floor(Math.random() * 3)];

        tasks.push({
          id: generateId('tsk'),
          titel: template.titel,
          beschreibung: `${template.titel} für das Event`,
          event_id: event.id,
          status,
          prioritaet: template.prioritaet,
          kategorie: template.kategorie,
          frist: new Date(event.datum.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 Tage vor Event
          erstellt_am: dateHelpers.withinLastWeek(),
          ist_standardaufgabe: i < 2 // Erste 2 sind Standard
        });
      }
    }

    // Bulk insert
    for (const task of tasks) {
      await connection.execute(
        `INSERT INTO aufgaben (
          id, titel, beschreibung, event_id, status, prioritaet,
          kategorie, frist, erstellt_am, ist_standardaufgabe
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          task.id, task.titel, task.beschreibung, task.event_id,
          task.status, task.prioritaet, task.kategorie, task.frist,
          task.erstellt_am, task.ist_standardaufgabe
        ]
      );
    }

    await connection.commit();
    console.log(`✅ ${tasks.length} Tasks seeded successfully`);
  } catch (error) {
    await connection.rollback();
    console.error('❌ Tasks seeding failed:', error);
    throw error;
  }
};
