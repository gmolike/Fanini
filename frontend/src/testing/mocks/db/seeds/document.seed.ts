/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-lines */
// frontend/src/testing/mocks/db/seeds/document.seed.ts
import type { Document, DocumentListItem } from '@/entities/public/document';

export const DOCUMENTS_DATA: Document[] = [
  // Hauptdokumente (tatsächlich vorhanden)
  {
    id: 'doc-satzung',
    title: 'Satzung der Faninitiative Spandau e.V.',
    description:
      'Die Vereinssatzung in der aktuellen Fassung vom 15.01.2025, eingetragen beim Amtsgericht Charlottenburg.',
    category: 'satzung',
    fileUrl: '/dokumente/Satzung.pdf',
    fileSize: 245678,
    fileType: 'application/pdf',
    version: '1.0',
    status: 'current',
    publishedAt: '2025-01-15T14:00:00Z',
    updatedAt: '2025-06-06T10:00:00Z',
    author: 'Vorstand',
    downloads: 342,
    tags: ['rechtlich', 'grundlagen', 'vereinsrecht'],
    isFeatured: true,
  },
  {
    id: 'doc-werteleitbild',
    title: 'Werteleitbild',
    description:
      'Unsere Werte und Prinzipien: Fairness, Offenheit, Respekt, Zusammenhalt, Toleranz und Vielfalt.',
    category: 'richtlinien',
    fileUrl: '/dokumente/Werteleitbild.pdf',
    fileSize: 89234,
    fileType: 'application/pdf',
    version: '1.0',
    status: 'current',
    publishedAt: '2025-02-15T10:00:00Z',
    author: 'Mitgliederversammlung',
    downloads: 256,
    tags: ['werte', 'kultur', 'leitbild'],
    isFeatured: true,
  },
  {
    id: 'doc-orgastruktur',
    title: 'Organisationsstruktur',
    description:
      'Detaillierte Übersicht über die Vereinsstruktur mit Vorstand, Beirat, Teams und Verantwortlichkeiten.',
    category: 'richtlinien',
    fileUrl: '/dokumente/Organisationsstruktur.pdf',
    fileSize: 156789,
    fileType: 'application/pdf',
    version: '2.0',
    status: 'current',
    publishedAt: '2025-03-20T16:45:00Z',
    updatedAt: '2025-06-15T09:30:00Z',
    author: 'Vorstand',
    downloads: 189,
    tags: ['struktur', 'organisation', 'teams'],
    isFeatured: true,
  },

  // Protokolle
  {
    id: 'doc-protokoll-gruendung',
    title: 'Protokoll der Gründungsversammlung',
    description:
      'Historisches Dokument: Protokoll der Vereinsgründung am 15.01.2025 mit allen Beschlüssen und Wahlergebnissen.',
    category: 'protokolle',
    fileUrl: '/dokumente/protokolle/Protokoll_Gruendung_2025-01-15.pdf',
    fileSize: 234567,
    fileType: 'application/pdf',
    version: '1.0',
    status: 'current',
    publishedAt: '2025-01-20T18:30:00Z',
    author: 'Sarah Weber',
    downloads: 145,
    tags: ['gründung', 'historie', 'beschlüsse'],
  },
  {
    id: 'doc-protokoll-mv-1',
    title: 'Protokoll 1. Mitgliederversammlung',
    description:
      'Erste ordentliche Mitgliederversammlung vom 20.03.2025 mit Vorstandswahlen und Beschlüssen.',
    category: 'protokolle',
    fileUrl: '/dokumente/protokolle/Protokoll_MV_2025-03-20.pdf',
    fileSize: 189234,
    fileType: 'application/pdf',
    version: '1.0',
    status: 'current',
    publishedAt: '2025-03-25T14:00:00Z',
    author: 'Sarah Weber',
    downloads: 98,
    tags: ['mitgliederversammlung', 'wahlen', 'beschlüsse'],
  },
  {
    id: 'doc-protokoll-vorstand-06',
    title: 'Vorstandssitzung Juni 2025',
    description: 'Protokoll der Vorstandssitzung vom 05.06.2025 mit aktuellen Beschlüssen.',
    category: 'protokolle',
    fileUrl: '/dokumente/protokolle/Protokoll_Vorstand_2025-06-05.pdf',
    fileSize: 98765,
    fileType: 'application/pdf',
    version: '1.0',
    status: 'current',
    publishedAt: '2025-06-10T12:00:00Z',
    author: 'Sarah Weber',
    downloads: 45,
    tags: ['vorstand', 'sitzung', 'aktuell'],
  },

  // Formulare
  {
    id: 'doc-mitgliedsantrag',
    title: 'Mitgliedsantrag',
    description: 'Antragsformular für neue Mitglieder mit allen erforderlichen Angaben.',
    category: 'formulare',
    fileUrl: '/dokumente/formulare/Mitgliedsantrag_Faninitiative.pdf',
    fileSize: 67890,
    fileType: 'application/pdf',
    version: '2.1',
    status: 'current',
    publishedAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-05-01T10:00:00Z',
    author: 'Team Verein',
    downloads: 567,
    tags: ['antrag', 'mitgliedschaft', 'formular'],
    isFeatured: true,
  },
  {
    id: 'doc-ausgabenformular',
    title: 'Ausgabenerstattung',
    description: 'Formular zur Beantragung von Ausgabenerstattungen für Vereinsaktivitäten.',
    category: 'formulare',
    fileUrl: '/dokumente/formulare/Ausgabenerstattung.pdf',
    fileSize: 45678,
    fileType: 'application/pdf',
    version: '1.2',
    status: 'current',
    publishedAt: '2025-02-20T11:00:00Z',
    updatedAt: '2025-04-15T14:30:00Z',
    author: 'Kassenwart',
    downloads: 123,
    tags: ['finanzen', 'erstattung', 'formular'],
  },
  {
    id: 'doc-eventanmeldung',
    title: 'Event-Anmeldeformular',
    description: 'Allgemeines Anmeldeformular für Vereinsveranstaltungen (Offline-Version).',
    category: 'formulare',
    fileUrl: '/dokumente/formulare/Event_Anmeldung.pdf',
    fileSize: 34567,
    fileType: 'application/pdf',
    version: '1.0',
    status: 'current',
    publishedAt: '2025-03-01T09:00:00Z',
    author: 'Team Event',
    downloads: 89,
    tags: ['event', 'anmeldung', 'formular'],
  },

  // Richtlinien
  {
    id: 'doc-go-allgemein',
    title: 'Allgemeine Geschäftsordnung',
    description: 'Regelt die grundlegenden Verfahren und Abläufe im Verein, ergänzend zur Satzung.',
    category: 'richtlinien',
    fileUrl: '/dokumente/richtlinien/GO_Allgemein.pdf',
    fileSize: 98234,
    fileType: 'application/pdf',
    version: '1.1',
    status: 'current',
    publishedAt: '2025-04-10T09:15:00Z',
    author: 'Vorstand',
    downloads: 67,
    tags: ['geschäftsordnung', 'regeln', 'verfahren'],
  },
  {
    id: 'doc-go-vorstand',
    title: 'Geschäftsordnung Vorstand',
    description: 'Spezielle Geschäftsordnung für die Arbeit des Vorstands.',
    category: 'richtlinien',
    fileUrl: '/dokumente/richtlinien/GO_Vorstand.pdf',
    fileSize: 76543,
    fileType: 'application/pdf',
    version: '1.0',
    status: 'current',
    publishedAt: '2025-04-10T09:15:00Z',
    author: 'Vorstand',
    downloads: 45,
    tags: ['vorstand', 'geschäftsordnung', 'regeln'],
  },
  {
    id: 'doc-go-beirat',
    title: 'Geschäftsordnung Beirat',
    description: 'Regelungen zur Arbeitsweise des Beirats und der Teamleitungen.',
    category: 'richtlinien',
    fileUrl: '/dokumente/richtlinien/GO_Beirat.pdf',
    fileSize: 68901,
    fileType: 'application/pdf',
    version: '1.0',
    status: 'current',
    publishedAt: '2025-04-10T09:15:00Z',
    author: 'Beirat',
    downloads: 38,
    tags: ['beirat', 'geschäftsordnung', 'teams'],
  },
  {
    id: 'doc-beitragsordnung',
    title: 'Beitragsordnung',
    description: 'Regelung der Mitgliedsbeiträge, Zahlungsmodalitäten und Ermäßigungen.',
    category: 'richtlinien',
    fileUrl: '/dokumente/richtlinien/Beitragsordnung.pdf',
    fileSize: 45678,
    fileType: 'application/pdf',
    version: '1.0',
    status: 'current',
    publishedAt: '2025-01-15T12:00:00Z',
    author: 'Mitgliederversammlung',
    downloads: 156,
    tags: ['beitrag', 'finanzen', 'mitgliedschaft'],
  },
  {
    id: 'doc-datenschutz',
    title: 'Datenschutzordnung',
    description: 'Umfassende Regelungen zum Datenschutz gemäß DSGVO für alle Vereinsaktivitäten.',
    category: 'richtlinien',
    fileUrl: '/dokumente/richtlinien/Datenschutzordnung.pdf',
    fileSize: 98765,
    fileType: 'application/pdf',
    version: '2.0',
    status: 'current',
    publishedAt: '2025-02-01T11:30:00Z',
    updatedAt: '2025-05-25T13:00:00Z',
    author: 'Datenschutzbeauftragter',
    downloads: 234,
    tags: ['datenschutz', 'dsgvo', 'rechtlich'],
  },

  // Guides
  {
    id: 'doc-guide-discord',
    title: 'Discord Server Guide',
    description:
      'Anleitung für neue Mitglieder: Wie funktioniert unser Discord-Server? Channels, Rollen und Regeln erklärt.',
    category: 'guides',
    fileUrl: '/dokumente/guides/Discord_Guide.pdf',
    fileSize: 123456,
    fileType: 'application/pdf',
    version: '3.0',
    status: 'current',
    publishedAt: '2025-03-15T10:00:00Z',
    updatedAt: '2025-06-01T11:00:00Z',
    author: 'Team Technik',
    downloads: 345,
    tags: ['discord', 'anleitung', 'kommunikation'],
  },
  {
    id: 'doc-guide-events',
    title: 'Event-Organisation Leitfaden',
    description: 'Schritt-für-Schritt Anleitung für die Organisation von Vereinsevents.',
    category: 'guides',
    fileUrl: '/dokumente/guides/Event_Organisation.pdf',
    fileSize: 89012,
    fileType: 'application/pdf',
    version: '1.5',
    status: 'current',
    publishedAt: '2025-04-20T14:00:00Z',
    author: 'Team Event',
    downloads: 78,
    tags: ['events', 'organisation', 'anleitung'],
  },
  {
    id: 'doc-guide-auswärts',
    title: 'Auswärtsfahrten Guide',
    description:
      'Alles Wichtige zu Auswärtsfahrten: Buchung, Treffpunkte, Verhaltensregeln und Tipps.',
    category: 'guides',
    fileUrl: '/dokumente/guides/Auswaertsfahrten_Guide.pdf',
    fileSize: 156789,
    fileType: 'application/pdf',
    version: '2.2',
    status: 'current',
    publishedAt: '2025-02-28T16:00:00Z',
    updatedAt: '2025-05-15T09:30:00Z',
    author: 'Team Event',
    downloads: 234,
    tags: ['auswärts', 'fanfahrt', 'guide'],
  },

  // Veraltete Dokumente
  {
    id: 'doc-satzung-alt',
    title: 'Satzung (Entwurf)',
    description: 'Ursprünglicher Satzungsentwurf - überholt durch finale Version.',
    category: 'satzung',
    fileUrl: '/dokumente/archiv/Satzung_Entwurf.pdf',
    fileSize: 198765,
    fileType: 'application/pdf',
    version: '0.9',
    status: 'outdated',
    publishedAt: '2024-12-01T10:00:00Z',
    author: 'Gründungskomitee',
    downloads: 23,
    tags: ['entwurf', 'archiv', 'historie'],
  },
];

// Helper Funktionen
export const toDocumentListItem = (doc: Document): DocumentListItem => {
  return {
    id: doc.id,
    title: doc.title,
    category: doc.category,
    fileType: doc.fileType,
    fileSize: doc.fileSize,
    version: doc.version,
    publishedAt: doc.publishedAt,
    status: doc.status,
    preview: doc.description ? `${doc.description.substring(0, 100)}...` : undefined,
  };
};

export const createDocumentListResponse = () => ({
  data: DOCUMENTS_DATA.filter(doc => doc.status === 'current').map(toDocumentListItem),
  meta: {
    total: DOCUMENTS_DATA.filter(doc => doc.status === 'current').length,
    categories: ['satzung', 'protokolle', 'formulare', 'richtlinien', 'guides'],
  },
});

export const getDocumentsByCategory = (category: string) => {
  return DOCUMENTS_DATA.filter(doc => doc.category === category && doc.status === 'current');
};

export const getFeaturedDocuments = () => {
  return DOCUMENTS_DATA.filter(doc => doc.isFeatured && doc.status === 'current');
};

// Spezielle Getter für wichtige Dokumente
export const getSatzung = () => {
  return DOCUMENTS_DATA.find(doc => doc.id === 'doc-satzung');
};

export const getWerteleitbild = () => {
  return DOCUMENTS_DATA.find(doc => doc.id === 'doc-werteleitbild');
};

export const getOrganisationsstruktur = () => {
  return DOCUMENTS_DATA.find(doc => doc.id === 'doc-orgastruktur');
};
