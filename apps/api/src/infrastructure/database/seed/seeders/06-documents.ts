import { Pool } from "mysql2/promise";
import { generateId, randomInt } from "../helpers/generators";

// apps/api/src/infrastructure/database/seed/seeders/06-documents.ts
export async function seedDocuments(pool: Pool, userData: any) {
  console.log("\n📄 Seeding documents...");

  const documents = [
    {
      title: "Vereinssatzung",
      category: "satzung",
      version: "2.0",
      featured: true,
    },
    { title: "Mitgliedsantrag", category: "formulare", version: "1.2" },
    { title: "Datenschutzerklärung", category: "richtlinien", version: "1.1" },
    {
      title: "Protokoll Mitgliederversammlung 2024",
      category: "protokolle",
      version: "1.0",
    },
    { title: "Event-Leitfaden", category: "guides", version: "1.5" },
  ];

  for (const doc of documents) {
    await pool.execute(
      `INSERT INTO documents (
        id, title, description, category, file_url, file_size,
        file_type, version, status, published_at, is_featured,
        is_public, created_by
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
        doc.featured || false,
        true,
        userData.adminMemberId,
      ],
    );
  }

  console.log(`  ✓ ${documents.length} Documents`);
}
