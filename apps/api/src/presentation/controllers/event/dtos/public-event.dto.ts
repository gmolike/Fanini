// apps/api/src/presentation/controllers/event/dtos/public-event.dto.ts
import type { Event, EventType } from '@/domain/entities/Event';
import { eventToJSON } from '@/domain/entities/Event';

// Wir importieren und nutzen die Domain Types
export type PublicEventListItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'party' | 'away' | 'meeting' | 'match' | 'concert' | 'training';
  category: 'sport' | 'culture' | 'social' | 'official';
  maxParticipants?: number;
  currentParticipants?: number;
  thumbnailImage?: string;
  isPublic: true; // Literal type für Frontend
  organizer: 'faninitiative' | 'eintracht' | 'external';
  organizerDetails?: {
    name: string;
    logo?: string;
    color: string;
  };
};

/**
 * Transformiert ein Domain Event zu einem Public Event DTO
 * Nutzt die Domain Entity und mappt sie auf das Frontend-Schema
 */
export const toPublicEventListItem = (event: Event): PublicEventListItem => {
  const baseEvent = eventToJSON(event);

  return {
    id: baseEvent.id,
    title: baseEvent.title,
    date: baseEvent.date,
    time: baseEvent.time,
    location: typeof event.location === 'object' ? event.location.name : event.location,
    type: mapEventType(event.type), // Map Domain EventType zu Frontend Type
    category: mapEventCategory(event.type),
    maxParticipants: event.maxParticipants,
    currentParticipants: 0, // TODO: Aus Repository laden
    thumbnailImage: undefined, // TODO: Aus Google Drive
    isPublic: true, // Garantiert durch Use Case
    organizer: 'faninitiative', // TODO: Dynamisch
    organizerDetails: {
      name: 'Faninitiative Spandau',
      color: '#34687e',
    }
  };
};

// Mapping von Domain EventType zu Frontend Type
const mapEventType = (domainType: EventType): PublicEventListItem['type'] => {
  const mapping: Record<EventType, PublicEventListItem['type']> = {
    'fanfahrt': 'away',
    'vereinstreffen': 'meeting',
    'sportveranstaltung': 'match',
    'social': 'party',
    'turnier': 'match',
    'workshop': 'training',
    'sitzung': 'meeting',
    'sonstiges': 'meeting'
  };
  return mapping[domainType] || 'meeting';
};

// Mapping von Domain EventType zu Frontend Category
const mapEventCategory = (domainType: EventType): PublicEventListItem['category'] => {
  const mapping: Record<EventType, PublicEventListItem['category']> = {
    'sportveranstaltung': 'sport',
    'turnier': 'sport',
    'social': 'social',
    'fanfahrt': 'sport',
    'vereinstreffen': 'official',
    'sitzung': 'official',
    'workshop': 'culture',
    'sonstiges': 'social'
  };
  return mapping[domainType] || 'social';
};
