// testing/mocks/db/schemas/organization.schema.ts
import { nullable, primaryKey } from '@mswjs/data';

export const boardMember = {
  id: primaryKey(String),
  name: String,
  role: String,
  roleLabel: String,
  email: nullable(String),
  phone: nullable(String),
  image: nullable(String),
  description: nullable(String),
  memberSince: String,
  responsibilities: Array,
  order: Number,
};

export const document = {
  id: primaryKey(String),
  title: String,
  type: String,
  fileUrl: String,
  fileSize: Number,
  updatedAt: String,
  category: String,
};
