// apps/api/src/infrastructure/database/seed/generators/memberGenerator.ts
import { generateId, dateHelpers } from "../helpers";
import * as bcrypt from "bcrypt";

const FIRST_NAMES = [
  "Max",
  "Anna",
  "Tim",
  "Sarah",
  "Felix",
  "Laura",
  "Jan",
  "Lisa",
  "Tom",
  "Julia",
  "Ben",
  "Emma",
  "Paul",
  "Mia",
  "Leon",
  "Sophie",
  "Finn",
  "Marie",
  "Luis",
  "Lena",
  "Noah",
  "Hannah",
  "Elias",
  "Lea",
];

const LAST_NAMES = [
  "Müller",
  "Schmidt",
  "Schneider",
  "Fischer",
  "Weber",
  "Meyer",
  "Wagner",
  "Becker",
  "Schulz",
  "Hoffmann",
  "Schäfer",
  "Koch",
  "Bauer",
  "Richter",
  "Klein",
  "Wolf",
  "Schröder",
  "Neumann",
];

const DESCRIPTIONS = [
  "Langjähriges aktives Mitglied und regelmäßig bei Heimspielen dabei.",
  "Engagiert sich besonders im Bereich Social Media und Content Creation.",
  "Organisiert regelmäßig Fanfahrten und kümmert sich um die Logistik.",
  "Unterstützt den Verein seit der ersten Stunde.",
  "Spezialist für Choreographien und visuelle Gestaltung.",
  "Kümmert sich um die Nachwuchsförderung im Verein.",
  "Aktiv im eSports-Bereich und Teamleiter des LoL-Teams.",
  "Verantwortlich für die Vereinskommunikation.",
];

export const generateMembers = async (count: number): Promise<any[]> => {
  const members = [];
  const defaultPassword = await bcrypt.hash("Mitglied2025!", 12);

  for (let i = 0; i < count; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    const randomNum = Math.floor(Math.random() * 100);

    const member = {
      id: generateId("mbr"),
      user_id: generateId("usr"),
      easyverein_id: `EV${10000 + i}`,
      vorname: firstName,
      nachname: lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@example.com`,
      telefon:
        i % 3 === 0
          ? `+49 30 ${Math.floor(Math.random() * 9000000 + 1000000)}`
          : null,
      ist_aktiv: Math.random() > 0.1,
      hat_vertraulichkeitserklaerung: Math.random() > 0.2,
      mitglied_seit: dateHelpers.randomMemberSince(),
      beschreibung: i % 4 === 0 ? DESCRIPTIONS[i % DESCRIPTIONS.length] : null,
      sichtbarkeit_email: ["oeffentlich", "intern", "privat"][i % 3], // Korrigiert
      sichtbarkeit_telefon: "privat", // Korrigiert
      sichtbarkeit_profil: ["oeffentlich", "intern"][i % 2], // Korrigiert
      password_hash: defaultPassword,
    };

    members.push(member);
  }

  return members;
};
