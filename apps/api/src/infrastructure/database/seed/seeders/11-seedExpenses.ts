// seed/seeders/11-seedExpenses.ts
import { Connection, PoolConnection } from "mysql2/promise";
import { generateId, randomElement, PREDEFINED_IDS } from "../helpers";

const EXPENSE_TEMPLATES = [
  {
    beschreibung: "Busmiete für Auswärtsfahrt",
    kategorie: "TRANSPORT",
    betrag: 850,
  },
  {
    beschreibung: "Verpflegung für Busfahrt",
    kategorie: "VERPFLEGUNG",
    betrag: 120,
  },
  {
    beschreibung: "Eintrittskarten Gästeblock",
    kategorie: "TICKETS",
    betrag: 450,
  },
  { beschreibung: "Fahnen und Banner", kategorie: "MATERIAL", betrag: 200 },
  {
    beschreibung: "Pyrotechnik für Choreo",
    kategorie: "MATERIAL",
    betrag: 300,
  },
  { beschreibung: "Druckkosten Flyer", kategorie: "MARKETING", betrag: 80 },
  {
    beschreibung: "Getränke Vereinsheim",
    kategorie: "VERPFLEGUNG",
    betrag: 150,
  },
  { beschreibung: "DJ für Sommerfest", kategorie: "UNTERHALTUNG", betrag: 400 },
  {
    beschreibung: "Miete Grillausrüstung",
    kategorie: "EQUIPMENT",
    betrag: 100,
  },
  {
    beschreibung: "Versicherung Event",
    kategorie: "VERSICHERUNG",
    betrag: 180,
  },
];

export const seedExpenses = async (
  connection: Connection | PoolConnection,
): Promise<void> => {
  try {
    await connection.beginTransaction();

    // Get events with budget
    const [events] = await connection.execute(
      "SELECT id, budget FROM events WHERE budget IS NOT NULL",
    );

    // Get team members who can submit expenses
    const submitters = [
      PREDEFINED_IDS.teamEvent1,
      PREDEFINED_IDS.teamEvent2,
      PREDEFINED_IDS.beirat1,
      PREDEFINED_IDS.vorstand1,
    ];

    const expenses = [];

    for (const event of events as any[]) {
      // 1-4 Ausgaben pro Event mit Budget
      const expenseCount = Math.floor(Math.random() * 4) + 1;
      let totalExpenses = 0;

      for (let i = 0; i < expenseCount; i++) {
        const template = randomElement(EXPENSE_TEMPLATES);

        // Ensure we don't exceed budget
        if (totalExpenses + template.betrag > event.budget * 0.9) {
          continue;
        }

        const status = randomElement([
          "EINGEREICHT",
          "GENEHMIGT",
          "GENEHMIGT",
          "ABGELEHNT",
        ]);
        const isApproved = status === "GENEHMIGT";

        expenses.push({
          id: generateId("exp"),
          event_id: event.id,
          beschreibung: template.beschreibung,
          betrag: template.betrag,
          kategorie: template.kategorie,
          beleg_url:
            Math.random() > 0.3
              ? `https://storage.example.com/belege/${generateId("blg")}.pdf`
              : null,
          rechnungsnummer:
            Math.random() > 0.5
              ? `RE-2025-${Math.floor(Math.random() * 9000 + 1000)}`
              : null,
          status,
          eingereicht_von: randomElement(submitters),
          eingereicht_am: new Date(),
          genehmigt_von: isApproved ? PREDEFINED_IDS.vorstand1 : null,
          genehmigt_am: isApproved ? new Date() : null,
          ablehnungsgrund:
            status === "ABGELEHNT" ? "Budget überschritten" : null,
        });

        if (isApproved) {
          totalExpenses += template.betrag;
        }
      }
    }

    // Insert expenses
    for (const expense of expenses) {
      await connection.execute(
        `INSERT INTO ausgaben (
          id, event_id, beschreibung, betrag, kategorie, beleg_url,
          rechnungsnummer, status, eingereicht_von, eingereicht_am,
          genehmigt_von, genehmigt_am, ablehnungsgrund
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          expense.id,
          expense.event_id,
          expense.beschreibung,
          expense.betrag,
          expense.kategorie,
          expense.beleg_url,
          expense.rechnungsnummer,
          expense.status,
          expense.eingereicht_von,
          expense.eingereicht_am,
          expense.genehmigt_von,
          expense.genehmigt_am,
          expense.ablehnungsgrund,
        ],
      );
    }

    await connection.commit();
    console.log(`✅ ${expenses.length} Expenses seeded successfully`);
  } catch (error) {
    await connection.rollback();
    console.error("❌ Expenses seeding failed:", error);
    throw error;
  }
};

export default seedExpenses;
