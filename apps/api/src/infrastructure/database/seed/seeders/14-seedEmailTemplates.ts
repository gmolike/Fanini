// seed/seeders/14-seedEmailTemplates.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { generateId } from '../helpers';

const templates = [
  {
    titel: 'Willkommens-E-Mail',
    betreff: 'Herzlich Willkommen bei der Faninitiative Spandau!',
    inhalt: `Hallo {{vorname}},

herzlich willkommen in der Faninitiative Spandau e.V.!

Wir freuen uns, dich als neues Mitglied begrüßen zu dürfen. Deine Mitgliedsnummer lautet: {{mitgliedsnummer}}

Erste Schritte:
- Melde dich auf unserer Website an
- Tritt unserer WhatsApp-Gruppe bei
- Komm zum nächsten Monatstreffen am {{naechstes_treffen}}

Bei Fragen melde dich gerne bei uns!

Sportliche Grüße
Dein Vorstand`,
    kategorie: 'MITGLIEDSCHAFT',
    platzhalter: JSON.stringify(['vorname', 'mitgliedsnummer', 'naechstes_treffen']),
    ist_aktiv: true
  },
  {
    titel: 'Event-Anmeldebestätigung',
    betreff: 'Anmeldebestätigung: {{event_name}}',
    inhalt: `Hallo {{vorname}},

deine Anmeldung für "{{event_name}}" am {{event_datum}} wurde bestätigt!

Details:
- Datum: {{event_datum}}
- Uhrzeit: {{event_uhrzeit}}
- Ort: {{event_ort}}
- Treffpunkt: {{treffpunkt}}

Bitte denke an: {{wichtige_hinweise}}

Wir freuen uns auf dich!`,
    kategorie: 'EVENT',
    platzhalter: JSON.stringify([
      'vorname', 'event_name', 'event_datum',
      'event_uhrzeit', 'event_ort', 'treffpunkt', 'wichtige_hinweise'
    ]),
    ist_aktiv: true
  },
  {
    titel: 'Aufgaben-Zuweisung',
    betreff: 'Neue Aufgabe: {{aufgabe_titel}}',
    inhalt: `Hallo {{vorname}},

dir wurde eine neue Aufgabe zugewiesen:

**{{aufgabe_titel}}**

Beschreibung: {{aufgabe_beschreibung}}
Frist: {{aufgabe_frist}}
Priorität: {{aufgabe_prioritaet}}

Bitte kümmere dich zeitnah darum. Bei Fragen wende dich an {{ansprechpartner}}.

Danke für deine Unterstützung!`,
    kategorie: 'AUFGABE',
    platzhalter: JSON.stringify([
      'vorname', 'aufgabe_titel', 'aufgabe_beschreibung',
      'aufgabe_frist', 'aufgabe_prioritaet', 'ansprechpartner'
    ]),
    ist_aktiv: true
  },
  {
    titel: 'Monatlicher Newsletter',
    betreff: 'Spandau Newsletter {{monat}} {{jahr}}',
    inhalt: `# Faninitiative Spandau Newsletter

Hallo {{vorname}},

hier die News aus dem {{monat}}:

## Kommende Events
{{event_liste}}

## Rückblick
{{rueckblick}}

## Wichtige Termine
{{termine}}

Bis bald im Stadion!`,
    kategorie: 'NEWSLETTER',
    platzhalter: JSON.stringify([
      'vorname', 'monat', 'jahr', 'event_liste', 'rueckblick', 'termine'
    ]),
    ist_aktiv: true
  },
  {
    titel: 'Zahlungserinnerung',
    betreff: 'Erinnerung: Mitgliedsbeitrag {{jahr}}',
    inhalt: `Hallo {{vorname}},

freundliche Erinnerung: Der Mitgliedsbeitrag für {{jahr}} in Höhe von {{betrag}}€ steht noch aus.

Bankverbindung:
{{bankverbindung}}

Verwendungszweck: {{verwendungszweck}}

Vielen Dank!`,
    kategorie: 'FINANZEN',
    platzhalter: JSON.stringify([
      'vorname', 'jahr', 'betrag', 'bankverbindung', 'verwendungszweck'
    ]),
    ist_aktiv: false
  }
];

export const seedEmailTemplates = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    for (const template of templates) {
      await connection.execute(
        `INSERT INTO email_vorlagen (
          id, titel, betreff, inhalt, kategorie,
          platzhalter, ist_aktiv
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          generateId('etpl'),
          template.titel,
          template.betreff,
          template.inhalt,
          template.kategorie,
          template.platzhalter,
          template.ist_aktiv
        ]
      );
    }

    await connection.commit();
    console.log(`✅ ${templates.length} Email templates seeded successfully`);
  } catch (error) {
    await connection.rollback();
    console.error('❌ Email templates seeding failed:', error);
    throw error;
  }
};

export default seedEmailTemplates;
