// seed/seeders/07-seedComments.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { generateId, randomElement, dateHelpers } from '../helpers';

const COMMENT_TEMPLATES = [
  'Super organisiert! Freue mich schon drauf.',
  'Wer fährt noch mit dem Auto? Hätte noch 2 Plätze frei.',
  'Kann jemand Trommeln mitbringen?',
  'Wird es wieder Fanschals geben?',
  'Letzte Auswärtsfahrt war der Hammer! 💙',
  'Bitte denkt an warme Kleidung, wird kalt.',
  'Treffen wir uns vorher am Vereinsheim?',
  'Ich bringe Fahnen mit!',
  'Können wir diesmal früher losfahren?',
  'Top Event, bin dabei! 👍'
];

export const seedComments = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    // Get events and members
    const [events] = await connection.execute('SELECT id FROM events LIMIT 20');
    const [members] = await connection.execute('SELECT id FROM mitglieder WHERE ist_aktiv = 1');
    const [tasks] = await connection.execute('SELECT id FROM aufgaben LIMIT 30');

    const memberIds = (members as any[]).map(m => m.id);
    const comments = [];

    // Comments on events
    for (const event of events as any[]) {
      const commentCount = Math.floor(Math.random() * 5) + 1;

      for (let i = 0; i < commentCount; i++) {
        comments.push({
          id: generateId('cmt'),
          text: randomElement(COMMENT_TEMPLATES),
          event_id: event.id,
          aufgabe_id: null,
          autor_id: randomElement(memberIds),
          erstellt_am: dateHelpers.withinLastWeek(),
          ist_intern: Math.random() > 0.7
        });
      }
    }

    // Comments on tasks
    for (const task of (tasks as any[]).slice(0, 15)) {
      comments.push({
        id: generateId('cmt'),
        text: 'Ich übernehme das!',
        event_id: null,
        aufgabe_id: task.id,
        autor_id: randomElement(memberIds),
        erstellt_am: dateHelpers.withinLastWeek(),
        ist_intern: true
      });
    }

    // Insert comments
    for (const comment of comments) {
      await connection.execute(
        `INSERT INTO kommentare (
          id, text, event_id, aufgabe_id, autor_id,
          erstellt_am, ist_intern
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          comment.id,
          comment.text,
          comment.event_id,
          comment.aufgabe_id,
          comment.autor_id,
          comment.erstellt_am,
          comment.ist_intern
        ]
      );
    }

    await connection.commit();
    console.log(`✅ ${comments.length} Comments seeded successfully`);
  } catch (error) {
    await connection.rollback();
    console.error('❌ Comments seeding failed:', error);
    throw error;
  }
};

export default seedComments;
