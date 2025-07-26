// apps/api/src/infrastructure/database/seed/seeders/05-tasks.ts
import { Pool } from "mysql2/promise";
import { randomElement, generateId, randomInt, randomDate } from "../helpers/generators";

export async function seedTasks(pool: Pool, userData: any, eventData: any) {
  console.log("\n✅ Seeding tasks...");

  let taskCount = 0;
  for (const eventId of eventData.eventIds.slice(0, 5)) {
    const tasksPerEvent = randomInt(3, 8);

    for (let i = 0; i < tasksPerEvent; i++) {
      const taskId = generateId();
      const responsible = randomElement(userData.allMemberIds);

      await pool.execute(
        `INSERT INTO tasks (
          id, titel, beschreibung, context_type, context_id,
          verantwortlich_id, status, prioritaet, frist, erstellt_von
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          taskId,
          randomElement([
            "Flyer erstellen",
            "Location buchen",
            "Catering organisieren",
          ]),
          "Detaillierte Beschreibung der Aufgabe",
          "event",
          eventId,
          responsible,
          randomElement(["offen", "in_bearbeitung", "erledigt"]),
          randomElement(["niedrig", "mittel", "hoch"]),
          randomDate(new Date(), new Date(2025, 11, 31)),
          responsible,
        ],
      );

      // Add assignments
      const assignees = randomInt(1, 3);
      for (let a = 0; a < assignees; a++) {
        await pool.execute(
          `INSERT INTO task_assignments (task_id, mitglied_id, zugewiesen_von)
           VALUES (?, ?, ?)`,
          [taskId, randomElement(userData.allMemberIds), responsible],
        );
      }

      taskCount++;
    }
  }

  console.log(`  ✓ ${taskCount} Tasks with assignments`);
  return { taskCount };
}
