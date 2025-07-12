import { pool } from "./connection";
import { randomUUID } from "crypto";
async function seedDatabase() {
  console.log("🌱 Füge Test-Daten ein...\n");

  try {
    // Test-Mitglieder
    const mitglieder = [
      {
        id: `usr_${randomUUID()}`,
        vorname: "Max",
        nachname: "Mustermann",
        email: "max@example.com",
        mitglied_seit: "2020-01-15",
        ist_aktiv: true,
        hat_vertraulichkeitserklaerung: true,
      },
      {
        id: `usr_${randomUUID()}`,
        vorname: "Anna",
        nachname: "Schmidt",
        email: "anna@example.com",
        mitglied_seit: "2021-03-20",
        ist_aktiv: true,
        hat_vertraulichkeitserklaerung: true,
      },
      {
        id: `usr_${randomUUID()}`,
        vorname: "Tom",
        nachname: "Meyer",
        email: "tom@example.com",
        mitglied_seit: "2019-11-10",
        ist_aktiv: true,
        hat_vertraulichkeitserklaerung: false,
      },
    ];

    // Mitglieder einfügen
    for (const mitglied of mitglieder) {
      await pool.query(
        `INSERT IGNORE INTO mitglieder
         (id, vorname, nachname, email, mitglied_seit, ist_aktiv, hat_vertraulichkeitserklaerung)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          mitglied.id,
          mitglied.vorname,
          mitglied.nachname,
          mitglied.email,
          mitglied.mitglied_seit,
          mitglied.ist_aktiv,
          mitglied.hat_vertraulichkeitserklaerung,
        ],
      );
      console.log(
        `✅ Mitglied erstellt: ${mitglied.vorname} ${mitglied.nachname}`,
      );
    }

    // Test-Events
    const events = [
      {
        id: `evt_${randomUUID()}`,
        titel: "Fanfahrt nach Berlin",
        beschreibung: "Gemeinsame Fahrt zum Auswärtsspiel",
        datum: "2024-06-15",
        uhrzeit: "14:00:00",
        ort: JSON.stringify({
          name: "Hauptbahnhof Spandau",
          adresse: {
            strasse: "Bahnhofstr",
            hausnummer: "1",
            plz: "13581",
            stadt: "Berlin",
          },
        }),
        typ: "fanfahrt",
        status: "genehmigt",
        ist_oeffentlich: true,
        verantwortlich_id: mitglieder[0].id,
        erstellt_von: mitglieder[0].id,
      },
      {
        id: `evt_${randomUUID()}`,
        titel: "Vereinstreffen",
        beschreibung: "Monatliches Treffen aller Mitglieder",
        datum: "2024-05-20",
        uhrzeit: "19:00:00",
        ort: JSON.stringify({
          name: "Vereinsheim",
          beschreibung: "Im Keller der Sporthalle",
        }),
        typ: "vereinstreffen",
        status: "genehmigt",
        ist_oeffentlich: false,
        verantwortlich_id: mitglieder[1].id,
        erstellt_von: mitglieder[1].id,
      },
    ];

    // Events einfügen
    for (const event of events) {
      await pool.query(
        `INSERT IGNORE INTO events
         (id, titel, beschreibung, datum, uhrzeit, ort, typ, status,
          ist_oeffentlich, verantwortlich_id, erstellt_von)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event.id,
          event.titel,
          event.beschreibung,
          event.datum,
          event.uhrzeit,
          event.ort,
          event.typ,
          event.status,
          event.ist_oeffentlich,
          event.verantwortlich_id,
          event.erstellt_von,
        ],
      );
      console.log(`✅ Event erstellt: ${event.titel}`);
    }

    console.log("\n✅ Test-Daten erfolgreich eingefügt!");
  } catch (error) {
    console.error("\n❌ Fehler beim Einfügen der Test-Daten:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Führe das Seeding aus
seedDatabase();
