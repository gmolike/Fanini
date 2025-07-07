// shared/lib/dto-schema-builder.ts
import { z } from 'zod';

/**
 * Builder-Klasse für die Erstellung von Zod-Schemas mit DTO-basierten Validierungen
 * @template TDTOShape - Die Form des DTO-Objekts
 * @template TLabels - Die Labels für die Fehlermeldungen
 */
export class DTOSchemaBuilder<
  TDTOShape extends z.ZodRawShape,
  TLabels extends Record<string, string>,
> {
  constructor(
    private readonly dto: z.ZodObject<TDTOShape>,
    private readonly labels: TLabels
  ) {}

  /**
   * Erstellt ein erforderliches String-Schema mit Mindestlänge
   * @param key - Der Schlüssel des DTO-Feldes
   * @param minLength - Die Mindestlänge des Strings (Standard: 1)
   * @returns Zod String-Schema
   */
  requiredString(key: keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels, minLength = 1) {
    const label = this.labels[key];
    return (
      z
        // eslint-disable-next-line @typescript-eslint/naming-convention
        .string({ required_error: `${label} ist erforderlich` })
        .min(minLength, `${label} muss mindestens ${String(minLength)} Zeichen haben`)
    );
  }

  /**
   * Erstellt ein optionales String-Schema
   * @param key - Der Schlüssel des DTO-Feldes
   * @param options - Optionen für das String-Schema
   * @returns Zod Optional String-Schema
   */
  optionalString(
    key: keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels,
    options?: { minLength?: number; maxLength?: number }
  ) {
    const label = this.labels[key];
    // eslint-disable-next-line @typescript-eslint/naming-convention
    let schema = z.string({ required_error: `${label} ist erforderlich` });

    if (options?.minLength) {
      schema = schema.min(
        options.minLength,
        `${label} muss mindestens ${String(options.minLength)} Zeichen haben`
      );
    }

    if (options?.maxLength) {
      schema = schema.max(
        options.maxLength,
        `${label} darf maximal ${String(options.maxLength)} Zeichen haben`
      );
    }

    return schema.optional();
  }

  /**
   * Erstellt ein erforderliches E-Mail-Schema
   * @param key - Der Schlüssel des DTO-Feldes
   * @returns Zod E-Mail-Schema
   */
  requiredEmail(key: keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels) {
    const label = this.labels[key];
    return (
      z
        // eslint-disable-next-line @typescript-eslint/naming-convention
        .string({ required_error: `${label} ist erforderlich` })
        .min(1, `${label} ist erforderlich`)
        .email(`${label} muss eine gültige E-Mail-Adresse sein`)
    );
  }

  /**
   * Erstellt ein optionales E-Mail-Schema
   * @param key - Der Schlüssel des DTO-Feldes
   * @returns Zod Optional E-Mail-Schema
   */
  optionalEmail(key: keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels) {
    const label = this.labels[key];
    return z.string().email(`${label} muss eine gültige E-Mail-Adresse sein`).optional();
  }

  /**
   * Erstellt ein erforderliches Nummer-Schema
   * @param key - Der Schlüssel des DTO-Feldes
   * @param options - Optionen für das Number-Schema
   * @returns Zod Number-Schema
   */
  requiredNumber(
    key: keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels,
    options?: { min?: number; max?: number; int?: boolean; positive?: boolean }
  ) {
    const label = this.labels[key];
    let schema = z.number({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      required_error: `${label} ist erforderlich`,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      invalid_type_error: `${label} muss eine Zahl sein`,
    });

    if (options?.min !== undefined) {
      schema = schema.min(options.min, `${label} muss mindestens ${String(options.min)} sein`);
    }

    if (options?.max !== undefined) {
      schema = schema.max(options.max, `${label} darf maximal ${String(options.max)} sein`);
    }

    if (options?.int) {
      schema = schema.int(`${label} muss eine ganze Zahl sein`);
    }

    if (options?.positive) {
      schema = schema.positive(`${label} muss positiv sein`);
    }

    return schema;
  }

  /**
   * Erstellt ein optionales Nummer-Schema
   * @param key - Der Schlüssel des DTO-Feldes
   * @param options - Optionen für das Number-Schema
   * @returns Zod Optional Number-Schema
   */
  optionalNumber(
    key: keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels,
    options?: { min?: number; max?: number; int?: boolean; positive?: boolean }
  ) {
    const label = this.labels[key];
    let schema = z.number({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      invalid_type_error: `${label} muss eine Zahl sein`,
    });

    if (options?.min !== undefined) {
      schema = schema.min(options.min, `${label} muss mindestens ${String(options.min)} sein`);
    }

    if (options?.max !== undefined) {
      schema = schema.max(options.max, `${label} darf maximal ${String(options.max)} sein`);
    }

    if (options?.int) {
      schema = schema.int(`${label} muss eine ganze Zahl sein`);
    }

    if (options?.positive) {
      schema = schema.positive(`${label} muss positiv sein`);
    }

    return schema.optional();
  }

  /**
   * Erstellt ein Boolean-Schema mit Preprocessing
   * WICHTIG: Ohne key Parameter für generische Booleans
   * @returns Zod Boolean-Schema
   */
  boolean(): z.ZodBoolean;
  boolean(
    key: keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels,
    options?: { required?: boolean; trueMessage?: string }
  ): z.ZodEffects<z.ZodBoolean, boolean, boolean>;
  boolean(
    key?: keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels,
    options?: { required?: boolean; trueMessage?: string }
  ) {
    const baseSchema = z.boolean();

    if (key !== undefined && options?.required) {
      const label = this.labels[key];
      return baseSchema.refine(val => val, {
        message: options.trueMessage ?? `${label} muss akzeptiert werden`,
      });
    }

    return baseSchema;
  }
  /**
   * Erstellt ein Enum-Schema mit Custom Error Messages
   * @param key - Der Schlüssel des DTO-Feldes
   * @param values - Die erlaubten Enum-Werte
   * @param options - Optionale Konfiguration für Error Handling
   * @returns Zod Enum-Schema
   */
  enum<TEnum extends [string, ...string[]]>(
    key: keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels,
    values: TEnum,
    options?: {
      errorMap?: (issue: z.ZodIssueOptionalMessage, ctx: z.ErrorMapCtx) => { message: string };
      defaultError?: string;
    }
  ) {
    const label = this.labels[key];
    const errorMap =
      options?.errorMap ??
      ((issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_enum_value) {
          return {
            message:
              options?.defaultError ??
              `${label} muss einer der folgenden Werte sein: ${values.join(', ')}`,
          };
        }
        return { message: ctx.defaultError };
      });

    return z.enum(values, { errorMap });
  }

  /**
   * Erstellt ein Array-Schema
   * @param key - Der Schlüssel des DTO-Feldes
   * @param itemSchema - Das Schema für die Array-Elemente
   * @param options - Optionen für das Array-Schema
   * @returns Zod Array-Schema
   */
  array<T extends z.ZodTypeAny>(
    key: keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels,
    itemSchema: T,
    options?: { min?: number; max?: number; optional?: boolean }
  ) {
    const label = this.labels[key];
    let schema = z.array(itemSchema);

    if (options?.min !== undefined) {
      schema = schema.min(
        options.min,
        `${label} muss mindestens ${String(options.min)} Einträge haben`
      );
    }

    if (options?.max !== undefined) {
      schema = schema.max(
        options.max,
        `${label} darf maximal ${String(options.max)} Einträge haben`
      );
    }

    return options?.optional ? schema.optional() : schema;
  }

  /**
   * Erstellt ein Datums-Schema (ISO 8601 String)
   * @param key - Der Schlüssel des DTO-Feldes
   * @param options - Optionen für das Datums-Schema
   * @returns Zod String-Schema mit Datums-Validierung
   */
  dateString(
    key: keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels,
    options?: { optional?: boolean; format?: 'date' | 'datetime' }
  ) {
    const label = this.labels[key];
    const format = options?.format ?? 'datetime';

    let schema = z.string();

    if (format === 'datetime') {
      schema = schema.datetime({ message: `${label} muss ein gültiges Datum und Zeit sein` });
    } else {
      schema = schema.regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: `${label} muss im Format YYYY-MM-DD sein`,
      });
    }

    return options?.optional ? schema.optional() : schema;
  }

  /**
   * Erstellt ein URL-Schema
   * @param key - Der Schlüssel des DTO-Feldes
   * @param options - Optionen für das URL-Schema
   * @returns Zod URL-Schema
   */
  url(
    key: keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels,
    options?: { optional?: boolean; allowRelative?: boolean }
  ) {
    const label = this.labels[key];

    if (options?.allowRelative) {
      const schema = z.string().refine(
        val => {
          // Erlaubt relative URLs beginnend mit / oder vollständige URLs
          return val.startsWith('/') || z.string().url().safeParse(val).success;
        },
        { message: `${label} muss eine gültige URL oder ein relativer Pfad sein` }
      );
      return options.optional ? schema.optional() : schema;
    }

    const schema = z.string().url(`${label} muss eine gültige URL sein`);
    return options?.optional ? schema.optional() : schema;
  }

  /**
   * Erstellt ein Objekt-Schema
   * @param _key - Der Schlüssel des DTO-Feldes (mit _ prefix da nicht verwendet)
   * @param shape - Die Form des Objekts
   * @param options - Optionen für das Objekt-Schema
   * @returns Zod Objekt-Schema
   */
  object<T extends z.ZodRawShape>(
    _key: keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels,
    shape: T,
    options?: { optional?: boolean; strict?: boolean }
  ) {
    const schema = z.object(shape);

    if (options?.strict) {
      const strictSchema = z.object(shape).strict();
      return options.optional ? strictSchema.optional() : strictSchema;
    }

    return options?.optional ? schema.optional() : schema;
  }

  /**
   * Erstellt ein Union-Schema
   * @param key - Der Schlüssel des DTO-Feldes
   * @param schemas - Array von Schemas für die Union
   * @param options - Optionen für das Union-Schema
   * @returns Zod Union-Schema
   */
  union<T extends [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]>(
    key: keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels,
    schemas: T,
    options?: { optional?: boolean; errorMessage?: string }
  ) {
    const label = this.labels[key];
    const errorMessage = options?.errorMessage ?? `${label} entspricht keinem der erlaubten Typen`;

    const schema = z.union(schemas).catch(() => {
      throw new Error(errorMessage);
    });

    return options?.optional ? schema.optional() : schema;
  }

  /**
   * Erstellt ein Literal-Schema
   * @param key - Der Schlüssel des DTO-Feldes
   * @param value - Der Literal-Wert
   * @param options - Optionen für das Literal-Schema
   * @returns Zod Literal-Schema
   */
  literal<T extends string | number | boolean | null | undefined>(
    key: keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels,
    value: T,
    options?: { errorMessage?: string }
  ) {
    const label = this.labels[key];
    const errorMessage = options?.errorMessage ?? `${label} muss genau ${String(value)} sein`;

    return z.literal(value).catch(() => {
      throw new Error(errorMessage);
    });
  }

  /**
   * Helper für Refinement-Definitionen
   * @param check - Die Validierungsfunktion
   * @param options - Optionen für die Fehlermeldung
   * @returns Refinement-Objekt
   */
  refine<TInput = z.infer<z.ZodObject<TDTOShape>>>(
    check: (data: TInput) => boolean | Promise<boolean>,
    options: {
      message: string;
      path?: (keyof TInput)[];
    }
  ) {
    return {
      check,
      params: options,
    };
  }

  /**
   * Erstellt ein Transform-Schema
   * @param schema - Das Basis-Schema
   * @param transform - Die Transform-Funktion
   * @returns Transformiertes Schema
   */
  transform<TIn extends z.ZodTypeAny, TOut>(
    schema: TIn,
    transform: (value: z.infer<TIn>) => TOut
  ): z.ZodEffects<TIn, TOut> {
    return schema.transform(transform);
  }

  /**
   * Erstellt ein Preprocess-Schema
   * @param preprocess - Die Preprocess-Funktion
   * @param schema - Das Ziel-Schema
   * @returns Vorverarbeitetes Schema
   */
  preprocess<TOut extends z.ZodTypeAny>(
    preprocess: (value: unknown) => unknown,
    schema: TOut
  ): z.ZodEffects<TOut, z.infer<TOut>, unknown> {
    return z.preprocess(preprocess, schema);
  }

  /**
   * Erweitert das Basis-Schema mit zusätzlichen Feldern
   * @param overrides - Funktion die die zusätzlichen Felder definiert
   * @returns Erweitertes Zod-Schema
   */
  extend<TExtended extends z.ZodRawShape>(overrides: (builder: this) => TExtended) {
    const extended = overrides(this);
    return this.dto.extend(extended);
  }

  /**
   * Erstellt ein Pick-Schema (wählt bestimmte Felder aus)
   * @param keys - Die auszuwählenden Felder
   * @returns Pick-Schema
   */
  pick(...keys: (keyof TDTOShape)[]) {
    const picked = {} as Partial<TDTOShape>;
    keys.forEach(key => {
      if (this.dto.shape[key]) {
        picked[key] = this.dto.shape[key];
      }
    });
    return z.object(picked as TDTOShape);
  }

  /**
   * Erstellt ein Omit-Schema (schließt bestimmte Felder aus)
   * @param keys - Die auszuschließenden Felder
   * @returns Omit-Schema
   */
  omit(...keys: (keyof TDTOShape)[]) {
    const shape = { ...this.dto.shape };
    keys.forEach(key => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete shape[key];
    });
    return z.object(shape);
  }

  /**
   * Erstellt ein Partial-Schema (alle Felder optional)
   * @returns Partial-Schema
   */
  partial() {
    return this.dto.partial();
  }

  /**
   * Erstellt ein Required-Schema (alle Felder erforderlich)
   * @returns Required-Schema
   */
  required() {
    return this.dto.required();
  }

  /**
   * Gibt das zugrundeliegende DTO-Schema zurück
   * @returns Das DTO-Schema
   */
  getDTO() {
    return this.dto;
  }

  /**
   * Gibt die Labels zurück
   * @returns Die Label-Map
   */
  getLabels() {
    return this.labels;
  }
}

/**
 * Factory-Funktion zum Erstellen eines DTOSchemaBuilders
 * @param dto - Das Basis-DTO-Schema
 * @param labels - Die Labels für Fehlermeldungen
 * @returns Eine neue DTOSchemaBuilder-Instanz
 * @example
 * ```typescript
 * const userDTO = z.object({
 *   email: z.string(),
 *   name: z.string(),
 *   age: z.number(),
 * });
 *
 * const userLabels = {
 *   email: 'E-Mail-Adresse',
 *   name: 'Name',
 *   age: 'Alter',
 * };
 *
 * const builder = createDTOSchemaBuilder(userDTO, userLabels);
 * const schema = builder.extend((b) => ({
 *   email: b.requiredEmail('email'),
 *   name: b.requiredString('name', 2),
 *   age: b.requiredNumber('age', { min: 18, max: 120 }),
 * }));
 * ```
 */
export const createDTOSchemaBuilder = <
  TDTOShape extends z.ZodRawShape,
  TLabels extends Record<string, string>,
>(
  dto: z.ZodObject<TDTOShape>,
  labels: TLabels
): DTOSchemaBuilder<TDTOShape, TLabels> => {
  return new DTOSchemaBuilder(dto, labels);
};
