// seed/seeders/15-seedFAQ.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { generateId } from '../helpers';

const faqItems = [
  {
    frage: 'Wie werde ich Mitglied?',
    antwort: 'Du kannst dich online über unsere Website anmelden oder das Formular beim nächsten Heimspiel ausfüllen. Der Jahresbeitrag beträgt 60€.',
    kategorie: 'MITGLIEDSCHAFT',
    reihenfolge: 1
  },
  {
    frage: 'Wie melde ich mich für Auswärtsfahrten an?',
    antwort: 'Nach dem Login findest du alle geplanten Fahrten unter "Events". Einfach auf "Anmelden" klicken. Die Plätze werden nach Eingang vergeben.',
    kategorie: 'EVENTS',
    reihenfolge: 2
  },
  {
    frage: 'Was kostet eine Auswärtsfahrt?',
    antwort: 'Die Preise variieren je nach Entfernung. Meist zwischen 15-35€ für Busfahrt und Eintritt. Mitglieder erhalten 5€ Rabatt.',
    kategorie: 'EVENTS',
    reihenfolge: 3
  },
  {
    frage: 'Wo treffen wir uns vor Heimspielen?',
    antwort: 'Unser Fantreff ist 2 Stunden vor Anpfiff am Vereinsheim geöffnet. Von dort gehen wir gemeinsam zum Stadion.',
    kategorie: 'HEIMSPIELE',
    reihenfolge: 4
  },
  {
    frage: 'Kann ich als Creator meine Werke zeigen?',
    antwort: 'Ja! Melde dich bei unserem Medien-Team. Nach Freischaltung kannst du dein Portfolio präsentieren.',
    kategorie: 'CREATOR',
    reihenfolge: 5
  },
  {
    frage: 'Wie kann ich mich einbringen?',
    antwort: 'Wir suchen immer Unterstützung! Komm zum Monatstreffen oder melde dich bei einem der Teams (Event, Medien, Technik).',
    kategorie: 'MITMACHEN',
    reihenfolge: 6
  },
  {
    frage: 'Gibt es eine WhatsApp-Gruppe?',
    antwort: 'Ja, für Mitglieder gibt es eine Gruppe für kurzfristige Infos. Den Link erhältst du nach der Anmeldung.',
    kategorie: 'KOMMUNIKATION',
    reihenfolge: 7
  },
  {
    frage: 'Wo finde ich Fanartikel?',
    antwort: 'Schals, Shirts und mehr gibt es bei Heimspielen am Fanstand oder über unseren Online-Shop.',
    kategorie: 'FANSHOP',
    reihenfolge: 8
  },
  {
    frage: 'Wie läuft das mit dem LoL-Team?',
    antwort: 'Unser League of Legends Team trainiert zweimal wöchentlich. Bei Interesse melde dich bei @SpandauEsports.',
    kategorie: 'ESPORTS',
    reihenfolge: 9
  },
  {
    frage: 'Kann ich Gäste zu Events mitbringen?',
    antwort: 'Bei öffentlichen Events gerne! Bei Mitglieder-Events bitte vorher anfragen, oft sind 1-2 Gäste möglich.',
    kategorie: 'EVENTS',
    reihenfolge: 10
  },
  {
    frage: 'Wie funktioniert die Kostenerstattung?',
    antwort: 'Ausgaben für den Verein können über das Portal eingereicht werden. Belege hochladen, Formular ausfüllen, fertig!',
    kategorie: 'FINANZEN',
    reihenfolge: 11
  },
  {
    frage: 'Wann ist das nächste Monatstreffen?',
    antwort: 'Immer am ersten Mittwoch im Monat um 19:00 Uhr im Vereinsheim. Termine findest du im Kalender.',
    kategorie: 'VEREINSLEBEN',
    reihenfolge: 12
  }
];

export const seedFAQ = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    // Create FAQ table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS faq (
        id VARCHAR(255) PRIMARY KEY,
        frage TEXT NOT NULL,
        antwort TEXT NOT NULL,
        kategorie VARCHAR(50),
        reihenfolge INT DEFAULT 0,
        ist_aktiv BOOLEAN DEFAULT true,
        erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    for (const item of faqItems) {
      await connection.execute(
        `INSERT INTO faq (
          id, frage, antwort, kategorie, reihenfolge, ist_aktiv
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          generateId('faq'),
          item.frage,
          item.antwort,
          item.kategorie,
          item.reihenfolge,
          true
        ]
      );
    }

    await connection.commit();
    console.log(`✅ ${faqItems.length} FAQ items seeded successfully`);
  } catch (error) {
    await connection.rollback();
    console.error('❌ FAQ seeding failed:', error);
    throw error;
  }
};

export default seedFAQ;
