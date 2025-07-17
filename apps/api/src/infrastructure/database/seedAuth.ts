// apps/api/src/infrastructure/database/seedAuth.ts
import { pool } from "./connection";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const seedAuthData = async () => {
  console.log("🔐 Creating auth seed data...");

  try {
    // Admin User mit sicherem Passwort
    const adminPassword =
      process.env.ADMIN_PASSWORD || "FaniniAdmin2025!Secure#123";
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    const adminId = generateId();

    // Prüfe ob User bereits existiert
    const [existing] = await pool.query(
      "SELECT id, email FROM users WHERE email = ?",
      ["admin@fanini-spandau.de"],
    );

    if (existing && existing[0]) {
      console.log("🔄 Admin user already exists, updating password...");

      // Update existing user
      await pool.query(
        `UPDATE users
         SET password_hash = ?, auth_source = 'local', ist_aktiv = 1
         WHERE email = ?`,
        [passwordHash, "admin@fanini-spandau.de"],
      );

      // Use existing user ID for role assignment
      await pool.query(
        `INSERT INTO user_roles (user_id, role_id, zugewiesen_von)
         VALUES (?, 'role_admin', ?)
         ON DUPLICATE KEY UPDATE zugewiesen_am = NOW()`,
        [existing[0].id, existing[0].id],
      );
    } else {
      console.log("🆕 Creating new admin user...");

      // Create new user
      await pool.query(
        `INSERT INTO users
         (id, email, vorname, nachname, auth_source, password_hash, ist_aktiv, erstellt_am, aktualisiert_am)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          adminId,
          "admin@fanini-spandau.de",
          "System",
          "Administrator",
          "local",
          passwordHash,
          1,
        ],
      );

      // Assign admin role
      await pool.query(
        `INSERT INTO user_roles (user_id, role_id, zugewiesen_von, zugewiesen_am)
         VALUES (?, 'role_admin', ?, NOW())`,
        [adminId, adminId],
      );
    }

    // Verifiziere dass der User wirklich existiert
    const [verification] = await pool.query(
      `SELECT u.id, u.email, u.auth_source, u.ist_aktiv,
              (u.password_hash IS NOT NULL) as has_password,
              GROUP_CONCAT(ur.role_id) as roles
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       WHERE u.email = ?
       GROUP BY u.id`,
      ["admin@fanini-spandau.de"],
    );

    if (verification && verification[0]) {
      console.log("✅ Admin user verified:");
      console.log("📧 Email:", verification[0].email);
      console.log("🔐 Auth Source:", verification[0].auth_source);
      console.log("✔️  Active:", verification[0].ist_aktiv === 1);
      console.log("🔑 Has Password:", verification[0].has_password === 1);
      console.log("👤 Roles:", verification[0].roles);
      console.log("\n📝 Login credentials:");
      console.log("   Email: admin@fanini-spandau.de");
      console.log("   Password:", adminPassword);
      console.log("\n⚠️  CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN!");
    } else {
      throw new Error("Failed to verify admin user creation");
    }
  } catch (error) {
    console.error("❌ Auth seed failed:", error);
    throw error;
  } finally {
    // Wichtig: Connection beenden
    await pool.end();
    console.log("🔌 Database connection closed");
  }
};

// Führe die Funktion aus wenn direkt aufgerufen
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedAuthData()
    .then(() => {
      console.log("✅ Seed completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seed failed:", error);
      process.exit(1);
    });
}

export { seedAuthData };
