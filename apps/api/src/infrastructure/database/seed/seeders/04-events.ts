// apps/api/src/infrastructure/database/seed/seeders/04-events.ts
import { Pool } from "mysql2/promise";
import { randomElement, generateId, randomInt, randomDate } from "../helpers/generators";
export async function seedEvents(pool: Pool, userData: any) {
  console.log("\n📅 Seeding events...");

  const heute = new Date();
  const inEinemJahr = new Date();
  inEinemJahr.setFullYear(heute.getFullYear() + 1);

  const eventTemplates = [
    {
      titel: "Fanfahrt nach Dresden",
      typ: "fanfahrt",
      beschreibung: "Gemeinsame Fanfahrt zum Auswärtsspiel gegen Dresden.",
      kurzbeschreibung: "Busfahrt zum Auswärtsspiel",
      ist_oeffentlich: true,
      max_teilnehmer: 50,
      budget: 1500,
      dauer_minuten: 480,
      uhrzeit: "08:00:00",
    },
    {
      titel: "Mitgliederversammlung Q1 2025",
      typ: "sitzung",
      beschreibung:
        "Ordentliche Mitgliederversammlung mit Berichten und Abstimmungen.",
      kurzbeschreibung: "Quartals-Mitgliederversammlung",
      ist_oeffentlich: false,
      ist_vertraulich: true,
      max_teilnehmer: 100,
      dauer_minuten: 120,
      uhrzeit: "19:00:00",
    },
    {
      titel: "Public Viewing Champions League",
      typ: "social",
      beschreibung: "Gemeinsames Schauen des CL-Spiels im Vereinsheim.",
      kurzbeschreibung: "CL-Spiel gemeinsam schauen",
      ist_oeffentlich: true,
      max_teilnehmer: 80,
      budget: 200,
      dauer_minuten: 180,
      uhrzeit: "20:00:00",
    },
    {
      titel: "League of Legends Turnier",
      typ: "turnier",
      beschreibung: "Offenes LoL-Turnier für alle Skill-Level.",
      kurzbeschreibung: "Community LoL-Turnier",
      ist_oeffentlich: true,
      max_teilnehmer: 40,
      budget: 300,
      dauer_minuten: 360,
      uhrzeit: "14:00:00",
      sportbereich: "league_of_legends",
    },
  ];

  const locations = [
    {
      name: "Vereinsheim Faninitiative",
      address: "Spandauer Straße 42, 13587 Berlin",
    },
    {
      name: "Stadion am Falkenhagener Feld",
      address: "Falkenhagener Str. 120, 13583 Berlin",
    },
    {
      name: "Gaming Lounge Spandau",
      address: "Klosterstraße 28, 13581 Berlin",
    },
  ];

  const eventIds: string[] = [];

  for (const template of eventTemplates) {
    // Create 2-3 events per template
    const variations = template.ist_oeffentlich ? 3 : 2;

    for (let v = 0; v < variations; v++) {
      const eventId = generateId();
      eventIds.push(eventId);

      // Determine responsible person
      let verantwortlich: string;
      if (template.typ === "sitzung") {
        verantwortlich = userData.vorstandMemberIds[0];
      } else if (template.typ === "turnier") {
        verantwortlich = userData.teamMemberIds.event;
      } else {
        verantwortlich = randomElement(userData.regularMemberIds);
      }

      // Time planning
      let datum: Date;
      let status: string;

      if (v === 0) {
        datum = randomDate(new Date(2024, 6, 1), new Date(2024, 11, 31));
        status = "abgeschlossen";
      } else if (v === 1) {
        datum = randomDate(
          heute,
          new Date(heute.getTime() + 30 * 24 * 60 * 60 * 1000),
        );
        status = "genehmigt";
      } else {
        datum = randomDate(
          new Date(heute.getTime() + 31 * 24 * 60 * 60 * 1000),
          inEinemJahr,
        );
        status = "geplant";
      }

      const location = randomElement(locations);

      await pool.execute(
        `INSERT INTO events (
          id, titel, beschreibung, kurzbeschreibung, datum, uhrzeit,
          dauer_minuten, ort, typ, sportbereich, status, ist_oeffentlich,
          ist_vertraulich, verantwortlich_id, budget, max_teilnehmer,
          erstellt_von, anmeldeschluss
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          eventId,
          template.titel +
            (v > 0
              ? ` ${datum.toLocaleString("de-DE", { month: "long" })}`
              : ""),
          template.beschreibung,
          template.kurzbeschreibung,
          datum,
          template.uhrzeit,
          template.dauer_minuten,
          JSON.stringify(location),
          template.typ,
          template.sportbereich || null,
          status,
          template.ist_oeffentlich,
          template.ist_vertraulich || false,
          verantwortlich,
          template.budget || null,
          template.max_teilnehmer,
          verantwortlich,
          new Date(datum.getTime() - 3 * 24 * 60 * 60 * 1000),
        ],
      );

      // Approve events if needed
      if (status === "genehmigt" || status === "abgeschlossen") {
        await pool.execute(
          `UPDATE events SET genehmigt_von = ?, genehmigt_am = ? WHERE id = ?`,
          [
            userData.vorstandMemberIds[0],
            new Date(datum.getTime() - 14 * 24 * 60 * 60 * 1000),
            eventId,
          ],
        );
      }
    }
  }

  console.log(`  ✓ ${eventIds.length} Events`);

  // Event Participations
  let participationCount = 0;
  for (const eventId of eventIds.slice(0, 10)) {
    const teilnehmerAnzahl = randomInt(5, 20);
    const teilnehmer = [...userData.allMemberIds]
      .sort(() => 0.5 - Math.random())
      .slice(0, teilnehmerAnzahl);

    for (const memberId of teilnehmer) {
      await pool.execute(
        `INSERT INTO event_teilnahmen (
          id, event_id, mitglied_id, status
        ) VALUES (?, ?, ?, ?)`,
        [
          generateId(),
          eventId,
          memberId,
          randomElement(["angemeldet", "bestaetigt", "teilgenommen"]),
        ],
      );
      participationCount++;
    }
  }

  console.log(`  ✓ ${participationCount} Event participations`);

  return { eventIds };
}
