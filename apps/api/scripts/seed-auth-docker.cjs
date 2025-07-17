// apps/api/scripts/seed-auth-docker.cjs
const { execSync } = require("child_process");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

async function seedAuth() {
  console.log("🔐 Creating auth seed data...\n");

  const adminId = "usr_" + crypto.randomUUID();
  const adminPassword =
    process.env.ADMIN_PASSWORD || "FaniniAdmin2025!Secure#123";

  // Generiere den Hash dynamisch
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  // Escape single quotes für SQL
  const escapedHash = passwordHash.replace(/'/g, "\\'");

  const sql = `
-- Check if admin exists
SET @admin_exists = (SELECT COUNT(*) FROM users WHERE email = 'admin@fanini-spandau.de');

-- Update or Insert
INSERT INTO users
  (id, email, vorname, nachname, auth_source, password_hash, ist_aktiv, erstellt_am, aktualisiert_am)
VALUES
  ('${adminId}', 'admin@fanini-spandau.de', 'System', 'Administrator', 'local', '${escapedHash}', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  auth_source = 'local',
  ist_aktiv = 1,
  aktualisiert_am = NOW();

-- Get the user ID (either new or existing)
SET @user_id = (SELECT id FROM users WHERE email = 'admin@fanini-spandau.de');

-- Assign admin role
INSERT INTO user_roles
  (user_id, role_id, zugewiesen_von, zugewiesen_am)
VALUES
  (@user_id, 'role_admin', @user_id, NOW())
ON DUPLICATE KEY UPDATE
  zugewiesen_am = NOW();
`;

  try {
    const command = `docker exec fanini-mysql-1 mysql -u fanini -ppassword fanini_db -e "${sql}"`;
    execSync(command, { stdio: "inherit" });

    console.log("✅ Admin user created/updated");
    console.log("📧 Email: admin@fanini-spandau.de");
    console.log("🔑 Password:", adminPassword);
    console.log("⚠️  CHANGE THIS PASSWORD AFTER FIRST LOGIN!\n");
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
}

// Führe async function aus
seedAuth();
