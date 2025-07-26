// seed/seeders/09-seedDocuments.ts
import { Connection, PoolConnection } from "mysql2/promise";
import { generateId, PREDEFINED_IDS } from "../helpers";

const documents = [
  {
    titel: "Vereinssatzung",
    typ: "SATZUNG",
    inhalt: `# Satzung der Faninitiative Spandau e.V.

## § 1 Name, Sitz, Geschäftsjahr
(1) Der Verein führt den Namen "Faninitiative Spandau e.V."
(2) Er hat seinen Sitz in Berlin-Spandau.
(3) Das Geschäftsjahr ist das Kalenderjahr.

## § 2 Zweck des Vereins
(1) Zweck des Vereins ist die Förderung des Sports...`,
    ist_oeffentlich: true,
    version: 1,
  },
  {
    titel: "Datenschutzerklärung",
    typ: "RECHTLICHES",
    inhalt: `# Datenschutzerklärung

Verantwortlich im Sinne der DSGVO ist...`,
    ist_oeffentlich: true,
    version: 1,
  },
  {
    titel: "Mitgliedsantrag",
    typ: "FORMULAR",
    inhalt: `# Antrag auf Mitgliedschaft

Hiermit beantrage ich die Aufnahme...`,
    ist_oeffentlich: true,
    version: 2,
  },
  {
    titel: "Verhaltenskodex bei Auswärtsfahrten",
    typ: "RICHTLINIE",
    inhalt: `# Verhaltenskodex

Um ein positives Bild unseres Vereins zu vermitteln...`,
    ist_oeffentlich: false,
    version: 1,
  },
  {
    titel: "Finanzordnung",
    typ: "ORDNUNG",
    inhalt: `# Finanzordnung des Vereins

§1 Grundsätze der Kassenführung...`,
    ist_oeffentlich: false,
    version: 1,
  },
];

export const seedDocuments = async (
  connection: Connection | PoolConnection,
): Promise<void> => {
  try {
    await connection.beginTransaction();

    for (const doc of documents) {
      await connection.execute(
        `INSERT INTO dokumente (
          id, titel, typ, inhalt, ist_oeffentlich, version,
          erstellt_am, erstellt_von
        ) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)`,
        [
          generateId("doc"),
          doc.titel,
          doc.typ,
          doc.inhalt,
          doc.ist_oeffentlich,
          doc.version,
          PREDEFINED_IDS.vorstand1,
        ],
      );
    }

    await connection.commit();
    console.log(`✅ ${documents.length} Documents seeded successfully`);
  } catch (error) {
    await connection.rollback();
    console.error("❌ Documents seeding failed:", error);
    throw error;
  }
};
