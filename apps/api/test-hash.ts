// apps/api/test-hash.ts
import bcrypt from "bcryptjs";

async function generateHash() {
  const password = "FaniniAdmin2025!Secure#123";
  const hash = await bcrypt.hash(password, 12);
  console.log("Password:", password);
  console.log("Hash:", hash);

  // Test ob es funktioniert
  const isValid = await bcrypt.compare(password, hash);
  console.log("Verification:", isValid);
}

generateHash();
