// frontend/src/testing/mocks/db/schemas/event.schema.ts
import { nullable,primaryKey } from '@mswjs/data';

export const event = {
  id: primaryKey(String),
  title: String,
  date: String,
  time: String,
  location: String,
  type: String,
  description: String,
  shortDescription: nullable(String),
  image: nullable(String),
  maxParticipants: nullable(Number),
  currentParticipants: nullable(Number),
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date,
};
