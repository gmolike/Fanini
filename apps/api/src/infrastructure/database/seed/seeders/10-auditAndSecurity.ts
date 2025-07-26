import { Pool } from "mysql2/promise";
import { generateId, randomElement, randomInt } from "../helpers/generators";

// apps/api/src/infrastructure/database/seed/seeders/10-auditAndSecurity.ts
export async function seedAuditAndSecurity(pool: Pool, userData: any) {
  console.log("\n🔒 Seeding audit and security data...");

  // Some sample audit logs
  const auditActions = ['login', 'view_member', 'export_data', 'create_event'];

  for (let i = 0; i < 20; i++) {
    await pool.execute(
      `INSERT INTO field_access_log (
        id, user_id, entity_type, entity_id, field_name,
        action, ip_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        generateId(),
        randomElement(userData.allMemberIds),
        'mitglieder',
        randomElement(userData.allMemberIds),
        randomElement(['email', 'telefon', 'geburtsdatum']),
        randomElement(['view', 'export']),
        `192.168.1.${randomInt(1, 255)}`
      ]
    );
  }

  console.log("  ✓ Field access logs");
  console.log("  ✓ Security setup complete");
}
