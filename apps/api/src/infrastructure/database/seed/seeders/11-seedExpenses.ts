// seed/seeders/11-seedExpenses.ts
import { Connection, PoolConnection } from "mysql2/promise";
import { generateId, randomElement, PREDEFINED_IDS } from "../helpers/index.js";

const EXPENSE_TEMPLATES = [
  {
    beschreibung: "Busmiete für Auswärtsfahrt",
    kategorie: "transport",
    betrag: 850,
  },
  {
    beschreibung: "Verpflegung für Busfahrt",
    kategorie: "verpflegung",
    betrag: 120,
  },
  {
    beschreibung: "Eintrittskarten Gästeblock",
    kategorie: "material",
    betrag: 450,
  },
  {
    beschreibung: "Fahnen und Banner",
    kategorie: "material",
    betrag: 200,
  },
  {
    beschreibung: "Pyrotechnik für Choreo",
    kategorie: "material",
    betrag: 300,
  },
  {
    beschreibung: "Druckkosten Flyer",
    kategorie: "material",
    betrag: 80,
  },
  {
    beschreibung: "Getränke Vereinsheim",
    kategorie: "verpflegung",
    betrag: 150,
  },
  {
    beschreibung: "DJ für Sommerfest",
    kategorie: "sonstiges",
    betrag: 400,
  },
  {
    beschreibung: "Miete Grillausrüstung",
    kategorie: "material",
    betrag: 100,
  },
  {
    beschreibung: "Versicherung Event",
    kategorie: "sonstiges",
    betrag: 180,
  },
];

const seedExpenses = async (
  connection: Connection | PoolConnection,
): Promise<void> => {
  try {
    await connection.beginTransaction();

    const [events] = await connection.execute(
      "SELECT id, budget FROM events WHERE budget IS NOT NULL",
    );

    const submitters = [
      "mbr_event1",
      "mbr_event2",
      "mbr_beirat1",
      "mbr_vorstand1",
    ];

    const expenses = [];

    for (const event of events as any[]) {
      const expenseCount = Math.floor(Math.random() * 4) + 1;
      let totalExpenses = 0;

      for (let i = 0; i < expenseCount; i++) {
        const template = randomElement(EXPENSE_TEMPLATES);

        if (totalExpenses + template.betrag > event.budget * 0.9) {
          continue;
        }

        const status = randomElement([
          "eingereicht",
          "genehmigt",
          "genehmigt",
          "abgelehnt",
        ]);
        const isApproved = status === "genehmigt";

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
          genehmigt_von: isApproved ? "mbr_vorstand1" : null,
          genehmigt_am: isApproved ? new Date() : null,
          ablehnungsgrund:
            status === "abgelehnt" ? "Budget überschritten" : null,
        });

        if (isApproved) {
          totalExpenses += template.betrag;
        }
      }
    }

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
