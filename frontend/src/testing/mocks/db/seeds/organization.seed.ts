/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/naming-convention */
// frontend/src/testing/mocks/db/seeds/organization.seed.ts
import type {
  DocumentsResponse,
  GremienListResponse,
  Gremium,
  GremiumDetailResponse,
  GremiumListItem,
  GremiumType,
  OrganizationDocument,
} from '@/entities/public/organization';

// Gremien Liste - verwenden Sie direkte Werte statt GREMIUM_CONFIG
export const GREMIEN_LIST: GremiumListItem[] = [
  {
    id: 'vorstand',
    type: 'vorstand',
    name: 'Vorstand', // Direkt angeben
    shortDescription: 'Geschäftsführendes Organ des Vereins mit strategischer Verantwortung',
    memberCount: 4,
    establishedDate: '2025-01-15',
    gradient: 'from-blue-500 to-blue-600', // Direkt angeben
    headerImage:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&h=400&fit=crop',
  },
  {
    id: 'beirat',
    type: 'beirat',
    name: 'Beirat',
    shortDescription: 'Operative Leitung der Teams und Beratung des Vorstands',
    memberCount: 4,
    establishedDate: '2025-01-15',
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    id: 'team_event',
    type: 'team_event',
    name: 'Team Event',
    shortDescription: 'Organisation unvergesslicher Veranstaltungen und Fan-Treffen',
    memberCount: 3,
    establishedDate: '2025-01-15',
    gradient: 'from-green-500 to-green-600',
    headerImage:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=400&fit=crop',
  },
  {
    id: 'team_medien',
    type: 'team_medien',
    name: 'Team Medien',
    shortDescription: 'Kreative Köpfe für Memes, Grafiken und Social Media Content',
    memberCount: 4,
    establishedDate: '2025-01-15',
    gradient: 'from-pink-500 to-pink-600',
    headerImage:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=400&fit=crop',
  },
  {
    id: 'team_technik',
    type: 'team_technik',
    name: 'Team Technik',
    shortDescription: 'Digitale Infrastruktur, Discord und technischer Support',
    memberCount: 3,
    establishedDate: '2025-01-15',
    gradient: 'from-amber-500 to-amber-600',
  },
  {
    id: 'team_verein',
    type: 'team_verein',
    name: 'Team Verein',
    shortDescription: 'Mitgliederverwaltung, Beiträge und interne Organisation',
    memberCount: 2,
    establishedDate: '2025-01-15',
    gradient: 'from-cyan-500 to-cyan-600',
  },
  {
    id: 'kassenpruefung',
    type: 'kassenpruefung',
    name: 'Kassenprüfung',
    shortDescription: 'Unabhängige Finanzprüfung und Kontrolle',
    memberCount: 2,
    establishedDate: '2025-03-20',
    gradient: 'from-red-500 to-red-600',
  },
];

// Gremien Details
export const GREMIEN_DETAILS: Record<GremiumType, Gremium> = {
  vorstand: {
    id: 'vorstand',
    type: 'vorstand',
    name: 'Vorstand',
    shortDescription: 'Geschäftsführendes Organ des Vereins mit strategischer Verantwortung',
    description:
      'Der Vorstand führt die Geschäfte des Vereins und vertritt ihn nach außen gemäß § 26 BGB. Er besteht aus dem geschäftsführenden Vorstand (Erste und Zweite Vorsitzende sowie Kassenwart) und dem erweiterten Vorstand (Schriftführung). Die Hauptverantwortung liegt in der strategischen Ausrichtung, rechtlichen Vertretung und finanziellen Führung des Vereins.',
    establishedDate: '2025-01-15',
    gradient: 'from-blue-500 to-blue-600',
    headerImage:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&h=400&fit=crop',
    members: [
      {
        id: 'gmo',
        name: 'Glenn Odya',
        role: 'Erste Vorsitzende',
        memberSince: '2025-01-15',
        email: 'vorstand@fanini-spandau.de',
        description:
          'Führt den Verein seit der Gründung mit Engagement und Herzblut. Verantwortlich für die externe Repräsentation und Kommunikation mit Eintracht Spandau.',
        responsibilities: [
          'Externe Repräsentation',
          'Kommunikation mit Eintracht Spandau',
          'Strategische Entwicklung',
        ],
      },
      {
        id: 'alka',
        name: 'Christoph Raatz',
        role: 'Zweiter Vorsitzender',
        memberSince: '2025-01-15',
        responsibilities: ['Interne Koordination', 'Meeting-Organisation', 'Konfliktmanagement'],
        description: 'Fokussiert sich auf die internen Strukturen und Prozesse des Vereins.',
      },
      {
        id: 'max-mueller',
        name: 'Jonas Kling',
        role: 'Kassenwart',
        memberSince: '2025-01-15',
        responsibilities: ['Finanzverwaltung', 'Budgetierung', 'Jahresabschluss'],
        description: 'Trägt die Verantwortung für das gesamte Finanzwesen des Vereins.',
      },
      {
        id: 'Jonas Wegmann',
        name: 'Sarah Weber',
        role: 'Schriftführer',
        memberSince: '2025-01-15',
        responsibilities: ['Protokollführung', 'Dokumentation', 'Kommunikationsunterstützung'],
        description: 'Verantwortlich für die umfassende Dokumentation aller Vereinsaktivitäten.',
      },
    ],
    responsibilities: [
      'Strategische Gesamtleitung des Vereins',
      'Rechtliche und finanzielle Verantwortung',
      'Vertretung nach außen gemäß § 26 BGB',
      'Einberufung der Mitgliederversammlung',
      'Umsetzung der Beschlüsse der MV',
    ],
    meetingSchedule: 'Monatlich, jeden ersten Montag um 19:00 Uhr',
    contactEmail: 'vorstand@fanini-spandau.de',
    stats: {
      memberCount: 4,
      activeSince: '2025-01-15',
    },
    highlights: [
      {
        title: 'Vereinsgründung erfolgreich',
        description: 'Erfolgreiche Gründung der Faninitiative Spandau e.V. mit über 70 Mitgliedern',
        date: '2025-01-15',
      },
      {
        title: 'Vereinsregister-Eintragung',
        description: 'Offizielle Eintragung ins Vereinsregister abgeschlossen',
        date: '2025-06-06',
      },
      {
        title: 'Erste Mitgliederversammlung',
        description: 'Erfolgreiche Durchführung mit Wahl aller Gremien',
        date: '2025-03-20',
      },
    ],
  },
  beirat: {
    id: 'beirat',
    type: 'beirat',
    name: 'Beirat',
    shortDescription: 'Operative Leitung der Teams und Beratung des Vorstands',
    description:
      'Der Beirat fungiert als Bindeglied zwischen dem Vorstand und den operativen Arbeitsstrukturen des Vereins. Die gewählten Beiratsmitglieder leiten in ihrer Funktion die ihnen zugewiesenen Arbeitsbereiche und beraten den Vorstand in allen wesentlichen Vereinsangelegenheiten. Der Beirat koordiniert die Teams und stellt die operative Umsetzung der Vereinsziele sicher.',
    establishedDate: '2025-01-15',
    gradient: 'from-purple-500 to-purple-600',
    members: [
      {
        id: 'lisamon',
        name: 'lisamon',
        role: 'Event-Managerin',
        memberSince: '2025-01-15',
        responsibilities: ['Veranstaltungsplanung', 'Ressourcenkoordination', 'Eventbudgetierung'],
        description:
          'Plant und organisiert alle Vereinsveranstaltungen von kleinen Treffen bis zu großen Fan-Events.',
      },
      {
        id: 'rifton',
        name: 'Rifton',
        role: 'Medienbeauftragter',
        memberSince: '2025-01-15',
        responsibilities: ['Social Media Strategie', 'Corporate Design', 'Öffentlichkeitsarbeit'],
        description: 'Verantwortet die gesamte mediale Präsenz der Faninitiative.',
      },
      {
        id: 'kaya',
        name: 'Kaya',
        role: 'Technik-Koordinatorin',
        memberSince: '2025-01-15',
        responsibilities: ['IT-Infrastruktur', 'Technische Entwicklung', 'System-Administration'],
        description:
          'Das technische Rückgrat des Vereins - betreut Discord, Website und alle digitalen Systeme.',
      },
      {
        id: 'franzee',
        name: 'franZee',
        role: 'Mitgliederverwalterin',
        memberSince: '2025-01-15',
        responsibilities: ['Mitgliederbetreuung', 'Patreon-Verwaltung', 'Anfragenmanagement'],
        description: 'Zentrales Bindeglied zwischen den Mitgliedern und dem Verein.',
      },
    ],
    responsibilities: [
      'Operative Vereinsarbeit leiten',
      'Teams koordinieren',
      'Vorstand beraten',
      'Projekte umsetzen',
      'Zwischen Basis und Führung vermitteln',
    ],
    meetingSchedule: '14-tägig, mittwochs um 20:00 Uhr',
    contactEmail: 'beirat@fanini-spandau.de',
    stats: {
      memberCount: 4,
      activeSince: '2025-01-15',
    },
    highlights: [
      {
        title: 'Teamstruktur etabliert',
        description: 'Alle Teams erfolgreich aufgebaut und arbeitsfähig',
        date: '2025-04-01',
      },
      {
        title: 'Erste Projekte gestartet',
        description: 'Mehrere Vereinsprojekte erfolgreich initiiert',
        date: '2025-05-15',
      },
    ],
  },
  team_event: {
    id: 'team_event',
    type: 'team_event',
    name: 'Team Event',
    shortDescription: 'Organisation unvergesslicher Veranstaltungen und Fan-Treffen',
    description:
      'Wir sind Team Events! Bei uns dreht sich alles um die Planung und Durchführung unvergesslicher Veranstaltungen. Von kleinen Viewing Parties über Auswärtsfahrten bis hin zu großen Fan-Festen - wir sorgen dafür, dass jedes Treffen zu einem besonderen Erlebnis wird. Aktuell planen wir bereits die Gamescom 2025 und viele weitere spannende Events!',
    establishedDate: '2025-01-15',
    gradient: 'from-green-500 to-green-600',
    headerImage:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=400&fit=crop',
    members: [
      {
        id: 'lisamon',
        name: 'lisamon',
        role: 'Event-Managerin (Teamleitung)',
        memberSince: '2025-01-15',
        responsibilities: ['Veranstaltungsplanung', 'Ressourcenkoordination', 'Eventbudgetierung'],
        description:
          'Plant und organisiert alle Vereinsveranstaltungen von kleinen Treffen bis zu großen Fan-Events.',
      },
      {
        id: 'team-event-2',
        name: 'Laura',
        role: 'Event-Support',
        memberSince: '2025-02-01',
        responsibilities: ['Helfer-Koordination', 'Material-Verwaltung'],
      },
      {
        id: 'team-event-3',
        name: 'Felix',
        role: 'Event-Support',
        memberSince: '2025-03-15',
        responsibilities: ['Ticket-Verwaltung', 'Gästebetreuung'],
      },
    ],
    responsibilities: [
      'Planung aller Vereinsveranstaltungen',
      'Organisation von Auswärtsfahrten',
      'Koordination von Viewing Parties',
      'Budget- und Ressourcenplanung',
      'Ticketverwaltung und Gästebetreuung',
    ],
    meetingSchedule: 'Wöchentlich vor großen Events, sonst 14-tägig',
    contactEmail: 'events@fanini-spandau.de',
    stats: {
      memberCount: 3,
      activeSince: '2025-01-15',
      projectsCompleted: 12,
      eventsOrganized: 8,
    },
    highlights: [
      {
        title: 'Gründungsfeier',
        description: 'Große Vereinsgründungsparty mit über 200 Gästen',
        date: '2025-02-01',
      },
      {
        title: 'Baller League Support',
        description: 'Organisation der Fanfahrten zu allen Heimspielen in Berlin',
        date: '2025-03-01',
      },
      {
        title: 'Gamescom 2025',
        description: 'Planung für großen Fanini-Stand läuft auf Hochtouren',
        date: '2025-08-20',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop',
    ],
  },
  team_medien: {
    id: 'team_medien',
    type: 'team_medien',
    name: 'Team Medien',
    shortDescription: 'Kreative Köpfe für Memes, Grafiken und Social Media Content',
    description:
      'Das kreative Herz der Fanini! Wir erstellen Memes, Grafiken und Content für alle Social Media Kanäle. Von Instagram über Twitter bis TikTok - wir sind überall und sorgen dafür, dass die Faninitiative online präsent und sichtbar ist. Mit unserem neuen Postingplan versorgen wir euch regelmäßig mit dem besten Content rund um Eintracht Spandau!',
    establishedDate: '2025-01-15',
    gradient: 'from-pink-500 to-pink-600',
    headerImage:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=400&fit=crop',
    members: [
      {
        id: 'rifton',
        name: 'Rifton',
        role: 'Medienbeauftragter (Teamleitung)',
        memberSince: '2025-01-15',
        responsibilities: ['Social Media Strategie', 'Corporate Design', 'Öffentlichkeitsarbeit'],
        description: 'Kommissarische Teamleitung nach Rücktritt von TrommelPeter.',
      },
      {
        id: 'team-medien-2',
        name: 'TrommelPeter',
        role: 'Grafikdesigner',
        memberSince: '2025-01-20',
        responsibilities: ['Grafik-Erstellung', 'Meme-Produktion'],
      },
      {
        id: 'team-medien-3',
        name: 'SocialSarah',
        role: 'Content Creator',
        memberSince: '2025-02-10',
        responsibilities: ['Video-Content', 'Story-Management'],
      },
      {
        id: 'team-medien-4',
        name: 'PixelPaul',
        role: 'Foto & Video',
        memberSince: '2025-04-01',
        responsibilities: ['Event-Fotografie', 'Video-Schnitt'],
      },
    ],
    responsibilities: [
      'Social Media Management (Instagram, Twitter, TikTok)',
      'Content-Erstellung und Meme-Produktion',
      'Grafikdesign und Corporate Design',
      'Presse- und Öffentlichkeitsarbeit',
      'Newsletter-Redaktion',
    ],
    meetingSchedule: 'Wöchentlich donnerstags um 19:30 Uhr',
    contactEmail: 'medien@fanini-spandau.de',
    stats: {
      memberCount: 4,
      activeSince: '2025-01-15',
      projectsCompleted: 48,
    },
    highlights: [
      {
        title: 'Neuer Postingplan',
        description: 'Regelmäßiger Content auf allen Kanälen etabliert',
        date: '2025-05-01',
      },
      {
        title: '1000 Follower',
        description: 'Instagram-Meilenstein erreicht',
        date: '2025-06-15',
      },
    ],
  },
  team_technik: {
    id: 'team_technik',
    type: 'team_technik',
    name: 'Team Technik',
    shortDescription: 'Digitale Infrastruktur, Discord und technischer Support',
    description:
      'Die digitalen Helden im Hintergrund! Wir kümmern uns um Discord-Server, Website-Entwicklung, Ticketsysteme und alles was Strom braucht. Ohne uns läuft nix - aber mit uns läuft alles reibungslos. Von technischem Support bis zur Entwicklung neuer Features sind wir für alle digitalen Belange da.',
    establishedDate: '2025-01-15',
    gradient: 'from-amber-500 to-amber-600',
    members: [
      {
        id: 'kaya',
        name: 'Kaya',
        role: 'Technik-Koordinatorin (Teamleitung)',
        memberSince: '2025-01-15',
        responsibilities: ['IT-Infrastruktur', 'Technische Entwicklung', 'System-Administration'],
        description:
          'Das technische Rückgrat des Vereins - betreut Discord, Website und alle digitalen Systeme.',
      },
      {
        id: 'team-technik-2',
        name: 'CodeChris',
        role: 'Entwickler',
        memberSince: '2025-02-15',
        responsibilities: ['Website-Development', 'Feature-Entwicklung'],
      },
      {
        id: 'team-technik-3',
        name: 'AdminAnna',
        role: 'System-Admin',
        memberSince: '2025-03-01',
        responsibilities: ['Server-Wartung', 'Backup-Management'],
      },
    ],
    responsibilities: [
      'Discord-Server Administration',
      'Website-Entwicklung und -Wartung',
      'Technischer Support für Mitglieder',
      'Digitale Infrastruktur betreuen',
      'Neue Features entwickeln',
    ],
    meetingSchedule: 'Bei Bedarf, mindestens monatlich',
    contactEmail: 'technik@fanini-spandau.de',
    stats: {
      memberCount: 3,
      activeSince: '2025-01-15',
    },
  },
  team_verein: {
    id: 'team_verein',
    type: 'team_verein',
    name: 'Team Verein',
    shortDescription: 'Mitgliederverwaltung, Beiträge und interne Organisation',
    description:
      'Wir kümmern uns um alles Organisatorische - Mitgliederverwaltung, Beitragsverwaltung, Anträge und die ganze Bürokratie. Damit sich alle anderen auf den Spaß konzentrieren können! Mit bereits über 70 Mitgliedern wächst unsere Community stetig und wir sorgen dafür, dass alles reibungslos läuft.',
    establishedDate: '2025-01-15',
    gradient: 'from-cyan-500 to-cyan-600',
    members: [
      {
        id: 'franzee',
        name: 'franZee',
        role: 'Mitgliederverwalterin (Teamleitung)',
        memberSince: '2025-01-15',
        responsibilities: ['Mitgliederbetreuung', 'Patreon-Verwaltung', 'Anfragenmanagement'],
        description: 'Zentrales Bindeglied zwischen den Mitgliedern und dem Verein.',
      },
      {
        id: 'team-verein-2',
        name: 'BüroBeate',
        role: 'Verwaltungs-Support',
        memberSince: '2025-02-20',
        responsibilities: ['Dokumenten-Verwaltung', 'Mitglieder-Support'],
      },
    ],
    responsibilities: [
      'Mitgliederverwaltung und -betreuung',
      'Beitragsverwaltung',
      'Patreon-Account betreuen',
      'Mitgliederanfragen koordinieren',
      'Verwaltungsaufgaben',
    ],
    meetingSchedule: 'Monatlich, zweiter Dienstag',
    contactEmail: 'mitglieder@fanini-spandau.de',
    stats: {
      memberCount: 2,
      activeSince: '2025-01-15',
    },
  },
  kassenpruefung: {
    id: 'kassenpruefung',
    type: 'kassenpruefung',
    name: 'Kassenprüfung',
    shortDescription: 'Unabhängige Finanzprüfung und Kontrolle',
    description:
      'Die Kassenprüfer*innen arbeiten unabhängig von Vorstand und Beirat. Sie kontrollieren die finanzielle Integrität des Vereins und stellen sicher, dass alle Mittel satzungsgemäß verwendet werden. Die direkte Rechenschaftspflicht besteht gegenüber der Mitgliederversammlung.',
    establishedDate: '2025-03-20',
    gradient: 'from-red-500 to-red-600',
    members: [
      {
        id: 'kp-thomas',
        name: 'Thomas Fischer',
        role: 'Kassenprüfer',
        memberSince: '2025-03-20',
        responsibilities: [
          'Prüfung der Buchführung',
          'Jahresabschlussprüfung',
          'Berichterstattung an MV',
        ],
        description: 'Unabhängiger Kassenprüfer mit langjähriger Erfahrung in Vereinsfinanzen.',
      },
      {
        id: 'kp-julia',
        name: 'Julia Meyer',
        role: 'Kassenprüferin',
        memberSince: '2025-03-20',
        responsibilities: ['Belegprüfung', 'Kontrolle der Mittelverwendung', 'Empfehlungen'],
        description: 'Gewissenhafte Prüfung aller finanziellen Vorgänge.',
      },
    ],
    responsibilities: [
      'Jährliche Finanzprüfung',
      'Kontrolle der Buchführung',
      'Prüfung der Mittelverwendung',
      'Berichterstattung an die MV',
      'Empfehlungen zur Finanzverwaltung',
    ],
    meetingSchedule: 'Quartalsweise und vor der Jahres-MV',
    contactEmail: 'kassenpruefung@fanini-spandau.de',
    stats: {
      memberCount: 2,
      activeSince: '2025-03-20',
    },
  },
};

// Dokumente
export const ORGANIZATION_DOCUMENTS: OrganizationDocument[] = [
  {
    id: 'doc-satzung',
    title: 'Satzung der Faninitiative Spandau e.V.',
    type: 'satzung',
    fileUrl: '/dokumente/Satzung_Faninitiative_Spandau_eV.pdf',
    fileSize: 245678,
    updatedAt: '2025-06-06T14:30:00Z',
    category: 'Rechtliche Grundlagen',
    description: 'Die aktuelle Vereinssatzung in der vom Amtsgericht eingetragenen Fassung.',
  },
  {
    id: 'doc-werteleitbild',
    title: 'Werteleitbild',
    type: 'other',
    fileUrl: '/dokumente/Werteleitbild_Faninitiative.pdf',
    fileSize: 89234,
    updatedAt: '2025-02-15T10:00:00Z',
    category: 'Vereinskultur',
    description: 'Unsere Werte: Fairness, Offenheit, Respekt, Zusammenhalt, Toleranz und Vielfalt.',
  },
  {
    id: 'doc-orgastruktur',
    title: 'Organisationsstruktur',
    type: 'other',
    fileUrl: '/dokumente/Organisationsstruktur.pdf',
    fileSize: 156789,
    updatedAt: '2025-03-20T16:45:00Z',
    category: 'Organisation',
    description:
      'Detaillierte Darstellung der Vereinsstruktur mit allen Gremien und Verantwortlichkeiten.',
  },
  {
    id: 'doc-go-allgemein',
    title: 'Allgemeine Geschäftsordnung',
    type: 'geschaeftsordnung',
    fileUrl: '/dokumente/GO_Allgemein.pdf',
    fileSize: 98234,
    updatedAt: '2025-04-10T09:15:00Z',
    category: 'Organisation',
    description: 'Regelt die grundlegenden Verfahren und Abläufe im Verein.',
  },
  {
    id: 'doc-go-vorstand',
    title: 'Geschäftsordnung Vorstand',
    type: 'geschaeftsordnung',
    fileUrl: '/dokumente/GO_Vorstand.pdf',
    fileSize: 76543,
    updatedAt: '2025-04-10T09:15:00Z',
    category: 'Organisation',
    description: 'Arbeitsweise und Verfahren des Vorstands.',
  },
  {
    id: 'doc-go-beirat',
    title: 'Geschäftsordnung Beirat',
    type: 'geschaeftsordnung',
    fileUrl: '/dokumente/GO_Beirat.pdf',
    fileSize: 68901,
    updatedAt: '2025-04-10T09:15:00Z',
    category: 'Organisation',
    description: 'Regelungen zur Arbeitsweise des Beirats.',
  },
  {
    id: 'doc-beitragsordnung',
    title: 'Beitragsordnung',
    type: 'other',
    fileUrl: '/dokumente/Beitragsordnung.pdf',
    fileSize: 45678,
    updatedAt: '2025-01-15T12:00:00Z',
    category: 'Finanzen',
    description: 'Mitgliedsbeiträge und Zahlungsmodalitäten.',
  },
  {
    id: 'doc-protokoll-gruendung',
    title: 'Protokoll Gründungsversammlung',
    type: 'protokoll',
    fileUrl: '/dokumente/Protokoll_Gruendung_2025-01-15.pdf',
    fileSize: 234567,
    updatedAt: '2025-01-20T18:30:00Z',
    category: 'Protokolle',
    description: 'Protokoll der historischen Gründungsversammlung vom 15.01.2025.',
  },
  {
    id: 'doc-protokoll-mv-1',
    title: 'Protokoll 1. Mitgliederversammlung',
    type: 'protokoll',
    fileUrl: '/dokumente/Protokoll_MV_2025-03-20.pdf',
    fileSize: 189234,
    updatedAt: '2025-03-25T14:00:00Z',
    category: 'Protokolle',
    description: 'Erste ordentliche Mitgliederversammlung mit Vorstandswahlen.',
  },
  {
    id: 'doc-mitgliedsantrag',
    title: 'Mitgliedsantrag',
    type: 'formular',
    fileUrl: '/dokumente/Mitgliedsantrag_Faninitiative.pdf',
    fileSize: 67890,
    updatedAt: '2025-01-10T08:00:00Z',
    category: 'Formulare',
    description: 'Antragsformular für neue Mitglieder.',
  },
  {
    id: 'doc-datenschutz',
    title: 'Datenschutzordnung',
    type: 'other',
    fileUrl: '/dokumente/Datenschutzordnung.pdf',
    fileSize: 98765,
    updatedAt: '2025-02-01T11:30:00Z',
    category: 'Rechtliche Grundlagen',
    description: 'Regelungen zum Datenschutz gemäß DSGVO.',
  },
];

// Response Creators
export const createGremienListResponse = (): GremienListResponse => ({
  data: GREMIEN_LIST,
  meta: {
    total: GREMIEN_LIST.length,
  },
});

export const createGremiumDetailResponse = (gremiumId: GremiumType): GremiumDetailResponse => ({
  data: GREMIEN_DETAILS[gremiumId],
});

export const createDocumentsResponse = (): DocumentsResponse => ({
  data: ORGANIZATION_DOCUMENTS,
  meta: {
    total: ORGANIZATION_DOCUMENTS.length,
    categories: [...new Set(ORGANIZATION_DOCUMENTS.map(doc => doc.category))],
  },
});

// Seed function
export const seedOrganization = () => {
  console.info('[MSW] Organization data ready');
  return {
    gremienList: GREMIEN_LIST,
    gremienDetails: GREMIEN_DETAILS,
    documents: ORGANIZATION_DOCUMENTS,
  };
};
