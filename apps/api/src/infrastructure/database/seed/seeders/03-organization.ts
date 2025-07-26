// apps/api/src/infrastructure/database/seed/seeders/03-organization.ts
import { Pool } from "mysql2/promise";
import { generateId } from "../helpers/generators";
export async function seedOrganization(pool: Pool, userData: any) {
  console.log("\n🏛️ Seeding organization structure...");

  // Gremien
  const gremien = [
    {
      type: "vorstand",
      name: "Vorstand",
      description:
        "Der Vorstand führt die Geschäfte des Vereins und vertritt ihn nach außen.",
      short_description: "Vereinsführung und Repräsentation",
      gradient: "from-blue-600 to-blue-800",
      meeting_schedule: "Jeden ersten Montag im Monat um 19:00 Uhr",
      contact_email: "vorstand@fanini-spandau.de",
      memberIds: userData.vorstandMemberIds,
    },
    {
      type: "beirat",
      name: "Beirat",
      description: "Der Beirat berät den Vorstand in strategischen Fragen.",
      short_description: "Strategische Beratung",
      gradient: "from-green-600 to-green-800",
      meeting_schedule: "Quartalsweise",
      contact_email: "beirat@fanini-spandau.de",
      memberIds: [],
    },
    {
      type: "team_event",
      name: "Team Event",
      description: "Organisation und Durchführung von Vereinsveranstaltungen.",
      short_description: "Eventorganisation",
      gradient: "from-purple-600 to-purple-800",
      meeting_schedule: "Nach Bedarf",
      contact_email: "event@fanini-spandau.de",
      memberIds: [userData.teamMemberIds.event],
    },
    {
      type: "team_medien",
      name: "Team Medien",
      description:
        "Social Media, Content-Erstellung und Öffentlichkeitsarbeit.",
      short_description: "Medien & PR",
      gradient: "from-pink-600 to-pink-800",
      meeting_schedule: "Wöchentlich",
      contact_email: "medien@fanini-spandau.de",
      memberIds: [userData.teamMemberIds.medien],
    },
  ];

  const gremiumIds: Record<string, string> = {};

  for (const gremium of gremien) {
    const gremiumId = generateId();
    gremiumIds[gremium.type] = gremiumId;

    await pool.execute(
      `INSERT INTO gremien (
        id, type, name, description, short_description, gradient,
        meeting_schedule, contact_email, established_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        gremiumId,
        gremium.type,
        gremium.name,
        gremium.description,
        gremium.short_description,
        gremium.gradient,
        gremium.meeting_schedule,
        gremium.contact_email,
        new Date(2025, 0, 1),
      ],
    );

    // Add members
    let position = 0;
    for (const memberId of gremium.memberIds) {
      const memberData = await pool.execute(
        "SELECT vorname, nachname, email FROM mitglieder WHERE id = ?",
        [memberId],
      );
      const member = (memberData[0] as any)[0];

      if (member) {
        await pool.execute(
          `INSERT INTO gremium_members (
            id, gremium_id, name, role, email, member_since, order_position
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            generateId(),
            gremiumId,
            `${member.vorname} ${member.nachname}`,
            position === 0 ? "Leitung" : "Mitglied",
            member.email,
            new Date(2025, 0, 1),
            position++,
          ],
        );
      }
    }
  }

  console.log(`  ✓ ${gremien.length} Gremien with members`);

  return { gremiumIds };
}
