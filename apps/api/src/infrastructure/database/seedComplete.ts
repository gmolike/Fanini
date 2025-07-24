// apps/api/src/infrastructure/database/seedComplete.ts
import { pool } from "./connection";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const generateId = (): string => {
  return randomUUID();
};

// Helper für zufällige Daten
const randomElement = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

async function seedCompleteDatabase() {
  console.log("🌱 Starte vollständiges Database Seeding...\n");

  try {
    // =====================================
    // 1. USERS & MITGLIEDER
    // =====================================
    console.log("👥 Erstelle Users und Mitglieder...");

    const users: any[] = [];
    const mitglieder: any[] = [];

    // Admin User
    const adminPassword = await bcrypt.hash("Admin2025!", 12);
    const adminId = generateId();
    users.push({
      id: adminId,
      email: "admin@fanini-spandau.de",
      vorname: "System",
      nachname: "Administrator",
      auth_source: "local",
      password_hash: adminPassword,
      ist_aktiv: true,
      role: "ADMIN",
    });

    // Vorstand
    const vorstandPassword = await bcrypt.hash("Vorstand2025!", 12);
    const vorstandIds = [];
    for (let i = 1; i <= 3; i++) {
      const id = generateId();
      vorstandIds.push(id);
      users.push({
        id,
        email: `vorstand${i}@fanini-spandau.de`,
        vorname: ["Michael", "Sandra", "Thomas"][i - 1],
        nachname: ["Schmidt", "Weber", "Müller"][i - 1],
        auth_source: "easyverein",
        password_hash: vorstandPassword,
        ist_aktiv: true,
        role: "VORSTAND",
      });
    }

    // Team-Leiter
    const teamPassword = await bcrypt.hash("Team2025!", 12);
    const teamLeiterIds: Record<string, string> = {};
    const teams = ["event", "medien", "technik", "verein"];
    const teamNamen = [
      { vorname: "Lisa", nachname: "Wagner" },
      { vorname: "Felix", nachname: "Becker" },
      { vorname: "Julia", nachname: "Hoffmann" },
      { vorname: "Markus", nachname: "Klein" },
    ];

    teams.forEach((team, index) => {
      const id = generateId();
      teamLeiterIds[team] = id;
      users.push({
        id,
        email: `${team}@fanini-spandau.de`,
        vorname: teamNamen[index].vorname,
        nachname: teamNamen[index].nachname,
        auth_source: "easyverein",
        password_hash: teamPassword,
        ist_aktiv: true,
        role: `TEAM_${team.toUpperCase()}`,
      });
    });

    // Normale Mitglieder
    const mitgliederPassword = await bcrypt.hash("Mitglied2025!", 12);
    const mitgliederDaten = [
      { vorname: "Anna", nachname: "Meyer", telefon: "0171-1234567" },
      { vorname: "Max", nachname: "Schulz", telefon: "0172-2345678" },
      { vorname: "Sophie", nachname: "Fischer", telefon: "0173-3456789" },
      { vorname: "Leon", nachname: "Zimmermann", telefon: "0174-4567890" },
      { vorname: "Marie", nachname: "Krüger", telefon: "0175-5678901" },
      { vorname: "Paul", nachname: "Schäfer", telefon: "0176-6789012" },
      { vorname: "Emma", nachname: "Wolf", telefon: "0177-7890123" },
      { vorname: "Finn", nachname: "Jung", telefon: "0178-8901234" },
      { vorname: "Mia", nachname: "Schwarz", telefon: "0179-9012345" },
      { vorname: "Ben", nachname: "Neumann", telefon: "0180-0123456" },
    ];

    const mitgliedIds: string[] = [];
    for (const data of mitgliederDaten) {
      const userId = generateId();
      const mitgliedId = generateId();
      mitgliedIds.push(mitgliedId);

      users.push({
        id: userId,
        email: `${data.vorname.toLowerCase()}.${data.nachname.toLowerCase()}@example.com`,
        vorname: data.vorname,
        nachname: data.nachname,
        auth_source: "easyverein",
        password_hash: mitgliederPassword,
        ist_aktiv: true,
        role: "MITGLIED",
        mitgliedsnummer: `M${randomInt(1000, 9999)}`,
      });

      mitglieder.push({
        id: mitgliedId,
        user_id: userId,
        vorname: data.vorname,
        nachname: data.nachname,
        email: `${data.vorname.toLowerCase()}.${data.nachname.toLowerCase()}@example.com`,
        telefon: data.telefon,
        mitgliedsnummer: `M${randomInt(1000, 9999)}`,
        easyverein_id: `EV${randomInt(10000, 99999)}`,
        mitglied_seit: randomDate(new Date(2019, 0, 1), new Date(2024, 11, 31)),
        ist_aktiv: true,
        hat_vertraulichkeitserklaerung: Math.random() > 0.2,
        datenschutz_einwilligung: true,
        sichtbarkeit_email: randomElement(["intern", "privat", "vorstand"]),
        sichtbarkeit_telefon: randomElement(["privat", "vorstand"]),
        geburtsdatum: randomDate(new Date(1970, 0, 1), new Date(2005, 11, 31)),
        adresse_strasse: `${randomElement(["Haupt", "Berliner", "Schul", "Garten", "Wald"])}straße`,
        adresse_hausnummer: randomInt(1, 200).toString(),
        adresse_plz: randomElement(["13581", "13583", "13585", "13587", "13589"]),
        adresse_stadt: "Berlin-Spandau",
      });
    }

    // Users einfügen
    for (const user of users) {
      await pool.query(
        `INSERT INTO users (id, email, vorname, nachname, mitgliedsnummer, auth_source,
         password_hash, ist_aktiv, role, erstellt_am, aktualisiert_am)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [user.id, user.email, user.vorname, user.nachname, user.mitgliedsnummer || null,
         user.auth_source, user.password_hash, user.ist_aktiv, user.role]
      );
    }
    console.log(`✅ ${users.length} Users erstellt`);

    // Mitglieder einfügen
    for (const mitglied of mitglieder) {
      await pool.query(
        `INSERT INTO mitglieder (
          id, user_id, vorname, nachname, email, telefon, mitgliedsnummer,
          easyverein_id, mitglied_seit, ist_aktiv, hat_vertraulichkeitserklaerung,
          datenschutz_einwilligung, sichtbarkeit_email, sichtbarkeit_telefon,
          geburtsdatum, adresse_strasse, adresse_hausnummer, adresse_plz, adresse_stadt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          mitglied.id, mitglied.user_id, mitglied.vorname, mitglied.nachname,
          mitglied.email, mitglied.telefon, mitglied.mitgliedsnummer,
          mitglied.easyverein_id, mitglied.mitglied_seit, mitglied.ist_aktiv,
          mitglied.hat_vertraulichkeitserklaerung, mitglied.datenschutz_einwilligung,
          mitglied.sichtbarkeit_email, mitglied.sichtbarkeit_telefon,
          mitglied.geburtsdatum, mitglied.adresse_strasse, mitglied.adresse_hausnummer,
          mitglied.adresse_plz, mitglied.adresse_stadt
        ]
      );
    }
    console.log(`✅ ${mitglieder.length} Mitglieder erstellt`);

    // User Rollen zuweisen
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, zugewiesen_von) VALUES (?, 'role_admin', ?)`,
      [adminId, adminId]
    );

    for (const vorstandId of vorstandIds) {
      await pool.query(
        `INSERT INTO user_roles (user_id, role_id, zugewiesen_von) VALUES (?, 'role_vorstand', ?)`,
        [vorstandId, adminId]
      );
    }

    for (const [team, userId] of Object.entries(teamLeiterIds)) {
      await pool.query(
        `INSERT INTO user_roles (user_id, role_id, zugewiesen_von) VALUES (?, ?, ?)`,
        [userId, `role_team_${team}`, adminId]
      );
    }

    // =====================================
    // 2. EVENTS
    // =====================================
    console.log("\n📅 Erstelle Events...");

    const eventTypes = ["vereinstreffen", "sportveranstaltung", "fanfahrt", "social", "sitzung", "workshop", "turnier"];
    const eventStatus = ["entwurf", "geplant", "genehmigt", "aktiv", "abgeschlossen"];
    const events: any[] = [];

    for (let i = 0; i < 20; i++) {
      const eventId = generateId();
      const verantwortlich = randomElement(mitgliedIds);
      const typ = randomElement(eventTypes);
      const datum = randomDate(new Date(2024, 0, 1), new Date(2025, 11, 31));

      events.push({
        id: eventId,
        titel: `${typ === "fanfahrt" ? "Fanfahrt nach" : typ === "vereinstreffen" ? "Monatstreffen" : "Event"} ${randomElement(["Berlin", "Hamburg", "München", "Köln", "Frankfurt"])}`,
        beschreibung: `Eine ausführliche Beschreibung für dieses Event. ${typ === "fanfahrt" ? "Gemeinsame Anreise und Rückfahrt organisiert." : ""}`,
        kurzbeschreibung: `Kurze Beschreibung des Events`,
        datum: datum,
        uhrzeit: `${randomInt(10, 20)}:${randomElement(["00", "30"])}:00`,
        dauer_minuten: randomInt(60, 240),
        ort: JSON.stringify({
          name: randomElement(["Vereinsheim", "Stadion", "Hauptbahnhof", "Sportplatz", "Restaurant"]),
          adresse: {
            strasse: "Beispielstraße",
            hausnummer: randomInt(1, 100).toString(),
            plz: "13587",
            stadt: "Berlin"
          }
        }),
        typ: typ,
        status: randomElement(eventStatus),
        ist_oeffentlich: Math.random() > 0.5,
        ist_vertraulich: Math.random() > 0.8,
        verantwortlich_id: verantwortlich,
        budget: typ === "fanfahrt" ? randomInt(500, 2000) : randomInt(100, 500),
        max_teilnehmer: randomInt(10, 100),
        erstellt_von: verantwortlich,
      });
    }

    for (const event of events) {
      await pool.query(
        `INSERT INTO events (
          id, titel, beschreibung, kurzbeschreibung, datum, uhrzeit, dauer_minuten,
          ort, typ, status, ist_oeffentlich, ist_vertraulich, verantwortlich_id,
          budget, max_teilnehmer, erstellt_von
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event.id, event.titel, event.beschreibung, event.kurzbeschreibung,
          event.datum, event.uhrzeit, event.dauer_minuten, event.ort, event.typ,
          event.status, event.ist_oeffentlich, event.ist_vertraulich,
          event.verantwortlich_id, event.budget, event.max_teilnehmer, event.erstellt_von
        ]
      );
    }
    console.log(`✅ ${events.length} Events erstellt`);

    // Event Teilnahmen
    console.log("📝 Erstelle Event-Teilnahmen...");
    let teilnahmenCount = 0;
    for (const event of events.slice(0, 10)) { // Nur für die ersten 10 Events
      const teilnehmerAnzahl = randomInt(3, 15);
      const teilnehmer = [...mitgliedIds].sort(() => 0.5 - Math.random()).slice(0, teilnehmerAnzahl);

      for (const mitgliedId of teilnehmer) {
        await pool.query(
          `INSERT INTO event_teilnahmen (id, event_id, mitglied_id, status)
           VALUES (?, ?, ?, ?)`,
          [generateId(), event.id, mitgliedId, randomElement(["angemeldet", "bestaetigt", "teilgenommen"])]
        );
        teilnahmenCount++;
      }
    }
    console.log(`✅ ${teilnahmenCount} Event-Teilnahmen erstellt`);

    // =====================================
    // 3. TASKS
    // =====================================
    console.log("\n✅ Erstelle Tasks...");

    const taskKategorien = ["Organisation", "Technik", "Kommunikation", "Finanzen", "Sonstiges"];
    let tasksCount = 0;

    for (const event of events.slice(0, 5)) { // Tasks für die ersten 5 Events
      const tasksPerEvent = randomInt(3, 8);

      for (let i = 0; i < tasksPerEvent; i++) {
        const taskId = generateId();
        await pool.query(
          `INSERT INTO tasks (
            id, titel, beschreibung, context_type, context_id, verantwortlich_id,
            status, prioritaet, frist, kategorie, erstellt_von
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            taskId,
            randomElement(["Flyer erstellen", "Location buchen", "Catering organisieren", "Teilnehmer informieren", "Material besorgen"]),
            "Detaillierte Beschreibung der Aufgabe",
            "event",
            event.id,
            randomElement(mitgliedIds),
            randomElement(["offen", "in_bearbeitung", "erledigt"]),
            randomElement(["niedrig", "mittel", "hoch"]),
            randomDate(new Date(), new Date(2025, 11, 31)),
            randomElement(taskKategorien),
            event.verantwortlich_id
          ]
        );
        tasksCount++;
      }
    }
    console.log(`✅ ${tasksCount} Tasks erstellt`);

    // =====================================
    // 4. GREMIEN
    // =====================================
    console.log("\n🏛️ Erstelle Gremien...");

    const gremien = [
      { id: generateId(), type: "vorstand", name: "Vorstand", gradient: "from-blue-600 to-blue-800" },
      { id: generateId(), type: "beirat", name: "Beirat", gradient: "from-green-600 to-green-800" },
      { id: generateId(), type: "team_event", name: "Team Event", gradient: "from-purple-600 to-purple-800" },
      { id: generateId(), type: "team_medien", name: "Team Medien", gradient: "from-pink-600 to-pink-800" },
      { id: generateId(), type: "team_technik", name: "Team Technik", gradient: "from-orange-600 to-orange-800" },
      { id: generateId(), type: "team_verein", name: "Team Verein", gradient: "from-teal-600 to-teal-800" },
    ];

    for (const gremium of gremien) {
      await pool.query(
        `INSERT INTO gremien (
          id, type, name, description, short_description, gradient,
          meeting_schedule, contact_email, established_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          gremium.id, gremium.type, gremium.name,
          `Das ${gremium.name} ist verantwortlich für...`,
          `Kurzbeschreibung ${gremium.name}`,
          gremium.gradient,
          "Jeden ersten Montag im Monat",
          `${gremium.type}@fanini-spandau.de`,
          new Date(2025, 0, 1)
        ]
      );
    }
    console.log(`✅ ${gremien.length} Gremien erstellt`);

    // =====================================
    // 5. DOKUMENTE
    // =====================================
    console.log("\n📄 Erstelle Dokumente...");

    const dokumente = [
      { title: "Vereinssatzung", category: "satzung", version: "2.0" },
      { title: "Mitgliedsantrag", category: "formulare", version: "1.2" },
      { title: "Datenschutzerklärung", category: "richtlinien", version: "1.1" },
      { title: "Protokoll Mitgliederversammlung 2024", category: "protokolle", version: "1.0" },
      { title: "Event-Leitfaden", category: "guides", version: "1.5" },
    ];

    for (const doc of dokumente) {
      await pool.query(
        `INSERT INTO documents (
          id, title, description, category, file_url, file_size, file_type,
          version, status, published_at, author, is_featured, is_public
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          generateId(),
          doc.title,
          `Beschreibung für ${doc.title}`,
          doc.category,
          `/documents/${doc.title.toLowerCase().replace(/ /g, "-")}.pdf`,
          randomInt(100000, 5000000),
          "application/pdf",
          doc.version,
          "current",
          new Date(),
          "Vorstand",
          doc.category === "satzung",
          true
        ]
      );
    }
    console.log(`✅ ${dokumente.length} Dokumente erstellt`);

    // =====================================
    // 6. CREATORS
    // =====================================
    console.log("\n🎨 Erstelle Creators...");

    const creatorIds = [];
    const creatorDaten = [
      { name: "Alex Storm", types: ["grafik", "video"] },
      { name: "Sarah Vision", types: ["foto", "video"] },
      { name: "Max Creative", types: ["grafik", "musik"] },
    ];

    for (let i = 0; i < 3; i++) {
      const creatorId = generateId();
      const memberIndex = i + 5; // Nehme Mitglieder 5-7 als Creators
      creatorIds.push(creatorId);

      await pool.query(
        `INSERT INTO creators (
          id, member_id, artist_name, real_name, description, portfolio,
          is_active, active_since, instagram, website
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          creatorId,
          mitgliedIds[memberIndex],
          creatorDaten[i].name,
          mitglieder[memberIndex].vorname + " " + mitglieder[memberIndex].nachname,
          `${creatorDaten[i].name} ist ein talentierter Creator im Bereich...`,
          `https://portfolio.${creatorDaten[i].name.toLowerCase().replace(/ /g, "")}.com`,
          true,
          new Date(2023, randomInt(0, 11), randomInt(1, 28)),
          `@${creatorDaten[i].name.toLowerCase().replace(/ /g, "")}`,
          `https://${creatorDaten[i].name.toLowerCase().replace(/ /g, "")}.com`
        ]
      );

      // Creator Types
      for (const type of creatorDaten[i].types) {
        await pool.query(
          `INSERT INTO creator_types (creator_id, type) VALUES (?, ?)`,
          [creatorId, type]
        );
      }
    }
    console.log(`✅ ${creatorIds.length} Creators erstellt`);

    // =====================================
    // 7. FAQ
    // =====================================
    console.log("\n❓ Erstelle FAQs...");

    const faqs = [
      { question: "Wie werde ich Mitglied?", category: "mitgliedschaft" },
      { question: "Was kostet die Mitgliedschaft?", category: "mitgliedschaft" },
      { question: "Wie kann ich mich für Events anmelden?", category: "events" },
      { question: "Wer kann Creator werden?", category: "verein" },
      { question: "Wie logge ich mich ein?", category: "technik" },
    ];

    for (let i = 0; i < faqs.length; i++) {
      await pool.query(
        `INSERT INTO faqs (id, question, answer, category, order_position)
         VALUES (?, ?, ?, ?, ?)`,
        [
          generateId(),
          faqs[i].question,
          `Hier ist die ausführliche Antwort auf die Frage: ${faqs[i].question}`,
          faqs[i].category,
          i + 1
        ]
      );
    }
    console.log(`✅ ${faqs.length} FAQs erstellt`);

    // =====================================
    // 8. NEWSLETTER
    // =====================================
    console.log("\n📰 Erstelle Newsletter...");

    const newsletterId = generateId();
    await pool.query(
      `INSERT INTO newsletters (
        id, edition, title, subtitle, published_at, status,
        introduction, closing_message
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newsletterId,
        1,
        "Fanini Newsletter Januar 2025",
        "Neues Jahr, neue Events!",
        new Date(),
        "published",
        "Willkommen zur ersten Ausgabe unseres Newsletters im neuen Jahr!",
        "Bis zum nächsten Mal, Euer Fanini Team"
      ]
    );

    // Newsletter Subscriptions
    for (let i = 0; i < 5; i++) {
      await pool.query(
        `INSERT INTO newsletter_subscriptions (
          id, email, first_name, last_name, confirmed_at
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          generateId(),
          `subscriber${i + 1}@example.com`,
          ["Max", "Anna", "Tom", "Lisa", "Paul"][i],
          ["Müller", "Schmidt", "Weber", "Meyer", "Wagner"][i],
          new Date()
        ]
      );
    }
    console.log("✅ Newsletter und Subscriptions erstellt");

    // =====================================
    // 9. AUSGABEN
    // =====================================
    console.log("\n💰 Erstelle Ausgaben...");

    let ausgabenCount = 0;
    for (const event of events.slice(0, 5)) {
      const ausgabenPerEvent = randomInt(1, 4);

      for (let i = 0; i < ausgabenPerEvent; i++) {
        await pool.query(
          `INSERT INTO ausgaben (
            id, event_id, beschreibung, betrag, kategorie, status,
            eingereicht_von, genehmigt_von, genehmigt_am
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            generateId(),
            event.id,
            randomElement(["Bustickets", "Verpflegung", "Materialien", "Raummiete"]),
            randomInt(50, 500),
            randomElement(["verpflegung", "transport", "material", "sonstiges"]),
            randomElement(["eingereicht", "genehmigt", "erstattet"]),
            randomElement(mitgliedIds),
            Math.random() > 0.5 ? vorstandIds[0] : null,
            Math.random() > 0.5 ? new Date() : null
          ]
        );
        ausgabenCount++;
      }
    }
    console.log(`✅ ${ausgabenCount} Ausgaben erstellt`);

    console.log("\n✅ Vollständiges Seeding abgeschlossen!");
    console.log("\n📊 Zusammenfassung:");
    console.log(`- ${users.length} Users`);
    console.log(`- ${mitglieder.length} Mitglieder`);
    console.log(`- ${events.length} Events`);
    console.log(`- ${teilnahmenCount} Event-Teilnahmen`);
    console.log(`- ${tasksCount} Tasks`);
    console.log(`- ${gremien.length} Gremien`);
    console.log(`- ${dokumente.length} Dokumente`);
    console.log(`- ${creatorIds.length} Creators`);
    console.log(`- ${faqs.length} FAQs`);
    console.log(`- ${ausgabenCount} Ausgaben`);

    console.log("\n🔑 Test-Logins:");
    console.log("Admin: admin@fanini-spandau.de / Admin2025!");
    console.log("Vorstand: vorstand1@fanini-spandau.de / Vorstand2025!");
    console.log("Team Event: event@fanini-spandau.de / Team2025!");
    console.log("Mitglied: anna.meyer@example.com / Mitglied2025!");

  } catch (error) {
    console.error("\n❌ Fehler beim Seeding:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Führe das Seeding aus wenn direkt aufgerufen
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedCompleteDatabase()
    .then(() => {
      console.log("\n✅ Seeding erfolgreich abgeschlossen");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Seeding fehlgeschlagen:", error);
      process.exit(1);
    });
}

export { seedCompleteDatabase };
