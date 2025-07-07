// frontend/src/testing/mocks/db/schemas/event.schema.ts
import { nullable, primaryKey } from '@mswjs/data';

export const event = {
  id: primaryKey(String),
  title: String,
  date: String,
  time: String,
  location: String,
  type: String,
  category: String, // NEU
  organizer: String, // NEU
  description: String,
  shortDescription: nullable(String),
  image: nullable(String),
  maxParticipants: nullable(Number),
  currentParticipants: nullable(Number),
  isPublic: Boolean,
  createdAt: String, // Date -> String für JSON
  updatedAt: String, // Date -> String für JSON
};
