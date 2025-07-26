// seed/seeders/13-seedProtocols.ts
import { Connection, PoolConnection } from "mysql2/promise";
import { generateId, PREDEFINED_IDS } from "../helpers";

export const seedProtocols = async (
  connection: Connection | PoolConnection,
): Promise<void> => {
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
          PREDEFINED_IDS.vorstand1,
          PREDEFINED_IDS.vorstand2,
          PREDEFINED_IDS.beirat1,
        ]),
        protokollant_id: PREDEFINED_IDS.vorstand2,
        sitzungsleiter_id: PREDEFINED_IDS.vorstand1,
        status: "GENEHMIGT",
        inhalt: `# Protokoll Vorstandssitzung

## Anwesende
- Thomas Müller (Vorsitzender)
- Sandra Schmidt (Stellv. Vorsitzende)
- Michael Weber (Beirat)

## Tagesordnung
1. Begrüßung
2. Finanzbericht Q4 2024
3. Planung Sommerfest 2025
4. Verschiedenes`,
        genehmigt_am: new Date(2025, 0, 20),
        genehmigt_von: PREDEFINED_IDS.vorstand1,
      },
      {
        id: generateId("prt"),
        bereich_id: "bereich_team_event",
        datum: new Date(2025, 0, 8),
        titel: "Event-Team Meeting",
        typ: "TEAM_MEETING",
        teilnehmer_ids: JSON.stringify([
          PREDEFINED_IDS.teamEvent1,
          PREDEFINED_IDS.teamEvent2,
        ]),
        protokollant_id: PREDEFINED_IDS.teamEvent2,
        sitzungsleiter_id: PREDEFINED_IDS.teamEvent1,
        status: "ENTWURF",
        inhalt: null,
      },
    ];

    // Insert protocols
    for (const protocol of protocols) {
      await connection.execute(
        `INSERT INTO protokolle (
          id, bereich_id, datum, titel, typ, teilnehmer_ids,
          protokollant_id, sitzungsleiter_id, status, inhalt,
          genehmigt_am, genehmigt_von
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          protocol.id,
          protocol.bereich_id,
          protocol.datum,
          protocol.titel,
          protocol.typ,
          protocol.teilnehmer_ids,
          protocol.protokollant_id,
          protocol.sitzungsleiter_id,
          protocol.status,
          protocol.inhalt,
          protocol.genehmigt_am,
          protocol.genehmigt_von,
        ],
      );
    }

    // Add Tagesordnungspunkte
    const agendaItems = [
      {
        id: generateId("top"),
        protokoll_id: protocols[0].id,
        titel: "Finanzbericht Q4 2024",
        beschreibung: "Vorstellung der Zahlen aus dem letzten Quartal",
        prioritaet: "HOCH",
        eingereicht_von: PREDEFINED_IDS.vorstand1,
        eingereicht_am: new Date(2025, 0, 10),
        bereich_id: "bereich_vorstand",
        ergebnis: "Bericht zur Kenntnis genommen. Budget für 2025 genehmigt.",
        massnahmen: JSON.stringify([
          "Quartalsberichte künftig digital versenden",
          "Ausgabenlimit für Events auf 2000€ erhöht",
        ]),
      },
      {
        id: generateId("top"),
        protokoll_id: null,
        titel: "Neue Choreo für Derby",
        beschreibung: "Planung einer großen Choreografie für das Stadtderby",
        prioritaet: "MITTEL",
        eingereicht_von: PREDEFINED_IDS.teamEvent1,
        eingereicht_am: new Date(),
        bereich_id: "bereich_team_event",
        ergebnis: null,
        massnahmen: null,
      },
    ];

    for (const item of agendaItems) {
      await connection.execute(
        `INSERT INTO tagesordnungspunkte (
          id, protokoll_id, titel, beschreibung, prioritaet,
          eingereicht_von, eingereicht_am, bereich_id,
          ergebnis, massnahmen
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.protokoll_id,
          item.titel,
          item.beschreibung,
          item.prioritaet,
          item.eingereicht_von,
          item.eingereicht_am,
          item.bereich_id,
          item.ergebnis,
          item.massnahmen,
        ],
      );
    }

    await connection.commit();
    console.log(
      `✅ ${protocols.length} Protocols and ${agendaItems.length} Agenda items seeded successfully`,
    );
  } catch (error) {
    await connection.rollback();
    console.error("❌ Protocols seeding failed:", error);
    throw error;
  }
};

export default seedProtocols;
