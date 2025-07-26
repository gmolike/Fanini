// seed/seeders/01-seedRoles.ts
import { Connection, PoolConnection } from "mysql2/promise";
import { PREDEFINED_IDS } from "../helpers/index.js";

const roles = [
  {
    id: PREDEFINED_IDS.roleAdmin,
    name: "ADMIN",
    beschreibung: "Systemadministrator mit vollen Rechten",
    hierarchie_ebene: 0,
  },
  {
    id: PREDEFINED_IDS.roleVorstand,
    name: "VORSTAND",
    beschreibung: "Vereinsvorstand",
    hierarchie_ebene: 1,
  },
  {
    id: PREDEFINED_IDS.roleBeirat,
    name: "BEIRAT",
    beschreibung: "Beiratsmitglied",
    hierarchie_ebene: 2,
  },
  {
    id: "role_kassenprufer",
    name: "KASSENPRUFER",
    beschreibung: "Kassenprüfer",
    hierarchie_ebene: 3,
  },
  {
    id: PREDEFINED_IDS.roleTeamEvent,
    name: "TEAM_EVENT",
    beschreibung: "Event-Team",
    hierarchie_ebene: 4,
  },
  {
    id: PREDEFINED_IDS.roleTeamTechnik,
    name: "TEAM_TECHNIK",
    beschreibung: "Technik-Team",
    hierarchie_ebene: 4,
  },
  {
    id: PREDEFINED_IDS.roleTeamMedien,
    name: "TEAM_MEDIEN",
    beschreibung: "Medien-Team",
    hierarchie_ebene: 4,
  },
  {
    id: PREDEFINED_IDS.roleTeamVerein,
    name: "TEAM_VEREIN",
    beschreibung: "Vereins-Team",
    hierarchie_ebene: 4,
  },
  {
    id: PREDEFINED_IDS.roleMitglied,
    name: "MITGLIED",
    beschreibung: "Vereinsmitglied",
    hierarchie_ebene: 5,
  },
];

const seedRoles = async (
  connection: Connection | PoolConnection,
): Promise<void> => {
  try {
    await connection.beginTransaction();

    // Check if already seeded - Tabelle heißt "roles" nicht "rollen"
    const [existing] = await connection.execute(
      "SELECT COUNT(*) as count FROM roles",
    );
    if ((existing as any)[0].count > 0) {
      console.log("⏭️  Roles already seeded, skipping...");
      await connection.commit();
      return;
    }

    // Insert roles
    for (const role of roles) {
      await connection.execute(
        "INSERT INTO roles (id, name, beschreibung, hierarchie_ebene) VALUES (?, ?, ?, ?)",
        [role.id, role.name, role.beschreibung, role.hierarchie_ebene],
      );
    }

    await connection.commit();
    console.log(`✅ ${roles.length} Roles seeded successfully`);
  } catch (error) {
    await connection.rollback();
    console.error("❌ Roles seeding failed:", error);
    throw error;
  }
};

export default seedRoles;
