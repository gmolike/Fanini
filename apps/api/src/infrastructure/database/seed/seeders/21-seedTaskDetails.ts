// seed/seeders/21-seedTaskDetails.ts
import { Connection, PoolConnection } from "mysql2/promise";
import { generateId, dateHelpers } from "../helpers/index.js";

const seedTaskDetails = async (
  connection: Connection | PoolConnection,
): Promise<void> => {
  try {
    await connection.beginTransaction();

    // Get tasks with user information
    const [tasks] = (await connection.execute(
      `SELECT t.id, t.verantwortlich_id, t.erstellt_von, t.erstellt_von_user_id
       FROM tasks t LIMIT 20`,
    )) as [any[], any];

    const [members] = (await connection.execute(
      "SELECT id, user_id FROM mitglieder WHERE ist_aktiv = 1 LIMIT 10",
    )) as [any[], any];

    const taskData = tasks as any[];
    const memberData = members as any[];

    // Task Assignments OHNE zugewiesen_von_user_id (nicht in der DB)
    for (let i = 0; i < 30; i++) {
      const task = taskData[i % taskData.length];
      const assignee =
        memberData[Math.floor(Math.random() * memberData.length)];
      const assigner = memberData[0]; // Erster Member als Zuweiser

      try {
        await connection.execute(
          `INSERT INTO task_assignments
           (task_id, mitglied_id, zugewiesen_von, kommentar)
           VALUES (?, ?, ?, ?)`,
          [task.id, assignee.id, assigner.id, "Bitte bis zum Event erledigen"],
        );
      } catch (e) {
        // Ignore duplicates
      }
    }

    // Task Comments bleiben gleich
    const comments = [
      "Ich kümmere mich darum!",
      "Brauche noch Unterstützung bei der Umsetzung.",
      "Material ist bestellt.",
      "Kann das jemand übernehmen? Bin verhindert.",
      "Erledigt! ✅",
      "Warte noch auf Rückmeldung vom Lieferanten.",
      "Budget reicht nicht aus, brauchen 50€ mehr.",
      "Hat super geklappt beim letzten Mal!",
    ];

    for (let i = 0; i < 40; i++) {
      const author = memberData[Math.floor(Math.random() * memberData.length)];
      await connection.execute(
        `INSERT INTO task_comments
         (id, task_id, autor_id, text)
         VALUES (?, ?, ?, ?)`,
        [
          generateId("tcm"),
          taskData[i % taskData.length].id,
          author.id,
          comments[i % comments.length],
        ],
      );
    }

    // Task Audit Log OHNE ausgefuehrt_von_user_id (nicht in der DB)
    for (let i = 0; i < 15; i++) {
      const task = taskData[i % taskData.length];
      const actor = memberData[Math.floor(Math.random() * memberData.length)];

      await connection.execute(
        `INSERT INTO task_audit_log
         (id, task_id, aktion, ausgefuehrt_von, alte_werte, neue_werte)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          generateId("tal"),
          task.id,
          ["status_geaendert", "prioritaet_erhoeht", "zugewiesen"][i % 3],
          actor.id,
          JSON.stringify({ status: "offen" }),
          JSON.stringify({ status: "in_bearbeitung" }),
        ],
      );
    }

    await connection.commit();
    console.log("✅ Task details seeded successfully");
  } catch (error) {
    await connection.rollback();
    console.error("❌ Task details seeding failed:", error);
    throw error;
  }
};

export default seedTaskDetails;
