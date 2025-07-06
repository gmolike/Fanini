// frontend/src/testing/mocks/db/seeds/faq.seed.ts
import type { FaqItem } from '@/entities/public/faq';

export const FAQ_DATA: FaqItem[] = [
  // Mitgliedschaft
  {
    id: 'faq-1',
    question: 'Wie werde ich Mitglied bei der Faninitiative Spandau?',
    answer:
      'Die Mitgliedschaft kannst du ganz einfach über unser Online-Formular beantragen. Nach dem Ausfüllen erhältst du eine Bestätigungsmail und wirst zur Zahlung des Mitgliedsbeitrags weitergeleitet. Sobald der Beitrag eingegangen ist und deine Daten über EasyVerein verifiziert wurden, bist du offizielles Mitglied!',
    category: 'mitgliedschaft',
    order: 1,
    views: 342,
    isPopular: true,
    tags: ['anmeldung', 'beitritt', 'mitglied werden'],
    updatedAt: '2025-06-15T10:00:00Z',
  },
  {
    id: 'faq-2',
    question: 'Wie hoch ist der Mitgliedsbeitrag?',
    answer:
      'Der reguläre Mitgliedsbeitrag beträgt 5€ pro Monat (60€ jährlich). Für Schüler, Studenten und Auszubildende gibt es einen ermäßigten Beitrag von 3€ pro Monat (36€ jährlich). Die Zahlung erfolgt jährlich im Voraus.',
    category: 'mitgliedschaft',
    order: 2,
    views: 298,
    isPopular: true,
    relatedFaqIds: ['faq-1', 'faq-3'],
    tags: ['beitrag', 'kosten', 'gebühren'],
    updatedAt: '2025-01-20T14:30:00Z',
  },
  {
    id: 'faq-3',
    question: 'Welche Vorteile habe ich als Mitglied?',
    answer:
      'Als Mitglied erhältst du Zugang zum internen Mitgliederbereich, kannst an exklusiven Events teilnehmen, bei Vereinsentscheidungen mitbestimmen und bekommst Rabatte bei Fanartikeln. Außerdem kannst du dich in unseren Teams engagieren und die Vereinsarbeit aktiv mitgestalten.',
    category: 'mitgliedschaft',
    order: 3,
    views: 256,
    tags: ['vorteile', 'benefits', 'mitgliedschaft'],
    updatedAt: '2025-02-10T09:15:00Z',
  },
  {
    id: 'faq-4',
    question: 'Kann ich meine Mitgliedschaft kündigen?',
    answer:
      'Ja, die Mitgliedschaft kann jederzeit zum Ende des Kalenderjahres gekündigt werden. Die Kündigung muss schriftlich bis zum 30. November eingehen. Eine anteilige Rückerstattung des Jahresbeitrags ist nicht möglich.',
    category: 'mitgliedschaft',
    order: 4,
    views: 89,
    tags: ['kündigung', 'austritt'],
    updatedAt: '2025-03-05T16:20:00Z',
  },

  // Events
  {
    id: 'faq-5',
    question: 'Wie kann ich mich für Events anmelden?',
    answer:
      'Die Anmeldung zu Events erfolgt über den Mitgliederbereich auf unserer Website. Dort findest du alle kommenden Veranstaltungen mit Details und Anmeldebutton. Nach der Anmeldung erhältst du eine Bestätigungsmail mit allen wichtigen Informationen.',
    category: 'events',
    order: 5,
    views: 234,
    isPopular: true,
    tags: ['anmeldung', 'events', 'veranstaltungen'],
    updatedAt: '2025-04-12T11:00:00Z',
  },
  {
    id: 'faq-6',
    question: 'Sind die Events nur für Mitglieder?',
    answer:
      'Die meisten unserer Events sind für Mitglieder reserviert. Es gibt aber auch öffentliche Veranstaltungen, zu denen jeder willkommen ist. Diese sind in der Event-Übersicht entsprechend gekennzeichnet. Mitglieder erhalten bei kostenpflichtigen Events oft vergünstigte Konditionen.',
    category: 'events',
    order: 6,
    views: 178,
    relatedFaqIds: ['faq-5'],
    tags: ['öffentlich', 'mitglieder', 'zugang'],
    updatedAt: '2025-05-20T13:45:00Z',
  },
  {
    id: 'faq-7',
    question: 'Wie organisiere ich Auswärtsfahrten mit?',
    answer:
      'Auswärtsfahrten werden vom Team Event organisiert. Wenn du mithelfen möchtest, melde dich bei @lisamon auf Discord oder schreibe eine Mail an events@fanini-spandau.de. Wir freuen uns immer über Unterstützung bei der Planung und Durchführung!',
    category: 'events',
    order: 7,
    views: 145,
    tags: ['auswärtsfahrt', 'organisation', 'team event'],
    updatedAt: '2025-06-01T08:30:00Z',
  },
  {
    id: 'faq-8',
    question: 'Was passiert bei der Gamescom 2025?',
    answer:
      'Wir planen einen großen Fanini-Stand auf der Gamescom 2025! Dort präsentieren wir uns als Community, veranstalten Meet & Greets und haben einige Überraschungen vorbereitet. Details folgen rechtzeitig vor dem Event im Newsletter und auf unseren Social Media Kanälen.',
    category: 'events',
    order: 8,
    views: 567,
    isPopular: true,
    tags: ['gamescom', '2025', 'messe'],
    updatedAt: '2025-06-10T15:00:00Z',
  },

  // Verein
  {
    id: 'faq-9',
    question: 'Wer leitet die Faninitiative Spandau?',
    answer:
      'Der Verein wird vom Vorstand geleitet, bestehend aus der Ersten Vorsitzenden Glenn Odya, dem Zweiten Vorsitzenden Christoph Raatz, dem Kassenwart Jonas Kling und der Schriftführerin Sarah Weber. Unterstützt werden sie vom Beirat mit den Teamleitungen.',
    category: 'verein',
    order: 9,
    views: 189,
    tags: ['vorstand', 'leitung', 'führung'],
    updatedAt: '2025-03-15T12:00:00Z',
  },
  {
    id: 'faq-10',
    question: 'Wie ist der Verein strukturiert?',
    answer:
      'Die Faninitiative gliedert sich in Vorstand, Beirat und verschiedene Teams (Event, Medien, Technik, Verein). Jedes Team hat spezielle Aufgaben und wird von einem Beiratsmitglied geleitet. Die genaue Struktur findest du in unserem Organisationsstruktur-Dokument.',
    category: 'verein',
    order: 10,
    views: 156,
    relatedFaqIds: ['faq-9'],
    tags: ['struktur', 'organisation', 'teams'],
    updatedAt: '2025-04-20T10:30:00Z',
  },
  {
    id: 'faq-11',
    question: 'Welche Werte vertritt die Faninitiative?',
    answer:
      'Unsere Kernwerte sind Fairness, Offenheit, Respekt, Zusammenhalt, Toleranz und Vielfalt. Wir stehen für eine inklusive Fan-Kultur, in der sich alle wohlfühlen können - unabhängig von Herkunft, Geschlecht oder anderen persönlichen Merkmalen.',
    category: 'verein',
    order: 11,
    views: 134,
    tags: ['werte', 'leitbild', 'kultur'],
    updatedAt: '2025-02-28T14:15:00Z',
  },
  {
    id: 'faq-12',
    question: 'Wie kann ich mich im Verein engagieren?',
    answer:
      'Es gibt viele Möglichkeiten! Du kannst dich einem unserer Teams anschließen (Event, Medien, Technik, Verein), bei Projekten mithelfen oder eigene Ideen einbringen. Melde dich einfach beim entsprechenden Teamleiter oder schreibe an vorstand@fanini-spandau.de.',
    category: 'verein',
    order: 12,
    views: 198,
    isPopular: true,
    tags: ['engagement', 'mitmachen', 'teams'],
    updatedAt: '2025-05-10T09:00:00Z',
  },

  // Technik
  {
    id: 'faq-13',
    question: 'Wie komme ich auf den Discord-Server?',
    answer:
      'Den Discord-Einladungslink erhältst du nach deiner Registrierung als Mitglied per E-Mail. Falls du den Link nicht erhalten hast, wende dich an technik@fanini-spandau.de. Der Discord ist unser Hauptkommunikationskanal für den täglichen Austausch.',
    category: 'technik',
    order: 13,
    views: 267,
    isPopular: true,
    tags: ['discord', 'zugang', 'kommunikation'],
    updatedAt: '2025-06-05T11:30:00Z',
  },
  {
    id: 'faq-14',
    question: 'Ich habe mein Passwort vergessen, was nun?',
    answer:
      'Kein Problem! Nutze die "Passwort vergessen"-Funktion auf der Login-Seite. Du erhältst dann eine E-Mail mit einem Link zum Zurücksetzen. Falls das nicht funktioniert, melde dich bei technik@fanini-spandau.de.',
    category: 'technik',
    order: 14,
    views: 145,
    tags: ['passwort', 'login', 'zugang'],
    updatedAt: '2025-04-25T13:00:00Z',
  },
  {
    id: 'faq-15',
    question: 'Welche technischen Voraussetzungen brauche ich?',
    answer:
      'Für die Website benötigst du nur einen aktuellen Browser (Chrome, Firefox, Safari oder Edge). Die Seite ist vollständig responsive und funktioniert auch auf Smartphones und Tablets. Für Discord empfehlen wir die Desktop-App oder mobile App.',
    category: 'technik',
    order: 15,
    views: 89,
    tags: ['voraussetzungen', 'browser', 'technik'],
    updatedAt: '2025-03-30T16:45:00Z',
  },

  // Sonstige
  {
    id: 'faq-16',
    question: 'Wie kann ich den Verein unterstützen?',
    answer:
      'Neben der Mitgliedschaft kannst du uns durch aktive Mitarbeit in Teams, Spenden, das Werben neuer Mitglieder oder das Teilen unserer Beiträge in Social Media unterstützen. Auch Sachspenden für Events sind willkommen!',
    category: 'sonstige',
    order: 16,
    views: 123,
    tags: ['unterstützung', 'spenden', 'hilfe'],
    updatedAt: '2025-05-15T10:20:00Z',
  },
  {
    id: 'faq-17',
    question: 'Gibt es Fanini-Merchandise?',
    answer:
      'Ja! Wir haben verschiedene Merchandise-Artikel wie T-Shirts, Schals und Aufkleber. Diese kannst du bei Events kaufen oder über unseren Online-Shop bestellen. Mitglieder erhalten 10% Rabatt auf alle Artikel.',
    category: 'sonstige',
    order: 17,
    views: 234,
    tags: ['merchandise', 'fanartikel', 'shop'],
    updatedAt: '2025-06-12T14:00:00Z',
  },
  {
    id: 'faq-18',
    question: 'Wie erfahre ich von Neuigkeiten?',
    answer:
      'Wir kommunizieren über verschiedene Kanäle: Newsletter (monatlich), Discord (täglich), Instagram/Twitter (mehrmals wöchentlich) und die Website. Als Mitglied verpasst du nichts, wenn du im Discord aktiv bist und den Newsletter abonniert hast.',
    category: 'sonstige',
    order: 18,
    views: 167,
    relatedFaqIds: ['faq-13'],
    tags: ['news', 'kommunikation', 'updates'],
    updatedAt: '2025-05-25T08:45:00Z',
  },
  {
    id: 'faq-19',
    question: 'Was ist der Unterschied zur Eintracht Spandau?',
    answer:
      'Die Eintracht Spandau ist der Profi-Fußballverein, während die Faninitiative Spandau e.V. ein unabhängiger Fanverein ist. Wir organisieren die Fanszene, unterstützen das Team und schaffen eine Community für alle Eintracht-Fans. Wir arbeiten eng mit dem Verein zusammen, sind aber eigenständig.',
    category: 'sonstige',
    order: 19,
    views: 289,
    tags: ['eintracht', 'unterschied', 'fanverein'],
    updatedAt: '2025-06-01T12:30:00Z',
  },
  {
    id: 'faq-20',
    question: 'Wo finde ich die Vereinssatzung?',
    answer:
      'Die aktuelle Vereinssatzung findest du im Dokumentenbereich unserer Website. Dort sind auch weitere wichtige Dokumente wie das Werteleitbild, die Organisationsstruktur und verschiedene Geschäftsordnungen verfügbar.',
    category: 'sonstige',
    order: 20,
    views: 98,
    tags: ['satzung', 'dokumente', 'downloads'],
    updatedAt: '2025-04-10T15:15:00Z',
  },
];

// Response creator
export const createFaqListResponse = () => ({
  data: FAQ_DATA,
  meta: {
    total: FAQ_DATA.length,
    categories: ['mitgliedschaft', 'events', 'verein', 'technik', 'sonstige'],
  },
});

// Helper für populäre FAQs
export const getPopularFaqs = (limit = 5) => {
  return FAQ_DATA.filter(faq => faq.isPopular).slice(0, limit);
};

// Helper für FAQs nach Kategorie
export const getFaqsByCategory = (category: string) => {
  return FAQ_DATA.filter(faq => faq.category === category);
};
