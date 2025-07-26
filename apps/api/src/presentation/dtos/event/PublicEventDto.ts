// apps/api/src/presentation/dtos/event/PublicEventDto.ts
import type { Event } from "@/domain/entities/Event";
import { eventToJSON } from "@/domain/entities/Event";

export type PublicEventListItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "party" | "away" | "meeting" | "match" | "concert" | "training";
  category: "sport" | "culture" | "social" | "official";
  maxParticipants?: number;
  currentParticipants?: number;
  thumbnailImage?: string;
  isPublic: true; // Literal type!
  organizer: "faninitiative" | "eintracht" | "external";
  organizerDetails?: {
    name: string;
    logo?: string;
    color: string;
  };
};

export const toPublicEventListItem = (event: Event): PublicEventListItem => {
  const baseEvent = eventToJSON(event);

  return {
    id: baseEvent.id,
    title: baseEvent.title,
    date: baseEvent.date,
    time: baseEvent.time,
    location:
      typeof event.location === "object" ? event.location.name : event.location,
    type: mapEventType(event.type),
    category: mapEventCategory(event.type),
    maxParticipants: event.maxParticipants,
    currentParticipants: 0, // TODO: Aus EventTeilnahme berechnen
    thumbnailImage: undefined, // TODO: Aus Google Drive Integration
    isPublic: true as const, // Literal type assertion!
    organizer: "faninitiative", // TODO: Dynamisch aus event.createdBy
    organizerDetails: {
      name: "Faninitiative Spandau",
      color: "#34687e",
    },
  };
};

const mapEventType = (backendType: string): PublicEventListItem["type"] => {
  const mapping: Record<string, PublicEventListItem["type"]> = {
    fanfahrt: "away",
    vereinstreffen: "meeting",
    sportveranstaltung: "match",
    social: "party",
    turnier: "match",
    workshop: "training",
    sitzung: "meeting",
    sonstiges: "meeting",
  };
  return mapping[backendType] || "meeting";
};

const mapEventCategory = (
  backendType: string,
): PublicEventListItem["category"] => {
  const mapping: Record<string, PublicEventListItem["category"]> = {
    sportveranstaltung: "sport",
    turnier: "sport",
    social: "social",
    fanfahrt: "sport",
    vereinstreffen: "official",
    sitzung: "official",
    workshop: "culture",
    sonstiges: "social",
  };
  return mapping[backendType] || "social";
};
