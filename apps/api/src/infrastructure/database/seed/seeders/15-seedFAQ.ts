// seed/seeders/15-seedFAQ.ts
import { Connection, PoolConnection } from "mysql2/promise";
import { generateId } from "../helpers";

const faqItems = [
  {
    question: "Wie werde ich Mitglied?",
    answer:
      "Du kannst dich online über unsere Website anmelden oder das Formular beim nächsten Heimspiel ausfüllen. Der Jahresbeitrag beträgt 60€.",
    category: "mitgliedschaft",
    order_position: 1,
    is_popular: true,
  },
  {
    question: "Wie melde ich mich für Auswärtsfahrten an?",
    answer:
      'Nach dem Login findest du alle geplanten Fahrten unter "Events". Einfach auf "Anmelden" klicken. Die Plätze werden nach Eingang vergeben.',
    category: "events",
    order_position: 2,
    is_popular: true,
  },
  {
    question: "Was kostet eine Auswärtsfahrt?",
    answer:
      "Die Preise variieren je nach Entfernung. Meist zwischen 15-35€ für Busfahrt und Eintritt. Mitglieder erhalten 5€ Rabatt.",
    category: "events",
    order_position: 3,
    is_popular: false,
  },
  {
    question: "Wo treffen wir uns vor Heimspielen?",
    answer:
      "Unser Fantreff ist 2 Stunden vor Anpfiff am Vereinsheim geöffnet. Von dort gehen wir gemeinsam zum Stadion.",
    category: "verein",
    order_position: 4,
    is_popular: true,
  },
  {
    question: "Kann ich als Creator meine Werke zeigen?",
    answer:
      "Ja! Melde dich bei unserem Medien-Team. Nach Freischaltung kannst du dein Portfolio präsentieren.",
    category: "verein",
    order_position: 5,
    is_popular: false,
  },
  {
    question: "Wie kann ich mich einbringen?",
    answer:
      "Wir suchen immer Unterstützung! Komm zum Monatstreffen oder melde dich bei einem der Teams (Event, Medien, Technik).",
    category: "verein",
    order_position: 6,
    is_popular: true,
  },
  {
    question: "Gibt es eine WhatsApp-Gruppe?",
    answer:
      "Ja, für Mitglieder gibt es eine Gruppe für kurzfristige Infos. Den Link erhältst du nach der Anmeldung.",
    category: "verein",
    order_position: 7,
    is_popular: false,
  },
  {
    question: "Wo finde ich Fanartikel?",
    answer:
      "Schals, Shirts und mehr gibt es bei Heimspielen am Fanstand oder über unseren Online-Shop.",
    category: "verein",
    order_position: 8,
    is_popular: false,
  },
  {
    question: "Wie läuft das mit dem LoL-Team?",
    answer:
      "Unser League of Legends Team trainiert zweimal wöchentlich. Bei Interesse melde dich bei @SpandauEsports.",
    category: "verein",
    order_position: 9,
    is_popular: false,
  },
  {
    question: "Kann ich Gäste zu Events mitbringen?",
    answer:
      "Bei öffentlichen Events gerne! Bei Mitglieder-Events bitte vorher anfragen, oft sind 1-2 Gäste möglich.",
    category: "events",
    order_position: 10,
    is_popular: false,
  },
  {
    question: "Wie funktioniert die Kostenerstattung?",
    answer:
      "Ausgaben für den Verein können über das Portal eingereicht werden. Belege hochladen, Formular ausfüllen, fertig!",
    category: "verein",
    order_position: 11,
    is_popular: false,
  },
  {
    question: "Wann ist das nächste Monatstreffen?",
    answer:
      "Immer am ersten Mittwoch im Monat um 19:00 Uhr im Vereinsheim. Termine findest du im Kalender.",
    category: "verein",
    order_position: 12,
    is_popular: true,
  },
];

export const seedFAQ = async (
  connection: Connection | PoolConnection,
): Promise<void> => {
  try {
    await connection.beginTransaction();

    for (const item of faqItems) {
      await connection.execute(
        `INSERT INTO faqs (
          id, question, answer, category, order_position, is_popular, views
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          generateId("faq"),
          item.question,
          item.answer,
          item.category,
          item.order_position,
          item.is_popular,
          0, // views startet bei 0
        ],
      );
    }

    await connection.commit();
    console.log(`✅ ${faqItems.length} FAQ items seeded successfully`);
  } catch (error) {
    await connection.rollback();
    console.error("❌ FAQ seeding failed:", error);
    throw error;
  }
};

export default seedFAQ;
