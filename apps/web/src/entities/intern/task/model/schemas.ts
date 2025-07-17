// entities/intern/task/model/schemas.ts
import { z } from 'zod';

import { createResponseSchema } from '@/shared/api/schemas/common';
import { createDTOSchemaBuilder } from '@/shared/lib/dto-schema-builder';

// Type-safe enum tuples
export const taskStatusEnum = ['offen', 'in_bearbeitung', 'review', 'erledigt', 'blockiert'] as [
  'offen',
  'in_bearbeitung',
  'review',
  'erledigt',
  'blockiert',
];
export const taskPriorityEnum = ['niedrig', 'mittel', 'hoch', 'kritisch'] as [
  'niedrig',
  'mittel',
  'hoch',
  'kritisch',
];
export const taskContextTypeEnum = ['event', 'team', 'general'] as ['event', 'team', 'general'];

// Alternative Lösung mit satisfies für bessere Type-Inference
export const TASK_STATUS_VALUES = [
  'offen',
  'in_bearbeitung',
  'review',
  'erledigt',
  'blockiert',
] satisfies readonly string[];
export const TASK_PRIORITY_VALUES = [
  'niedrig',
  'mittel',
  'hoch',
  'kritisch',
] satisfies readonly string[];
export const TASK_CONTEXT_TYPE_VALUES = ['event', 'team', 'general'] satisfies readonly string[];

// DTO und Labels
const taskDTO = z.object({
  id: z.string(),
  titel: z.string(),
  beschreibung: z.string(),
  contextType: z.string(),
  contextId: z.string(),
  verantwortlichId: z.string(),
  zugewiesenAn: z.array(z.string()),
  status: z.string(),
  prioritaet: z.string(),
  frist: z.string(),
  kategorie: z.string(),
  erstelltAm: z.string(),
  erledigtAm: z.string(),
  istStandardaufgabe: z.boolean(),
});

const taskLabels = {
  id: 'Task-ID',
  titel: 'Titel',
  beschreibung: 'Beschreibung',
  contextType: 'Kontext-Typ',
  contextId: 'Kontext-ID',
  verantwortlichId: 'Verantwortlicher',
  zugewiesenAn: 'Zugewiesen an',
  status: 'Status',
  prioritaet: 'Priorität',
  frist: 'Fälligkeitsdatum',
  kategorie: 'Kategorie',
  erstelltAm: 'Erstellt am',
  erledigtAm: 'Erledigt am',
  istStandardaufgabe: 'Standardaufgabe',
} as const;

const builder = createDTOSchemaBuilder(taskDTO, taskLabels);

// Material Schema
export const materialSchema = z.object({
  name: z.string(),
  menge: z.number(),
  einheit: z.string(),
  beschreibung: z.string().optional(),
  besorgt: z.boolean().optional(),
});

// Comment Schema
export const taskCommentSchema = z.object({
  id: z.string(),
  text: z.string(),
  autorId: z.string(),
  autor: z
    .object({
      name: z.string(),
      rolle: z.string().optional(),
      profilbild: z.string().optional(),
    })
    .optional(),
  erstelltAm: z.string(),
  erwaehntePersonen: z.array(z.string()).optional(),
});

// Task List Item Schema
export const taskListItemSchema = builder.extend(b => ({
  id: b.requiredString('id'),
  titel: b.requiredString('titel', 3),
  status: b.enum('status', taskStatusEnum),
  prioritaet: b.enum('prioritaet', taskPriorityEnum),
  contextType: b.enum('contextType', taskContextTypeEnum),
  contextId: b.optionalString('contextId'),
  verantwortlichId: b.optionalString('verantwortlichId'),
  zugewiesenAn: z.array(z.string()).default([]),
  frist: b.dateString('frist', { optional: true }),
  erstelltAm: b.dateString('erstelltAm'),
  kategorie: b.optionalString('kategorie'),
  istStandardaufgabe: z.boolean().default(false),
  // Zusätzliche Felder für List View
  verantwortlicher: z
    .object({
      id: z.string(),
      name: z.string(),
      rolle: z.string().optional(),
    })
    .optional(),
  zugewiesenePersonen: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        profilbild: z.string().optional(),
      })
    )
    .optional(),
}));
// Task Detail Schema
export const taskDetailSchema = taskListItemSchema.extend({
  beschreibung: z.string().optional(),
  erledigtAm: z.string().optional(),
  erledigtVon: z.string().optional(),
  materialien: z.array(materialSchema).default([]),
  abhaengigVon: z.array(z.string()).default([]),
  kommentare: z.array(taskCommentSchema).default([]),
  history: z
    .array(
      z.object({
        datum: z.string(),
        aktion: z.string(),
        benutzer: z.string(),
        details: z.string().optional(),
      })
    )
    .optional(),
  context: z
    .object({
      type: z.enum(taskContextTypeEnum),
      id: z.string().optional(),
      name: z.string().optional(),
      details: z.any().optional(),
    })
    .optional(),
});

// Request Schemas
export const createTaskSchema = z.object({
  titel: z.string().min(3).max(255),
  beschreibung: z.string().optional(),
  context_type: z.enum(taskContextTypeEnum),
  context_id: z.string().optional(),
  verantwortlich_id: z.string().optional(),
  prioritaet: z.enum(taskPriorityEnum).optional(),
  frist: z.string().optional(),
  materialien: z.array(materialSchema.omit({ besorgt: true })).optional(),
  abhaengig_von: z.array(z.string()).optional(),
  kategorie: z.string().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const changeTaskStatusSchema = z.object({
  status: z.enum(taskStatusEnum),
  kommentar: z.string().optional(),
});

export const assignTaskSchema = z.object({
  memberIds: z.array(z.string()),
  kommentar: z.string().optional(),
});

export const addTaskCommentSchema = z.object({
  text: z.string().min(1),
  erwaehntePersonen: z.array(z.string()).optional(),
});

// Filter Schema
export const taskFilterSchema = z.object({
  contextType: z.enum(taskContextTypeEnum).optional(),
  contextId: z.string().optional(),
  status: z.array(z.enum(taskStatusEnum)).optional(),
  prioritaet: z.array(z.enum(taskPriorityEnum)).optional(),
  nurMeine: z.boolean().optional(),
  verantwortlichId: z.string().optional(),
  zugewiesenAn: z.string().optional(),
  nurAktive: z.boolean().optional(),
  kategorie: z.string().optional(),
});

// Response Schemas
export const taskListResponseSchema = createResponseSchema(z.array(taskListItemSchema)).extend({
  meta: z
    .object({
      total: z.number(),
      filtered: z.number(),
    })
    .optional(),
});

export const taskDetailResponseSchema = createResponseSchema(taskDetailSchema);

export const taskCommentListResponseSchema = createResponseSchema(z.array(taskCommentSchema));
