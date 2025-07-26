// apps/api/src/infrastructure/database/seed/data/events.ts
export const eventTemplates = [
  {
    titel: "Fanfahrt nach Dresden",
    typ: "fanfahrt",
    beschreibung: "Gemeinsame Fanfahrt zum Auswärtsspiel gegen Dresden. Abfahrt vom Vereinsheim mit organisiertem Bus.",
    kurzbeschreibung: "Organisierte Busfahrt zum Auswärtsspiel",
    ist_oeffentlich: true,
    max_teilnehmer: 50,
    budget: 1500,
    dauer_minuten: 480,
    uhrzeit: "08:00:00"
  },
  {
    titel: "Public Viewing Champions League",
    typ: "social",
    beschreibung: "Gemeinsames Schauen des Champions League Spiels im Vereinsheim.",
    kurzbeschreibung: "CL-Spiel gemeinsam schauen",
    ist_oeffentlich: true,
    max_teilnehmer: 80,
    budget: 200,
    dauer_minuten: 180,
    uhrzeit: "20:00:00"
  },
  // ... weitere Templates
];

export const eventLocations = [
  {
    name: "Vereinsheim Faninitiative",
    adresse: "Spandauer Straße 42, 13587 Berlin",
    beschreibung: "Unser Vereinsheim im Herzen von Spandau"
  },
  {
    name: "Stadion am Falkenhagener Feld",
    adresse: "Falkenhagener Str. 120, 13583 Berlin",
    beschreibung: "Heimstadion von Eintracht Spandau"
  },
  // ... weitere Locations
];
