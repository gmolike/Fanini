// seed/generators/eventGenerator.ts
import { dateHelpers, generateId, PREDEFINED_IDS } from '../helpers';

type EventTemplate = {
  readonly titel: string;
  readonly beschreibung: string;
  readonly typ: string;
  readonly sportbereich?: string;
  readonly dauer: number;
  readonly istOeffentlich: boolean;
  readonly budget?: number;
  readonly maxTeilnehmer?: number;
  readonly ort: {
    readonly name: string;
    readonly adresse?: {
      readonly strasse: string;
      readonly hausnummer: string;
      readonly plz: string;
      readonly stadt: string;
    };
  };
};

const EVENT_TEMPLATES: readonly EventTemplate[] = [
  // Fanfahrten
  {
    titel: 'Auswärtsfahrt Union Berlin',
    beschreibung: 'Gemeinsame Busfahrt zum Auswärtsspiel gegen Union Berlin. Abfahrt vom Vereinsheim.',
    typ: 'fanfahrt',
    dauer: 360,
    istOeffentlich: true,
    budget: 1500,
    maxTeilnehmer: 50,
    ort: {
      name: 'Stadion An der Alten Försterei',
      adresse: {
        strasse: 'An der Alten Försterei',
        hausnummer: '1',
        plz: '12555',
        stadt: 'Berlin-Köpenick'
      }
    }
  },
  {
    titel: 'Heimspiel gegen Hertha BSC II',
    beschreibung: 'Unterstützung unserer Mannschaft im Heimspiel. Treffpunkt: Fantreff am Stadion.',
    typ: 'heimspiel',
    dauer: 180,
    istOeffentlich: true,
    ort: {
      name: 'Stadion im Falkenhagener Feld',
      adresse: {
        strasse: 'Falkenseer Chaussee',
        hausnummer: '239',
        plz: '13583',
        stadt: 'Berlin-Spandau'
      }
    }
  },

  // League of Legends Events
  {
    titel: 'LoL Team Training Session',
    beschreibung: 'Intensives Training für unser League of Legends Team. Fokus auf Teamfight-Koordination.',
    typ: 'training',
    sportbereich: 'league_of_legends',
    dauer: 240,
    istOeffentlich: false,
    ort: { name: 'Discord Server - Trainingskanal' }
  },
  {
    titel: 'LoL Community Turnier',
    beschreibung: 'Offenes 5v5 Turnier für alle Vereinsmitglieder. Anfänger willkommen!',
    typ: 'turnier',
    sportbereich: 'league_of_legends',
    dauer: 480,
    istOeffentlich: true,
    maxTeilnehmer: 40,
    budget: 300,
    ort: { name: 'Online - Tournament Server' }
  },

  // Vereinstreffen
  {
    titel: 'Monatstreffen',
    beschreibung: 'Reguläres Monatstreffen mit aktuellen Themen und Planungen.',
    typ: 'vereinstreffen',
    dauer: 120,
    istOeffentlich: false,
    ort: {
      name: 'Vereinsheim Faninitiative Spandau',
      adresse: {
        strasse: 'Neuendorfer Straße',
        hausnummer: '101',
        plz: '13585',
        stadt: 'Berlin-Spandau'
      }
    }
  },
  {
    titel: 'Jahreshauptversammlung 2025',
    beschreibung: 'Wichtige Abstimmungen und Vorstandswahlen. Teilnahme nur für Mitglieder.',
    typ: 'jahreshauptversammlung',
    dauer: 180,
    istOeffentlich: false,
    ort: {
      name: 'Kulturhaus Spandau',
      adresse: {
        strasse: 'Mauerstraße',
        hausnummer: '6',
        plz: '13597',
        stadt: 'Berlin-Spandau'
      }
    }
  },

  // Social Events
  {
    titel: 'Sommerfest 2025',
    beschreibung: 'Großes Vereinsfest mit Grill, Musik und Aktivitäten für die ganze Familie.',
    typ: 'fest',
    dauer: 360,
    istOeffentlich: true,
    budget: 2000,
    maxTeilnehmer: 150,
    ort: {
      name: 'Vereinsgelände',
      adresse: {
        strasse: 'Neuendorfer Straße',
        hausnummer: '101',
        plz: '13585',
        stadt: 'Berlin-Spandau'
      }
    }
  },
  {
    titel: 'Weihnachtsfeier',
    beschreibung: 'Gemütlicher Jahresausklang mit Glühwein und Lebkuchen.',
    typ: 'fest',
    dauer: 240,
    istOeffentlich: false,
    budget: 800,
    ort: { name: 'Vereinsheim Faninitiative Spandau' }
  },

  // Creator Events
  {
    titel: 'Fan-Art Workshop',
    beschreibung: 'Workshop für kreative Fans. Gestaltet eure eigenen Fanschals und Banner!',
    typ: 'workshop',
    dauer: 180,
    istOeffentlich: true,
    budget: 400,
    maxTeilnehmer: 20,
    ort: { name: 'Kreativraum im Vereinsheim' }
  },
  {
    titel: 'Choreo-Planung Derbyspiel',
    beschreibung: 'Planung und Vorbereitung der großen Choreographie für das Derby.',
    typ: 'workshop',
    dauer: 150,
    istOeffentlich: false,
    budget: 1200,
    ort: { name: 'Vereinsheim - Großer Saal' }
  }
];

export const generateEvents = (count: number, publicRatio: number): any[] => {
  const events = [];
  const members = [
    PREDEFINED_IDS.teamEvent1,
    PREDEFINED_IDS.teamEvent2,
    PREDEFINED_IDS.beirat1,
    PREDEFINED_IDS.vorstand1
  ];

  // Stelle sicher, dass jedes Template mindestens einmal verwendet wird
  for (let i = 0; i < count; i++) {
    const template = EVENT_TEMPLATES[i % EVENT_TEMPLATES.length];
    const isPast = i % 3 === 0; // 33% vergangene Events
    const isPublic = Math.random() < publicRatio;

    const event = {
      id: generateId('evt'),
      titel: `${template.titel}${i > EVENT_TEMPLATES.length ? ` #${Math.floor(i / EVENT_TEMPLATES.length) + 1}` : ''}`,
      beschreibung: template.beschreibung,
      kurzbeschreibung: template.beschreibung.substring(0, 100) + '...',
      datum: isPast ? dateHelpers.pastEventDate() : dateHelpers.upcomingEventDate(),
      uhrzeit: `${14 + (i % 6)}:${i % 2 === 0 ? '00' : '30'}`,
      dauer: template.dauer,
      ort: JSON.stringify(template.ort),
      typ: template.typ,
      sportbereich: template.sportbereich || null,
      status: isPast ? 'ABGESCHLOSSEN' : (i % 4 === 0 ? 'GEPLANT' : 'GENEHMIGT'),
      ist_oeffentlich: isPublic,
      ist_vertraulich: false,
      verantwortlich_id: members[i % members.length],
      stellvertreter_ids: JSON.stringify([members[(i + 1) % members.length]]),
      budget: template.budget || null,
      budget_verbraucht: isPast && template.budget ? Math.floor(template.budget * 0.8) : 0,
      max_teilnehmer: template.maxTeilnehmer || null,
      anmeldeschluss: isPast ? null : dateHelpers.withinNextMonth(),
      erstellt_am: new Date(),
      erstellt_von: PREDEFINED_IDS.teamEvent1
    };

    events.push(event);
  }

  return events;
};
