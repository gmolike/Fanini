// seed/seeders/09-seedDocuments.ts
import { Connection, PoolConnection } from "mysql2/promise";
import { generateId, PREDEFINED_IDS } from "../helpers/index.js";

const documents = [
  {
    title: "Vereinssatzung",
    category: "satzung",
    description: "Aktuelle Satzung des Vereins",
    file_url: "https://storage.example.com/docs/satzung.pdf",
    file_size: 245678,
    file_type: "application/pdf",
    version: "1.0",
    status: "current",
    is_public: true,
    is_featured: true,
  },
  {
    title: "Datenschutzerklärung",
    category: "richtlinien",
    description: "DSGVO-konforme Datenschutzerklärung",
    file_url: "https://storage.example.com/docs/datenschutz.pdf",
    file_size: 189234,
    file_type: "application/pdf",
    version: "2.1",
    status: "current",
    is_public: true,
    is_featured: false,
  },
  {
    title: "Mitgliedsantrag",
    category: "formulare",
    description: "Formular für neue Mitglieder",
    file_url: "https://storage.example.com/docs/mitgliedsantrag.pdf",
    file_size: 145678,
    file_type: "application/pdf",
    version: "3.0",
    status: "current",
    is_public: true,
    is_featured: true,
  },
  {
    title: "Verhaltenskodex Auswärtsfahrten",
    category: "richtlinien",
    description: "Regeln für gemeinsame Auswärtsfahrten",
    file_url: "https://storage.example.com/docs/verhaltenskodex.pdf",
    file_size: 98765,
    file_type: "application/pdf",
    version: "1.2",
    status: "current",
    is_public: false,
    is_featured: false,
  },
  {
    title: "Finanzordnung",
    category: "satzung",
    description: "Finanzielle Richtlinien des Vereins",
    file_url: "https://storage.example.com/docs/finanzordnung.pdf",
    file_size: 178234,
    file_type: "application/pdf",
    version: "1.5",
    status: "current",
    is_public: false,
    is_featured: false,
  },
  {
    title: "Protokoll JHV 2024",
    category: "protokolle",
    description: "Protokoll der Jahreshauptversammlung 2024",
    file_url: "https://storage.example.com/docs/jhv_2024.pdf",
    file_size: 234567,
    file_type: "application/pdf",
    version: "1.0",
    status: "current",
    is_public: false,
    is_featured: false,
  },
  {
    title: "Creator Guidelines",
    category: "guides",
    description: "Richtlinien für Content Creator",
    file_url: "https://storage.example.com/docs/creator_guidelines.pdf",
    file_size: 156789,
    file_type: "application/pdf",
    version: "2.0",
    status: "current",
    is_public: true,
    is_featured: true,
  },
];

const seedDocuments = async (
  connection: Connection | PoolConnection,
): Promise<void> => {
  try {
    await connection.beginTransaction();

    for (const doc of documents) {
      await connection.execute(
        `INSERT INTO documents (
          id, title, description, category, file_url, file_size,
          file_type, version, status, published_at, is_public,
          is_featured, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)`,
        [
          generateId("doc"),
          doc.title,
          doc.description,
          doc.category,
          doc.file_url,
          doc.file_size,
          doc.file_type,
          doc.version,
          doc.status,
          doc.is_public,
          doc.is_featured,
          "mbr_vorstand1",
        ],
      );
    }

    await connection.commit();
    console.log(`✅ ${documents.length} Documents seeded successfully`);
  } catch (error) {
    await connection.rollback();
    console.error("❌ Documents seeding failed:", error);
    throw error;
  }
};

export default seedDocuments;
