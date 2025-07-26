// seed/seeders/13-seedProtocols.ts
import { Connection, PoolConnection } from "mysql2/promise";
import { generateId, PREDEFINED_IDS } from "../helpers/index.js";

const seedProtocols = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    const protocols = [
      {
        id: generateId("prt"),
        bereich_id: "bereich_vorstand",
        datum: new Date(2025, 0, 15),
        titel: "Vorstandssitzung Januar 2025",
        typ: "VORSTANDSSITZUNG",
        teilnehmer_ids: JSON.stringify([
          'mbr_vorstand1',  // Use member IDs
          'mbr_vorstand2',
          'mbr_beirat1'
        ]),
        protokollant_id: 'mbr_vorstand2',
        sitzungsleiter_id: 'mbr_vorstand1',
        status: "GENEHMIGT",
        inhalt: `# Protokoll Vorstandssitzung...`,
        genehmigt_am: new Date(2025, 0, 20),
        genehmigt_von: 'mbr_vorstand1',
      }
    ];

    for (const protocol of protocols) {
      await connection.execute(
        `INSERT INTO protokolle (
          id, bereich_id, datum, titel, typ, teilnehmer_ids,
          protokollant_id, sitzungsleiter_id, status, inhalt,
          genehmigt_am, genehmigt_von
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          protocol.id, protocol.bereich_id, protocol.datum, protocol.titel,
          protocol.typ, protocol.teilnehmer_ids, protocol.protokollant_id,
          protocol.sitzungsleiter_id, protocol.status, protocol.inhalt,
          protocol.genehmigt_am, protocol.genehmigt_von,
        ]
      );
    }

    // Tagesordnungspunkte
    const agendaItems = [
      {
        id: generateId("top"),
        protokoll_id: protocols[0].id,
        titel: "Finanzbericht Q4 2024",
        beschreibung: "Vorstellung der Zahlen aus dem letzten Quartal",
        prioritaet: "HOCH",
        eingereicht_von: 'mbr_vorstand1',
        eingereicht_am: new Date(2025, 0, 10),
        bereich_id: "bereich_vorstand",
        ergebnis: "Bericht zur Kenntnis genommen. Budget für 2025 genehmigt.",
        massnahmen: JSON.stringify([
          "Quartalsberichte künftig digital versenden",
          "Ausgabenlimit für Events auf 2000€ erhöht",
        ]),
      }
    ];

    for (const item of agendaItems) {
      await connection.execute(
        `INSERT INTO tagesordnungspunkte (
          id, protokoll_id, titel, beschreibung, prioritaet,
          eingereicht_von, eingereicht_am, bereich_id,
          ergebnis, massnahmen
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id, item.protokoll_id, item.titel, item.beschreibung,
          item.prioritaet, item.eingereicht_von, item.eingereicht_am,
          item.bereich_id, item.ergebnis, item.massnahmen,
        ]
      );
    }

    await connection.commit();
    console.log(`✅ ${protocols.length} Protocols and ${agendaItems.length} Agenda items seeded successfully`);
  } catch (error) {
    await connection.rollback();
    console.error("❌ Protocols seeding failed:", error);
    throw error;
  }
};

export default seedProtocols;
