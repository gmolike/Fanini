import { Pool } from "mysql2/promise";
import { generateId, randomInt } from "../helpers/generators";
// apps/api/src/infrastructure/database/seed/seeders/07-creators.ts
export async function seedCreators(pool: Pool, userData: any) {
  console.log("\n🎨 Seeding creators...");

  const creators = [
    {
      name: "Alex Storm",
      types: ["grafik", "video"],
      memberId: userData.regularMemberIds[5],
    },
    {
      name: "Sarah Vision",
      types: ["foto", "video"],
      memberId: userData.regularMemberIds[6],
    },
    {
      name: "Max Creative",
      types: ["grafik", "musik"],
      memberId: userData.regularMemberIds[7],
    },
  ];

  for (const creator of creators) {
    const creatorId = generateId();
    const member = await pool.execute(
      "SELECT vorname, nachname FROM mitglieder WHERE id = ?",
      [creator.memberId],
    );
    const memberData = (member[0] as any)[0];

    await pool.execute(
      `INSERT INTO creators (
        id, member_id, artist_name, real_name, description, portfolio,
        is_active, active_since, instagram, website
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        creatorId,
        creator.memberId,
        creator.name,
        `${memberData.vorname} ${memberData.nachname}`,
        `${creator.name} ist ein talentierter Creator`,
        `https://portfolio.${creator.name.toLowerCase().replace(/ /g, "")}.com`,
        true,
        new Date(2023, randomInt(0, 11), randomInt(1, 28)),
        `@${creator.name.toLowerCase().replace(/ /g, "")}`,
        `https://${creator.name.toLowerCase().replace(/ /g, "")}.com`,
      ],
    );

    // Add creator types
    for (const type of creator.types) {
      await pool.execute(
        `INSERT INTO creator_types (creator_id, type) VALUES (?, ?)`,
        [creatorId, type],
      );
    }
  }

  console.log(`  ✓ ${creators.length} Creators`);
}
