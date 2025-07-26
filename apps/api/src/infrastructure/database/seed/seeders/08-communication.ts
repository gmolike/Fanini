import { Pool } from "mysql2/promise";
import { generateId } from "../helpers/generators";
// apps/api/src/infrastructure/database/seed/seeders/08-communication.ts
export async function seedCommunication(pool: Pool, userData: any) {
  console.log("\n💬 Seeding communication data...");

  // FAQs
  const faqs = [
    { question: "Wie werde ich Mitglied?", category: "mitgliedschaft" },
    { question: "Was kostet die Mitgliedschaft?", category: "mitgliedschaft" },
    { question: "Wie kann ich mich für Events anmelden?", category: "events" },
    { question: "Wer kann Creator werden?", category: "verein" },
    { question: "Wie logge ich mich ein?", category: "technik" },
  ];

  for (let i = 0; i < faqs.length; i++) {
    await pool.execute(
      `INSERT INTO faqs (id, question, answer, category, order_position)
       VALUES (?, ?, ?, ?, ?)`,
      [
        generateId(),
        faqs[i].question,
        `Hier ist die ausführliche Antwort auf: ${faqs[i].question}`,
        faqs[i].category,
        i + 1,
      ],
    );
  }
  console.log(`  ✓ ${faqs.length} FAQs`);

  // Newsletter
  const newsletterId = generateId();
  await pool.execute(
    `INSERT INTO newsletters (
      id, edition, title, subtitle, published_at, status,
      introduction, closing_message
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newsletterId,
      1,
      "Fanini Newsletter Januar 2025",
      "Neues Jahr, neue Events!",
      new Date(),
      "published",
      "Willkommen zur ersten Ausgabe!",
      "Bis zum nächsten Mal!",
    ],
  );

  // Newsletter Subscriptions
  const subscribers = 5;
  for (let i = 0; i < subscribers; i++) {
    await pool.execute(
      `INSERT INTO newsletter_subscriptions (
        id, email, first_name, confirmed_at
      ) VALUES (?, ?, ?, ?)`,
      [
        generateId(),
        `subscriber${i + 1}@example.com`,
        ["Max", "Anna", "Tom", "Lisa", "Paul"][i],
        new Date(),
      ],
    );
  }
  console.log(`  ✓ Newsletter with ${subscribers} subscribers`);
}
