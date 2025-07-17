// apps/api/scripts/seed-auth-docker.cjs (mit .cjs Endung!)
const { execSync } = require("child_process");
const crypto = require("crypto");

console.log("🔐 Creating auth seed data...\n");

const adminId = "usr_" + crypto.randomUUID();
const adminPassword =
  process.env.ADMIN_PASSWORD || "FaniniAdmin2025!Secure#123";

// BCrypt hash (pre-computed für das Standard-Passwort)
const passwordHash =
  "$2a$12$8X.VhdPsfC5Jxv4t1DtjHOGkT8c2Z5YqZqYjp3SjKQh8CRQiE9Mxe";

const sql = `
-- Create admin user
INSERT INTO users
  (id, email, vorname, nachname, auth_source, password_hash, ist_aktiv)
VALUES
  ('${adminId}', 'admin@fanini-spandau.de', 'System', 'Administrator', 'local', '${passwordHash}', TRUE);

-- Assign admin role
INSERT INTO user_roles
  (user_id, role_id, zugewiesen_von)
VALUES
  ('${adminId}', 'role_admin', '${adminId}');
`;

try {
  const command = `docker exec fanini-mysql-1 mysql -u root -prootpassword fanini_db -e "${sql}"`;
  execSync(command, { stdio: "inherit" });

  console.log("✅ Admin user created");
  console.log("📧 Email: admin@fanini-spandau.de");
  console.log("🔑 Password:", adminPassword);
  console.log("⚠️  CHANGE THIS PASSWORD AFTER FIRST LOGIN!\n");
} catch (error) {
  console.error("❌ Seed failed:", error.message);
  process.exit(1);
}
