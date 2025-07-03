/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-lines */
// frontend/src/testing/mocks/db/seeds/teamHistory.seed.ts
import type {
  AvailableYearsResponse,
  BallerContent,
  FaniniContent,
  LolContent,
  TeamHistoryYearResponse,
} from '@/entities/public/team-history';

// 2022 Data
export const TEAM_HISTORY_DATA_2022: TeamHistoryYearResponse = {
  id: '2022',
  year: 2022,
  faniniComment: {
    id: 'comment-2022',
    year: 2022,
    headline: 'Die Geburt einer Legende',
    content:
      'Nach der Gründung von Eintracht Spandau Ende 2021 durch HandOfBlood startete 2022 das erste volle Jahr. Als noch informelle Fangruppe begleiteten wir das neue LoL-Team durch ihre unglaubliche Debütsaison.',
    author: 'Die Spandauer Fans',
    highlights: [
      'Miracle Run von 0-4 Start zum 2. Platz Prime League Spring',
      'Erste EU Masters Teilnahme in der Vereinsgeschichte',
      'Pride wird zum Publikumsliebling',
      'Über 100.000 Viewer bei den Spring Finals',
    ],
    lowlights: ['Schwacher Saisonstart mit 0-4 Bilanz', 'Früher Exit bei EU Masters (9. Platz)'],
    outlook: 'Mit erfahreneren Spielern wollen wir 2023 den nächsten Schritt machen.',
  },
  teams: [
    {
      id: 'lol-2022',
      year: 2022,
      teamType: 'lol',
      content: {
        id: 'lol-content-2022',
        type: 'lol',
        roster: [
          {
            id: 'pride-2022',
            ign: 'Pride',
            realName: 'Adrian Busse',
            role: 'Top',
            joinedDate: '2022-01-01',
            socialLinks: {
              id: 'pride-social',
              twitter: '@PrideLoL',
            },
          },
          {
            id: 'obsess-2022',
            ign: 'Obsess',
            role: 'Jungle',
            joinedDate: '2022-01-01',
          },
          {
            id: 'special-2022',
            ign: 'Special',
            realName: 'Patrik Salen',
            role: 'Mid',
            joinedDate: '2022-01-01',
          },
          {
            id: 'kynetic-2022',
            ign: 'Kynetic',
            role: 'Bot',
            joinedDate: '2022-01-01',
            leftDate: '2022-12-31',
          },
          {
            id: 'prime-2022',
            ign: 'Prime',
            role: 'Support',
            joinedDate: '2022-01-01',
            leftDate: '2022-12-31',
          },
        ],
        coaches: [
          {
            id: 'nrated-2022',
            name: 'Christoph "nRated" Seitz',
            role: 'Head Coach',
            period: '2022',
          },
          {
            id: 'chickenhero-2022',
            name: 'chickenhero',
            role: 'Assistant Coach',
            period: '2022',
          },
        ],
        achievements: [
          {
            id: 'pl-spring-2022',
            title: 'Prime League Spring 2022 - 2. Platz',
            date: '2022-04-10',
            description: 'Finale gegen BIG verloren',
          },
          {
            id: 'eum-spring-2022',
            title: 'EU Masters Spring 2022 Teilnahme',
            date: '2022-04-20',
            description: 'Erste internationale Teilnahme',
          },
        ],
        seasons: [
          {
            id: 'spring-2022',
            name: 'Spring Split 2022',
            placement: 2,
            wins: 11,
            losses: 9,
            tournaments: [
              {
                id: 'pl-spring-reg-2022',
                name: 'Prime League Spring Regular Season',
                placement: '5. Platz',
                date: '2022-03-15',
              },
              {
                id: 'pl-spring-po-2022',
                name: 'Prime League Spring Playoffs',
                placement: '2. Platz',
                date: '2022-04-10',
              },
            ],
          },
          {
            id: 'summer-2022',
            name: 'Summer Split 2022',
            placement: 5,
            wins: 11,
            losses: 7,
            tournaments: [
              {
                id: 'pl-summer-reg-2022',
                name: 'Prime League Summer Regular Season',
                placement: '4. Platz',
                date: '2022-08-20',
              },
            ],
          },
        ],
        highlights: [
          'Miracle Run von 0-4 zu den Finals',
          'Pride MVP Performance in den Playoffs',
          'Sieg gegen SK Gaming Prime im Halbfinale',
        ],
      } as LolContent,
      faniniComment: 'Ein unglaubliches erstes Jahr für unser Team!',
      createdAt: '2022-01-01T00:00:00Z',
      updatedAt: '2022-12-31T23:59:59Z',
    },
    {
      id: 'fanini-2022',
      year: 2022,
      teamType: 'fanini',
      content: {
        id: 'fanini-content-2022',
        type: 'fanini',
        title: 'Die informellen Anfänge',
        description:
          'Als lose Gruppe von Eintracht Spandau Fans organisierten wir erste Viewing Parties und unterstützten das Team bei jedem Spiel.',
        activities: [
          {
            id: 'viewing-spring-finals',
            name: 'Spring Finals Viewing Party',
            date: '2022-04-10',
            participants: 150,
            description: 'Gemeinsames Schauen der Prime League Finals im Spandauer Bock',
          },
          {
            id: 'first-choreo',
            name: 'Erste Fan-Choreographie',
            date: '2022-08-15',
            participants: 50,
            description: 'Selbstgemachtes Banner "Spandau kämpft" bei den Summer Playoffs',
          },
        ],
        members: 200,
        images: ['/images/viewing-party-2022.jpg'],
      } as FaniniContent,
      faniniComment: 'Der Beginn einer wunderbaren Fan-Community',
      createdAt: '2022-01-01T00:00:00Z',
      updatedAt: '2022-12-31T23:59:59Z',
    },
  ],
  specialEvents: [
    {
      id: 'eins-founding',
      type: 'special',
      title: 'Gründung Eintracht Spandau',
      date: '2021-11-14',
      description:
        'HandOfBlood gründet zusammen mit INSTINCT3 und Jung von Matt NERD die Eintracht Spandau GmbH',
      category: 'milestone',
    },
  ],
};

// 2023 Data
export const TEAM_HISTORY_DATA_2023: TeamHistoryYearResponse = {
  id: '2023',
  year: 2023,
  faniniComment: {
    id: 'comment-2023',
    year: 2023,
    headline: 'Veteranen und Stabilität',
    content:
      'Mit einem Mix aus erfahrenen Spielern etablierte sich Eintracht Spandau als konstanter Playoff-Anwärter. Unsere Fan-Community wuchs stetig.',
    author: 'Die Spandauer Fans',
    highlights: [
      'Zanzarah (Ex-LEC) verstärkt das Team',
      'Konstante Playoff-Teilnahmen',
      '3. Platz im Summer Split',
      'Über 500 aktive Fans in unserer Community',
    ],
    lowlights: ['Keine EU Masters Qualifikation', 'Knappe Playoff-Niederlagen'],
    outlook: '2024 soll unser Jahr werden - mit dem Ziel EU Masters!',
  },
  teams: [
    {
      id: 'lol-2023',
      year: 2023,
      teamType: 'lol',
      content: {
        id: 'lol-content-2023',
        type: 'lol',
        roster: [
          {
            id: 'pride-2023',
            ign: 'Pride',
            realName: 'Adrian Busse',
            role: 'Top',
            joinedDate: '2022-01-01',
          },
          {
            id: 'zanzarah-2023',
            ign: 'Zanzarah',
            realName: 'Yasin Dinçer',
            role: 'Jungle',
            joinedDate: '2023-01-01',
            socialLinks: {
              id: 'zanzarah-social',
              twitter: '@Zanzarah_LoL',
            },
          },
          {
            id: 'special-2023',
            ign: 'Special',
            realName: 'Patrik Salen',
            role: 'Mid',
            joinedDate: '2022-01-01',
          },
          {
            id: 'smiley-2023',
            ign: 'SMILEY',
            role: 'Bot',
            joinedDate: '2023-01-01',
          },
          {
            id: 'lilipp-2023',
            ign: 'Lilipp',
            realName: 'Philipp Englert',
            role: 'Support',
            joinedDate: '2023-01-01',
          },
        ],
        coaches: [
          {
            id: 'chickenhero-2023',
            name: 'chickenhero',
            role: 'Head Coach',
            period: '2023',
          },
        ],
        achievements: [
          {
            id: 'pl-summer-2023',
            title: 'Prime League Summer 2023 - 3. Platz',
            date: '2023-08-25',
            description: '€3,000 Preisgeld gewonnen',
          },
        ],
        seasons: [
          {
            id: 'spring-2023',
            name: 'Spring Split 2023',
            placement: 6,
            wins: 9,
            losses: 9,
            tournaments: [
              {
                id: 'pl-spring-2023',
                name: 'Prime League Spring 2023',
                placement: '6. Platz',
                date: '2023-04-15',
              },
            ],
          },
          {
            id: 'summer-2023',
            name: 'Summer Split 2023',
            placement: 3,
            wins: 12,
            losses: 8,
            tournaments: [
              {
                id: 'pl-summer-2023',
                name: 'Prime League Summer 2023',
                placement: '3. Platz',
                date: '2023-08-25',
              },
            ],
          },
        ],
        highlights: [
          'Zanzarah bringt LEC-Erfahrung ins Team',
          'Konstante Performance über beide Splits',
          'Starke Teamchemie entwickelt',
        ],
      } as LolContent,
      faniniComment: 'Ein Jahr des Aufbaus und der Stabilität',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-12-31T23:59:59Z',
    },
    {
      id: 'fanini-2023',
      year: 2023,
      teamType: 'fanini',
      content: {
        id: 'fanini-content-2023',
        type: 'fanini',
        title: 'Wachstum und Organisation',
        description:
          'Die Fan-Community wächst stetig und professionalisiert sich. Regelmäßige Events und Treffen werden zur Tradition.',
        activities: [
          {
            id: 'regular-meetings-2023',
            name: 'Monatliche Fan-Treffen',
            date: '2023-01-01',
            participants: 40,
            description: 'Jeden ersten Samstag im Monat im Spandauer Bock',
          },
          {
            id: 'summer-bbq-2023',
            name: 'Großes Sommerfest',
            date: '2023-07-15',
            participants: 300,
            description: 'BBQ mit Spielern und Management',
          },
          {
            id: 'playoff-support-2023',
            name: 'Playoff-Unterstützung',
            date: '2023-08-25',
            participants: 120,
            description: 'Busfahrt zu den Summer Playoffs nach Köln',
          },
        ],
        members: 500,
        images: ['/images/sommerfest-2023.jpg', '/images/playoffs-2023.jpg'],
      } as FaniniContent,
      faniniComment: 'Die Community wächst und gedeiht',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-12-31T23:59:59Z',
    },
  ],
  specialEvents: [],
};

// 2024 Data
export const TEAM_HISTORY_DATA_2024: TeamHistoryYearResponse = {
  id: '2024',
  year: 2024,
  faniniComment: {
    id: 'comment-2024',
    year: 2024,
    headline: 'Champions! Der Traum wird wahr!',
    content:
      'Das erfolgreichste Jahr der Vereinsgeschichte! EMEA Masters Sieg und Expansion in die Baller League. Ein Jahr für die Geschichtsbücher.',
    author: 'Die Spandauer Fans',
    highlights: [
      'EMEA MASTERS CHAMPIONS!',
      'Prime League Spring Sieger',
      'PowerOfEvil MVP der EMEA Masters Finals',
      'Erste deutsche Sieger seit BIG 2019',
      'Eintritt in die Baller League',
      'Bürgermeister Kai Wegner empfängt das Team',
    ],
    lowlights: [
      'Verpasste Summer Qualifikation für EU Masters',
      'Mittelmäßige Baller League Performance',
    ],
    outlook: 'Die Weichen für 2025 sind gestellt - aber in welche Richtung?',
  },
  teams: [
    {
      id: 'lol-2024',
      year: 2024,
      teamType: 'lol',
      content: {
        id: 'lol-content-2024',
        type: 'lol',
        roster: [
          {
            id: 'vertigo-2024',
            ign: 'Vertigo',
            role: 'Top',
            joinedDate: '2024-01-01',
          },
          {
            id: 'zanzarah-2024',
            ign: 'Zanzarah',
            realName: 'Yasin Dinçer',
            role: 'Jungle',
            joinedDate: '2023-01-01',
          },
          {
            id: 'poe-2024',
            ign: 'PowerOfEvil',
            realName: 'Tristan Schrage',
            role: 'Mid',
            joinedDate: '2024-01-01',
            socialLinks: {
              id: 'poe-social',
              twitter: '@PowerOfEvilLoL',
              twitch: 'powerofevil',
            },
          },
          {
            id: 'funkey-2024',
            ign: 'Fun K3y',
            role: 'Bot',
            joinedDate: '2024-01-01',
          },
          {
            id: 'lilipp-2024',
            ign: 'Lilipp',
            realName: 'Philipp Englert',
            role: 'Support',
            joinedDate: '2023-01-01',
          },
        ],
        coaches: [
          {
            id: 'chickenhero-2024',
            name: 'chickenhero',
            role: 'Head Coach',
            period: '2024',
          },
        ],
        achievements: [
          {
            id: 'pl-spring-champion',
            title: 'Prime League Spring 2024 Champion',
            date: '2024-04-14',
            description: 'Finalsieg gegen NNO Esports',
            icon: 'trophy',
          },
          {
            id: 'emea-masters-champion',
            title: 'EMEA Masters Spring 2024 Champion',
            date: '2024-05-12',
            description: '3-1 Sieg gegen Beşiktaş Esports',
            icon: 'trophy',
          },
        ],
        seasons: [
          {
            id: 'spring-2024',
            name: 'Spring Split 2024',
            placement: 1,
            wins: 16,
            losses: 6,
            tournaments: [
              {
                id: 'pl-spring-champion-2024',
                name: 'Prime League Spring 2024',
                placement: '1. Platz - CHAMPION',
                date: '2024-04-14',
              },
              {
                id: 'emea-masters-2024',
                name: 'EMEA Masters Spring 2024',
                placement: '1. Platz - CHAMPION',
                date: '2024-05-12',
              },
            ],
          },
          {
            id: 'summer-2024',
            name: 'Summer Split 2024',
            placement: 7,
            wins: 8,
            losses: 10,
            tournaments: [
              {
                id: 'pl-summer-2024',
                name: 'Prime League Summer 2024',
                placement: '7. Platz',
                date: '2024-08-20',
              },
            ],
          },
        ],
        highlights: [
          'PowerOfEvil EMEA Masters Finals MVP',
          '$21,400 Preisgeld bei EMEA Masters',
          'Dominante Playoff-Performance',
          'Erster deutscher EMEA Masters Sieger seit 2019',
        ],
      } as LolContent,
      faniniComment: 'Der absolute Höhepunkt unserer bisherigen Geschichte!',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-12-31T23:59:59Z',
    },
    {
      id: 'baller-2024',
      year: 2024,
      teamType: 'baller',
      content: {
        id: 'baller-content-2024',
        type: 'baller',
        squad: [
          {
            id: 'gk-2024',
            name: 'Leon Kotte',
            position: 'TW',
            jerseyNumber: 1,
          },
          {
            id: 'def1-2024',
            name: 'Max Schulze',
            position: 'IV',
            jerseyNumber: 4,
          },
          {
            id: 'def2-2024',
            name: 'Tom Wagner',
            position: 'LV',
            jerseyNumber: 3,
          },
          {
            id: 'mid1-2024',
            name: 'Kevin Müller',
            position: 'ZM',
            jerseyNumber: 8,
          },
          {
            id: 'mid2-2024',
            name: 'Fabian Klein',
            position: 'RM',
            jerseyNumber: 7,
          },
          {
            id: 'fw1-2024',
            name: 'Julius Richter',
            position: 'ST',
            jerseyNumber: 9,
            goals: 18,
          },
        ],
        coaches: [
          {
            id: 'sarpei-2024',
            name: 'Hans Sarpei',
            role: 'Co-Trainer',
            period: '2024',
          },
          {
            id: 'knabe-2024',
            name: 'Maximilian "Präsident" Knabe',
            role: 'Co-Trainer & Entertainment',
            period: '2024',
          },
        ],
        seasonStats: {
          id: 'stats-2024',
          played: 16,
          won: 6,
          drawn: 4,
          lost: 6,
          goalsFor: 48,
          goalsAgainst: 52,
          points: 22,
          position: 6,
        },
        highlights: [
          {
            id: 'debut-win',
            opponent: 'FC St. Pauli',
            result: '8:6',
            date: '2024-02-15',
            description: 'Spektakulärer Sieg im ersten Spiel',
          },
          {
            id: 'derby-win',
            opponent: 'Beton Berlin',
            result: '5:4',
            date: '2024-03-20',
            description: 'Dramatischer Derby-Sieg',
          },
        ],
        finalTable: [
          {
            id: 'table1',
            position: 1,
            team: 'Beton Berlin',
            played: 16,
            points: 35,
            goalDifference: '+25',
          },
          {
            id: 'table6',
            position: 6,
            team: 'Eintracht Spandau',
            played: 16,
            points: 22,
            goalDifference: '-4',
          },
        ],
      } as BallerContent,
      faniniComment: 'Erste Schritte im Fußball - Entertainment pur!',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-12-31T23:59:59Z',
    },
    {
      id: 'fanini-2024',
      year: 2024,
      teamType: 'fanini',
      content: {
        id: 'fanini-content-2024',
        type: 'fanini',
        title: 'Das Jahr der Triumphe',
        description:
          'Als Fans erleben wir das erfolgreichste Jahr der Vereinsgeschichte mit. EMEA Masters Sieg und Baller League Start!',
        activities: [
          {
            id: 'emea-viewing',
            name: 'EMEA Masters Finals Viewing',
            date: '2024-05-12',
            participants: 500,
            description: 'Größte Viewing Party ever - 500 Fans feiern den Titel!',
            images: ['/images/emea-celebration.jpg'],
          },
          {
            id: 'baller-launch',
            name: 'Baller League Launch Party',
            date: '2024-01-10',
            participants: 200,
            description: 'Feier zum Start in die Baller League',
          },
          {
            id: 'championship-parade',
            name: 'Meisterfeier am Rathaus',
            date: '2024-05-15',
            participants: 1000,
            description: 'Empfang beim Bürgermeister nach EMEA Masters Sieg',
            images: ['/images/rathaus-2024.jpg'],
          },
        ],
        members: 800,
      } as FaniniContent,
      faniniComment: 'Ein unvergessliches Jahr!',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-12-31T23:59:59Z',
    },
  ],
  specialEvents: [
    {
      id: 'emea-victory',
      type: 'special',
      title: 'EMEA Masters Triumph',
      date: '2024-05-12',
      description: 'Eintracht Spandau krönt sich zum Europameister',
      category: 'championship',
      images: ['/images/emea-trophy.jpg'],
    },
    {
      id: 'baller-league-entry',
      type: 'special',
      title: 'Eintritt in die Baller League',
      date: '2024-01-10',
      description: 'Als erste E-Sport Organisation im traditionellen Fußball',
      category: 'milestone',
    },
  ],
};

// 2025 Data
export const TEAM_HISTORY_DATA_2025: TeamHistoryYearResponse = {
  id: '2025',
  year: 2025,
  faniniComment: {
    id: 'comment-2025',
    year: 2025,
    headline: 'Neue Wege - Faninitiative wird offiziell!',
    content:
      'Ein Jahr der Transformation. Während das LoL-Team auf Entertainment setzt, gründen wir endlich unseren eigenen Verein: Die Faninitiative Spandau e.V. ist geboren!',
    author: 'Anna Schmidt, 1. Vorsitzende Faninitiative Spandau e.V.',
    highlights: [
      'GRÜNDUNG FANINITIATIVE SPANDAU E.V.!',
      'Über 70 Gründungsmitglieder',
      'Santorin verstärkt das LoL-Team',
      'Baller League Season 3 in Berlin',
      'Vereinsheim-Suche läuft',
    ],
    lowlights: [
      'LoL-Team letzter Platz Winter Split',
      'Entertainment über Competition Strategie',
      'Broeki als "schlechtester Spieler der Liga"',
    ],
    outlook: 'Mit unserem neuen Verein schaffen wir die Basis für die nächsten Jahrzehnte!',
  },
  teams: [
    {
      id: 'lol-2025',
      year: 2025,
      teamType: 'lol',
      content: {
        id: 'lol-content-2025',
        type: 'lol',
        roster: [
          {
            id: 'pride-2025',
            ign: 'Pride',
            realName: 'Adrian Busse',
            role: 'Top',
            joinedDate: '2022-01-01',
          },
          {
            id: 'santorin-2025',
            ign: 'Santorin',
            realName: 'Lucas Tao Kilmer Larsen',
            role: 'Jungle',
            joinedDate: '2025-04-01',
            socialLinks: {
              id: 'santorin-social',
              twitter: '@Santorin',
            },
          },
          {
            id: 'poe-2025',
            ign: 'PowerOfEvil',
            realName: 'Tristan Schrage',
            role: 'Mid',
            joinedDate: '2024-01-01',
          },
          {
            id: 'broeki-2025',
            ign: 'Broeki',
            realName: 'Daniel Broekmann',
            role: 'Bot',
            joinedDate: '2025-01-01',
            socialLinks: {
              id: 'broeki-social',
              twitch: 'broeki',
            },
          },
          {
            id: 'lilipp-2025',
            ign: 'Lilipp',
            realName: 'Philipp Englert',
            role: 'Support',
            joinedDate: '2023-01-01',
          },
        ],
        coaches: [],
        achievements: [],
        seasons: [
          {
            id: 'winter-2025',
            name: 'Winter Split 2025',
            placement: 10,
            wins: 0,
            losses: 9,
            tournaments: [
              {
                id: 'pl-winter-2025',
                name: 'Prime League Winter 2025',
                placement: '10. Platz (Letzter)',
                date: '2025-02-28',
              },
            ],
          },
          {
            id: 'spring-2025',
            name: 'Spring Split 2025',
            placement: 8,
            wins: 4,
            losses: 10,
            tournaments: [],
          },
        ],
        highlights: [
          'Santorin-Verpflichtung als Notfall-Transfer',
          'Entertainment-First Strategie',
          'Reduziertes Training und Budget',
        ],
      } as LolContent,
      faniniComment: 'Ein schwieriges Jahr competitive, aber unterhaltsam!',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-07-02T23:59:59Z',
    },
    {
      id: 'baller-2025',
      year: 2025,
      teamType: 'baller',
      content: {
        id: 'baller-content-2025',
        type: 'baller',
        squad: [
          {
            id: 'gk-2025',
            name: 'Leon Kotte',
            position: 'TW',
            jerseyNumber: 1,
          },
          {
            id: 'def-2025',
            name: 'Neuzugang Verteidiger',
            position: 'IV',
            jerseyNumber: 5,
          },
          {
            id: 'mid-2025',
            name: 'Mittelfeld Star',
            position: 'ZM',
            jerseyNumber: 10,
          },
          {
            id: 'fw-2025',
            name: 'Torjäger',
            position: 'ST',
            jerseyNumber: 9,
            goals: 12,
          },
        ],
        coaches: [
          {
            id: 'sarpei-2025',
            name: 'Hans Sarpei',
            role: 'Co-Trainer',
            period: '2025',
          },
          {
            id: 'knabe-2025',
            name: 'Maximilian "Präsident" Knabe',
            role: 'Co-Trainer & Entertainment',
            period: '2025',
          },
        ],
        seasonStats: {
          id: 'stats-2025',
          played: 6,
          won: 2,
          drawn: 1,
          lost: 3,
          goalsFor: 18,
          goalsAgainst: 24,
          points: 7,
          position: 5,
        },
        highlights: [
          {
            id: 'podolski-match',
            opponent: 'Streets United (Podolski)',
            result: '3:6',
            date: '2025-03-20',
            description: 'Niederlage gegen Podolskis Team',
          },
          {
            id: 'berlin-home',
            opponent: 'Delay Sports Berlin',
            result: '7:5',
            date: '2025-04-10',
            description: 'Erster Heimsieg in Berlin',
          },
        ],
        finalTable: [],
      } as BallerContent,
      faniniComment: 'Season 3 läuft noch - Kampf um die Playoffs!',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-07-02T23:59:59Z',
    },
    {
      id: 'fanini-2025',
      year: 2025,
      teamType: 'fanini',
      content: {
        id: 'fanini-content-2025',
        type: 'fanini',
        title: 'Faninitiative Spandau e.V. - Offiziell gegründet!',
        description:
          'Nach Jahren als informelle Gruppe ist es endlich soweit: Die Faninitiative Spandau wird zum eingetragenen Verein!',
        activities: [
          {
            id: 'founding-2025',
            name: 'Gründungsversammlung',
            date: '2025-01-15',
            participants: 70,
            description: 'Historische Gründung des Faninitiative Spandau e.V.',
            images: ['/images/gruendung-fanini.jpg'],
          },
          {
            id: 'first-agm',
            name: 'Erste Mitgliederversammlung',
            date: '2025-03-20',
            participants: 85,
            description: 'Wahl des ersten offiziellen Vorstands',
          },
          {
            id: 'baller-berlin',
            name: 'Baller League Berlin Support',
            date: '2025-03-01',
            participants: 200,
            description: 'Unterstützung bei jedem Heimspiel im Hangar 7',
          },
        ],
        members: 156,
        foundedDate: '2025-01-15',
      } as FaniniContent,
      faniniComment: 'Ein historischer Moment für alle Spandau-Fans!',
      createdAt: '2025-01-15T00:00:00Z',
      updatedAt: '2025-07-02T23:59:59Z',
    },
  ],
  specialEvents: [
    {
      id: 'fanini-founding',
      type: 'special',
      title: 'Gründung Faninitiative Spandau e.V.',
      date: '2025-01-15',
      description: 'Der Fanverein wird offiziell als eingetragener Verein gegründet',
      category: 'milestone',
    },
    {
      id: 'baller-berlin',
      type: 'special',
      title: 'Baller League kommt nach Berlin',
      date: '2025-03-01',
      description: 'Season 3 wird im Hangar 7 am Tempelhofer Flughafen ausgetragen',
      category: 'celebration',
    },
  ],
};

// Helper data
export const YEAR_DATA_MAP: Record<number, TeamHistoryYearResponse> = {
  2022: TEAM_HISTORY_DATA_2022,
  2023: TEAM_HISTORY_DATA_2023,
  2024: TEAM_HISTORY_DATA_2024,
  2025: TEAM_HISTORY_DATA_2025,
} as const;

export const createAvailableYearsResponse = (): AvailableYearsResponse => ({
  id: 'available-years',
  years: [2022, 2023, 2024, 2025],
  teamTypes: {
    2022: ['lol', 'fanini'],
    2023: ['lol', 'fanini'],
    2024: ['lol', 'baller', 'fanini'],
    2025: ['lol', 'baller', 'fanini'],
  },
});

// Seed function for development
export const seedTeamHistory = () => {
  console.info('[MSW] Team History data ready for all years (2022-2025)');
  return {
    yearData: YEAR_DATA_MAP,
    availableYears: createAvailableYearsResponse(),
  };
};
