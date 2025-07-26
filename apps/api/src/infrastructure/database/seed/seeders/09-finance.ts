import { Pool } from "mysql2/promise";
import { randomElement, generateId, randomInt } from "../helpers/generators";

// apps/api/src/infrastructure/database/seed/seeders/09-finance.ts
export async function seedFinance(pool: Pool, userData: any, eventData: any) {
  console.log("\n💰 Seeding finance data...");

  let expenseCount = 0;
  for (const eventId of eventData.eventIds.slice(0, 5)) {
    const expensesPerEvent = randomInt(1, 4);

    for (let i = 0; i < expensesPerEvent; i++) {
      const status = randomElement(["eingereicht", "genehmigt", "erstattet"]);

      await pool.execute(
        `INSERT INTO ausgaben (
          id, event_id, beschreibung, betrag, kategorie, status,
          eingereicht_von, genehmigt_von, genehmigt_am
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          generateId(),
          eventId,
          randomElement([
            "Bustickets",
            "Verpflegung",
            "Materialien",
            "Raummiete",
          ]),
          randomInt(50, 500),
          randomElement(["verpflegung", "transport", "material", "sonstiges"]),
          status,
          randomElement(userData.allMemberIds),
          status !== "eingereicht" ? userData.vorstandMemberIds[0] : null,
          status !== "eingereicht" ? new Date() : null,
        ],
      );
      expenseCount++;
    }
  }

  console.log(`  ✓ ${expenseCount} Expenses`);
}
