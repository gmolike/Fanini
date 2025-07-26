// apps/api/src/infrastructure/database/seed/seeders/02-usersAndMembers.ts
import { Pool } from "mysql2/promise";
import bcrypt from "bcryptjs";
import { randomElement, generateId, randomInt, randomDate } from "../helpers/generators";
export async function seedUsersAndMembers(pool: Pool, baseData: any) {
  console.log("\n👥 Seeding users and members...");

  const users: any[] = [];
  const memberIds: Record<string, string | Record<string, string> | string[]> = {};

  // Admin
  const adminPassword = await bcrypt.hash("Admin2025!", 12);
  const adminId = generateId();
  const adminMemberId = generateId();

  await pool.execute(
    `INSERT INTO users (
      id, email, vorname, nachname, auth_source, password_hash,
      ist_aktiv, role, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      adminId,
      "admin@fanini-spandau.de",
      "System",
      "Administrator",
      "local",
      adminPassword,
      true,
      "ADMIN",
      adminId,
    ],
  );

  await pool.execute(
    `INSERT INTO mitglieder (
      id, user_id, vorname, nachname, email, mitglied_seit, ist_aktiv,
      hat_vertraulichkeitserklaerung, datenschutz_einwilligung
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      adminMemberId,
      adminId,
      "System",
      "Administrator",
      "admin@fanini-spandau.de",
      new Date(),
      true,
      true,
      true,
    ],
  );

  await pool.execute(
    `INSERT INTO user_roles (user_id, role_id, zugewiesen_von) VALUES (?, ?, ?)`,
    [adminId, "role_admin", adminId],
  );

  memberIds["admin"] = adminMemberId;
  console.log("  ✓ Admin user");

  // Vorstände
  const vorstandPassword = await bcrypt.hash("Vorstand2025!", 12);
  const vorstandData = [
    {
      vorname: "Michael",
      nachname: "Schmidt",
      email: "vorstand1@fanini-spandau.de",
    },
    {
      vorname: "Sandra",
      nachname: "Weber",
      email: "vorstand2@fanini-spandau.de",
    },
    {
      vorname: "Thomas",
      nachname: "Müller",
      email: "vorstand3@fanini-spandau.de",
    },
  ];

  const vorstandMemberIds: string[] = [];
  for (const data of vorstandData) {
    const userId = generateId();
    const memberId = generateId();
    vorstandMemberIds.push(memberId);

    await pool.execute(
      `INSERT INTO users (
        id, email, vorname, nachname, auth_source, password_hash,
        ist_aktiv, role, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        data.email,
        data.vorname,
        data.nachname,
        "easyverein",
        vorstandPassword,
        true,
        "VORSTAND",
        adminId,
      ],
    );

    await pool.execute(
      `INSERT INTO mitglieder (
        id, user_id, vorname, nachname, email, telefon,
        mitgliedsnummer, easyverein_id, mitglied_seit, ist_aktiv,
        hat_vertraulichkeitserklaerung, datenschutz_einwilligung,
        sichtbarkeit_email, sichtbarkeit_telefon
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        memberId,
        userId,
        data.vorname,
        data.nachname,
        data.email,
        `0170-${randomInt(1000000, 9999999)}`,
        `V${randomInt(1000, 9999)}`,
        `EV${randomInt(10000, 99999)}`,
        randomDate(new Date(2015, 0, 1), new Date(2020, 11, 31)),
        true,
        true,
        true,
        "vorstand",
        "vorstand",
      ],
    );

    await pool.execute(
      `INSERT INTO user_roles (user_id, role_id, zugewiesen_von) VALUES (?, ?, ?)`,
      [userId, "role_vorstand", adminId],
    );
  }
  memberIds["vorstand"] = vorstandMemberIds;
  console.log(`  ✓ ${vorstandData.length} Vorstand members`);

  // Team Leaders
  const teamPassword = await bcrypt.hash("Team2025!", 12);
  const teams = [
    { key: "event", vorname: "Lisa", nachname: "Wagner", role: "TEAM_EVENT" },
    {
      key: "medien",
      vorname: "Felix",
      nachname: "Becker",
      role: "TEAM_MEDIEN",
    },
    {
      key: "technik",
      vorname: "Julia",
      nachname: "Hoffmann",
      role: "TEAM_TECHNIK",
    },
    {
      key: "verein",
      vorname: "Markus",
      nachname: "Klein",
      role: "TEAM_VEREIN",
    },
  ];

  const teamMemberIds: Record<string, string> = {};
  for (const team of teams) {
    const userId = generateId();
    const memberId = generateId();
    teamMemberIds[team.key] = memberId;

    await pool.execute(
      `INSERT INTO users (
        id, email, vorname, nachname, auth_source, password_hash,
        ist_aktiv, role, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        `${team.key}@fanini-spandau.de`,
        team.vorname,
        team.nachname,
        "easyverein",
        teamPassword,
        true,
        team.role,
        adminId,
      ],
    );

    await pool.execute(
      `INSERT INTO mitglieder (
        id, user_id, vorname, nachname, email, telefon,
        mitgliedsnummer, easyverein_id, mitglied_seit, ist_aktiv,
        hat_vertraulichkeitserklaerung, datenschutz_einwilligung
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        memberId,
        userId,
        team.vorname,
        team.nachname,
        `${team.key}@fanini-spandau.de`,
        `0171-${randomInt(1000000, 9999999)}`,
        `T${randomInt(1000, 9999)}`,
        `EV${randomInt(10000, 99999)}`,
        randomDate(new Date(2018, 0, 1), new Date(2022, 11, 31)),
        true,
        true,
        true,
      ],
    );

    await pool.execute(
      `INSERT INTO user_roles (user_id, role_id, zugewiesen_von) VALUES (?, ?, ?)`,
      [userId, `role_team_${team.key}`, adminId],
    );
  }
  memberIds["teams"] = teamMemberIds;
  console.log(`  ✓ ${teams.length} Team leaders`);

  // Regular Members
  const memberPassword = await bcrypt.hash("Mitglied2025!", 12);
  const regularMembers = [
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

  const regularMemberIds: string[] = [];
  for (const data of regularMembers) {
    const userId = generateId();
    const memberId = generateId();
    regularMemberIds.push(memberId);
    const email = `${data.vorname.toLowerCase()}.${data.nachname.toLowerCase()}@example.com`;

    await pool.execute(
      `INSERT INTO users (
        id, email, vorname, nachname, mitgliedsnummer, auth_source,
        password_hash, ist_aktiv, role, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        email,
        data.vorname,
        data.nachname,
        `M${randomInt(1000, 9999)}`,
        "easyverein",
        memberPassword,
        true,
        "MITGLIED",
        adminId,
      ],
    );

    await pool.execute(
      `INSERT INTO mitglieder (
        id, user_id, vorname, nachname, email, telefon, mitgliedsnummer,
        easyverein_id, mitglied_seit, ist_aktiv, hat_vertraulichkeitserklaerung,
        datenschutz_einwilligung, sichtbarkeit_email, sichtbarkeit_telefon,
        geburtsdatum, adresse_strasse, adresse_hausnummer, adresse_plz, adresse_stadt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        memberId,
        userId,
        data.vorname,
        data.nachname,
        email,
        data.telefon,
        `M${randomInt(1000, 9999)}`,
        `EV${randomInt(10000, 99999)}`,
        randomDate(new Date(2019, 0, 1), new Date(2024, 11, 31)),
        true,
        randomInt(1, 10) > 2,
        true,
        randomElement(["intern", "privat"]),
        "privat",
        randomDate(new Date(1970, 0, 1), new Date(2005, 11, 31)),
        randomElement(["Hauptstraße", "Berliner Straße", "Schulstraße"]),
        randomInt(1, 200).toString(),
        "13587",
        "Berlin-Spandau",
      ],
    );

    await pool.execute(
      `INSERT INTO user_roles (user_id, role_id, zugewiesen_von) VALUES (?, ?, ?)`,
      [userId, "role_mitglied", adminId],
    );
  }
  memberIds["regular"] = regularMemberIds;
  console.log(`  ✓ ${regularMembers.length} Regular members`);

  // All member IDs for easy access
  const allMemberIds = [
    adminMemberId,
    ...vorstandMemberIds,
    ...Object.values(teamMemberIds),
    ...regularMemberIds,
  ];

  return {
    adminId,
    adminMemberId,
    vorstandMemberIds,
    teamMemberIds,
    regularMemberIds,
    allMemberIds,
    memberIds,
  };
}
