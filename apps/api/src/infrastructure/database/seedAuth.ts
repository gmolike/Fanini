// infrastructure/database/seedAuth.ts
import { pool } from "./connection";
import bcrypt from "bcryptjs";
import { generateId } from "@faninitiative/shared";

const seedAuthData = async () => {
  console.log("🔐 Creating auth seed data...");

  try {
    // Admin User mit sicherem Passwort
    const adminPassword = process.env.ADMIN_PASSWORD || "FaniniAdmin2025!Secure#123";
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    const adminId = generateId();

    // Admin User erstellen
    await pool.query(
      `INSERT INTO users
       (id, email, vorname, nachname, auth_source, password_hash, ist_aktiv)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      [
        adminId,
        'admin@fanini-spandau.de',
        'System',
        'Administrator',
        'local',
        passwordHash,
        true
      ]
    );

    // Admin Rolle zuweisen
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, zugewiesen_von)
       VALUES (?, 'role_admin', ?)
       ON DUPLICATE KEY UPDATE zugewiesen_am = NOW()`,
      [adminId, adminId]
    );

    console.log("✅ Admin user created");
    console.log("📧 Email: admin@fanini-spandau.de");
    console.log("🔑 Password:", adminPassword);
    console.log("⚠️  CHANGE THIS PASSWORD IMMEDIATELY!");

  } catch (error) {
    console.error("❌ Auth seed failed:", error);
    throw error;
  }
};

export { seedAuthData };
