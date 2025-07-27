// seed/seeders/21-seedTaskDetails.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { generateId, dateHelpers } from '../helpers/index.js';

const seedTaskDetails = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    // Get some tasks and members
    const [tasks] = await connection.execute(
      'SELECT id, verantwortlich_id, erstellt_von FROM tasks LIMIT 20'
    ) as [any[], any];
    const [members] = await connection.execute(
      'SELECT id FROM mitglieder WHERE ist_aktiv = 1 LIMIT 10'
    ) as [any[], any];

    const taskIds = tasks.map((t: any) => t.id);
    const memberIds = members.map((m: any) => m.id);

    // Task Assignments
    for (let i = 0; i < 30; i++) {
      const taskId = taskIds[i % taskIds.length];
      const memberId = memberIds[Math.floor(Math.random() * memberIds.length)];

      try {
        await connection.execute(
          `INSERT INTO task_assignments
           (task_id, mitglied_id, zugewiesen_von, kommentar)
           VALUES (?, ?, ?, ?)`,
          [taskId, memberId, (tasks as any[])[0].erstellt_von,
           'Bitte bis zum Event erledigen']
        );
      } catch (e) {
        // Ignore duplicates
      }
    }

    // Task Comments
    const comments = [
      'Ich kümmere mich darum!',
      'Brauche noch Unterstützung bei der Umsetzung.',
      'Material ist bestellt.',
      'Kann das jemand übernehmen? Bin verhindert.',
      'Erledigt! ✅',
      'Warte noch auf Rückmeldung vom Lieferanten.',
      'Budget reicht nicht aus, brauchen 50€ mehr.',
      'Hat super geklappt beim letzten Mal!'
    ];

    for (let i = 0; i < 40; i++) {
      await connection.execute(
        `INSERT INTO task_comments
         (id, task_id, autor_id, text)
         VALUES (?, ?, ?, ?)`,
        [
          generateId('tcm'),
          taskIds[i % taskIds.length],
          memberIds[Math.floor(Math.random() * memberIds.length)],
          comments[i % comments.length]
        ]
      );
    }

    // Task Audit Log
    for (let i = 0; i < 15; i++) {
      const task = (tasks as any[])[i % tasks.length];
      await connection.execute(
        `INSERT INTO task_audit_log
         (id, task_id, aktion, ausgefuehrt_von, alte_werte, neue_werte)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          generateId('tal'),
          task.id,
          ['status_geaendert', 'prioritaet_erhoeht', 'zugewiesen'][i % 3],
          task.erstellt_von,
          JSON.stringify({ status: 'offen' }),
          JSON.stringify({ status: 'in_bearbeitung' })
        ]
      );
    }

    await connection.commit();
    console.log('✅ Task details seeded successfully');
  } catch (error) {
    await connection.rollback();
    console.error('❌ Task details seeding failed:', error);
    throw error;
  }
};

export default seedTaskDetails;
