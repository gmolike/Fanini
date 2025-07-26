// seed/seeders/03-seedMembers.ts
import { Connection, PoolConnection } from "mysql2/promise";
import { PREDEFINED_IDS, generateMembers } from "../helpers";

const predefinedMembers = [
  {
    id: "mbr_admin",
    user_id: PREDEFINED_IDS.admin,
    vorname: "Admin",
    nachname: "System",
    email: "admin@faninitiative-spandau.de",
  },
  {
    id: "mbr_vorstand1",
    user_id: PREDEFINED_IDS.vorstand1,
    vorname: "Thomas",
    nachname: "Müller",
    email: "vorstand1@faninitiative-spandau.de",
    telefon: "+49 30 12345601",
  },
  {
    id: "mbr_vorstand2",
    user_id: PREDEFINED_IDS.vorstand2,
    vorname: "Sandra",
    nachname: "Schmidt",
    email: "vorstand2@faninitiative-spandau.de",
    telefon: "+49 30 12345602",
  },
  {
    id: "mbr_beirat1",
    user_id: PREDEFINED_IDS.beirat1,
    vorname: "Michael",
    nachname: "Weber",
    email: "beirat1@faninitiative-spandau.de",
  },
  {
    id: "mbr_beirat2",
    user_id: PREDEFINED_IDS.beirat2,
    vorname: "Julia",
    nachname: "Fischer",
    email: "beirat2@faninitiative-spandau.de",
  },
  {
    id: "mbr_event1",
    user_id: PREDEFINED_IDS.teamEvent1,
    vorname: "Felix",
    nachname: "Wagner",
    email: "event1@faninitiative-spandau.de",
  },
  {
    id: "mbr_event2",
    user_id: PREDEFINED_IDS.teamEvent2,
    vorname: "Lisa",
    nachname: "Becker",
    email: "event2@faninitiative-spandau.de",
  },
  {
    id: "mbr_medien",
    user_id: PREDEFINED_IDS.teamMedien1,
    vorname: "Tim",
    nachname: "Meyer",
    email: "medien@faninitiative-spandau.de",
  },
  {
    id: "mbr_technik",
    user_id: PREDEFINED_IDS.teamTechnik1,
    vorname: "Jan",
    nachname: "Schulz",
    email: "technik@faninitiative-spandau.de",
  },
  {
    id: "mbr_verein",
    user_id: PREDEFINED_IDS.teamVerein1,
    vorname: "Anna",
    nachname: "Hoffmann",
    email: "verein@faninitiative-spandau.de",
  },
];

const seedMembers = async (
  connection: Connection | PoolConnection,
): Promise<void> => {
  try {
    await connection.beginTransaction();

    // Insert predefined members
    for (const member of predefinedMembers) {
      await connection.execute(
        `INSERT INTO mitglieder (
          id, user_id, easyverein_id, vorname, nachname, email, telefon,
          ist_aktiv, hat_vertraulichkeitserklaerung, mitglied_seit,
          sichtbarkeit_email, sichtbarkeit_telefon, sichtbarkeit_profil
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          member.id,
          member.user_id,
          `EV${Math.floor(Math.random() * 90000 + 10000)}`,
          member.vorname,
          member.nachname,
          member.email,
          member.telefon || null,
          true,
          true,
          new Date(2020, 0, 1),
          "intern", // Geändert von 'MITGLIEDER' zu 'intern'
          "privat", // Geändert von 'MITGLIEDER' zu 'privat'
          "intern", // Geändert von 'ALLE' zu 'intern'
        ],
      );
    }
    // Generate additional members
    const generatedMembers = await generateMembers(40);

    // First create users for generated members
    for (const member of generatedMembers) {
      await connection.execute(
        `INSERT INTO users (
      id, email, vorname, nachname, password_hash,
      auth_source, ist_aktiv, role, erstellt_am
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          member.user_id,
          member.email,
          member.vorname,
          member.nachname,
          member.password_hash,
          "local",
          true,
          "MITGLIED",
        ],
      );
    }

    // Then create member records
    for (const member of generatedMembers) {
      await connection.execute(
        `INSERT INTO mitglieder (
          id, user_id, easyverein_id, vorname, nachname, email, telefon,
          ist_aktiv, hat_vertraulichkeitserklaerung, mitglied_seit,
          beschreibung, sichtbarkeit_email, sichtbarkeit_telefon, sichtbarkeit_profil
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          member.id,
          member.user_id,
          member.easyverein_id,
          member.vorname,
          member.nachname,
          member.email,
          member.telefon,
          member.ist_aktiv,
          member.hat_vertraulichkeitserklaerung,
          member.mitglied_seit,
          member.beschreibung,
          member.sichtbarkeit_email,
          member.sichtbarkeit_telefon,
          member.sichtbarkeit_profil,
        ],
      );
    }

    await connection.commit();
    console.log(
      `✅ ${predefinedMembers.length + generatedMembers.length} Members seeded successfully`,
    );
  } catch (error) {
    await connection.rollback();
    console.error("❌ Members seeding failed:", error);
    throw error;
  }
};

export default seedMembers;
