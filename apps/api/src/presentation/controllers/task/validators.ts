// apps/api/src/presentation/controllers/task/validators.ts
import { z } from "zod";
import type { CreateTaskDTO, UpdateTaskDTO, ChangeTaskStatusDTO } from "@/application/dto/task";

const createTaskSchema = z.object({
  titel: z.string().min(3).max(255),
  beschreibung: z.string().optional(),
  context: z.object({
    type: z.enum(["event", "team", "general"]),
    id: z.string().optional()
  }),
  verantwortlichId: z.string().optional(),
  zugewiesenAn: z.array(z.string()).optional(),
  prioritaet: z.enum(["niedrig", "mittel", "hoch", "kritisch"]),
  frist: z.string().optional(),
  materialien: z.array(z.object({
    name: z.string(),
    menge: z.number(),
    einheit: z.string(),
    beschreibung: z.string().optional()
  })).optional(),
  abhaengigVon: z.array(z.string()).optional(),
  kategorie: z.string().optional(),
  istStandardaufgabe: z.boolean().optional()
});

/**
 * Validiert Task-Erstellungsdaten
 */
export const validateCreateTask = (data: unknown): {
  isValid: boolean;
  data?: CreateTaskDTO;
  error?: string;
} => {
  try {
    const validated = createTaskSchema.parse(data);
    return {
      isValid: true,
      data: validated as CreateTaskDTO
    };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        isValid: false,
        error: err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      };
    }
    return {
      isValid: false,
      error: "Ungültige Daten"
    };
  }
};

/**
 * Validiert Task-Update-Daten
 */
export const validateUpdateTask = (data: unknown): {
  isValid: boolean;
  data?: UpdateTaskDTO;
  error?: string;
} => {
  const updateSchema = createTaskSchema.partial();

  try {
    const validated = updateSchema.parse(data);
    return {
      isValid: true,
      data: validated as UpdateTaskDTO
    };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        isValid: false,
        error: err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      };
    }
    return {
      isValid: false,
      error: "Ungültige Daten"
    };
  }
};

/**
 * Validiert Status-Änderung
 */
export const validateStatusChange = (data: unknown): {
  isValid: boolean;
  data?: ChangeTaskStatusDTO;
  error?: string;
} => {
  const statusChangeSchema = z.object({
    status: z.enum(["offen", "in_bearbeitung", "review", "erledigt", "blockiert"]),
    comment: z.string().optional(),
    actualHours: z.number().optional()
  });

  try {
    const validated = statusChangeSchema.parse(data);
    return {
      isValid: true,
      data: validated as ChangeTaskStatusDTO
    };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        isValid: false,
        error: err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      };
    }
    return {
      isValid: false,
      error: "Ungültige Daten"
    };
  }
};
