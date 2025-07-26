// seed/seeders/05-seedTasks.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { generateId, dateHelpers } from '../helpers/index.js';

const TASK_TEMPLATES = [
  { titel: 'Busfahrt organisieren', kategorie: 'transport', prioritaet: 'hoch' },
  { titel: 'Verpflegung bestellen', kategorie: 'verpflegung', prioritaet: 'mittel' },
  { titel: 'Fahnen vorbereiten', kategorie: 'material', prioritaet: 'mittel' },
  { titel: 'Trommeln mitbringen', kategorie: 'material', prioritaet: 'niedrig' },
  { titel: 'Anmeldungen verwalten', kategorie: 'organisation', prioritaet: 'hoch' },
  { titel: 'Social Media Ankündigung', kategorie: 'marketing', prioritaet: 'mittel' },
  { titel: 'Fotograf organisieren', kategorie: 'medien', prioritaet: 'niedrig' },
  { titel: 'Technik-Check durchführen', kategorie: 'technik', prioritaet: 'hoch' }
];

const seedTasks = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    const [events] = await connection.execute('SELECT id, datum FROM events');
    const [members] = await connection.execute('SELECT id FROM mitglieder WHERE ist_aktiv = 1 LIMIT 10');
    const memberIds = (members as any[]).map(m => m.id);

    const tasks = [];
    for (const event of events as any[]) {
      const taskCount = Math.floor(Math.random() * 4) + 2;

      for (let i = 0; i < taskCount; i++) {
        const template = TASK_TEMPLATES[i % TASK_TEMPLATES.length];
        const status = ['offen', 'in_bearbeitung', 'erledigt'][Math.floor(Math.random() * 3)];

        tasks.push({
          id: generateId('tsk'),
          titel: template.titel,
          beschreibung: `${template.titel} für das Event`,
          context_type: 'event',
          context_id: event.id,
          verantwortlich_id: memberIds[Math.floor(Math.random() * memberIds.length)],
          status,
          prioritaet: template.prioritaet,
          kategorie: template.kategorie,
          frist: new Date(event.datum.getTime() - 3 * 24 * 60 * 60 * 1000),
          erstellt_von: memberIds[0],
          ist_standardaufgabe: i < 2
        });
      }
    }

    // Insert in TASKS table!
    for (const task of tasks) {
      await connection.execute(
        `INSERT INTO tasks (
          id, titel, beschreibung, context_type, context_id,
          verantwortlich_id, status, prioritaet, kategorie, frist,
          erstellt_von, ist_standardaufgabe
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          task.id, task.titel, task.beschreibung, task.context_type,
          task.context_id, task.verantwortlich_id, task.status,
          task.prioritaet, task.kategorie, task.frist,
          task.erstellt_von, task.ist_standardaufgabe
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

export default seedTasks;
