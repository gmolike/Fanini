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
   * Erstellt ein erforderliches Nummer-Schema
   * @param key - Der Schlüssel des DTO-Feldes
   * @returns Zod Number-Schema
   */
  requiredNumber(key: keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels) {
    const label = this.labels[key];
    return z.number({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      required_error: `${label} ist erforderlich`,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      invalid_type_error: `${label} muss eine Zahl sein`,
    });
  }

  /**
   * Erstellt ein optionales String-Schema
   * @param key - Der Schlüssel des DTO-Feldes
   * @returns Zod Optional String-Schema
   */
  optionalString(key: keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels) {
    const label = this.labels[key];
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return z.string({ required_error: `${label} ist erforderlich` }).optional();
  }

  /**
   * Erstellt ein Boolean-Schema mit Preprocessing
   * @returns Zod Boolean-Schema
   */
  boolean() {
    return z.preprocess(val => val ?? false, z.boolean());
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
   * Erweitert das Basis-Schema mit zusätzlichen Feldern
   * @param overrides - Funktion die die zusätzlichen Felder definiert
   * @param options - Optionale Konfiguration (strict mode, refinements)
   * @returns Erweitertes Zod-Schema
   */
  extend(
    overrides: (builder: this) => z.ZodRawShape,
    options?: {
      strict?: boolean;
      refine?: {
        check: (data: z.infer<z.ZodObject<TDTOShape>>) => boolean | Promise<boolean>;
        params: { message: string; path?: string[] };
      }[];
    }
  ): z.ZodTypeAny {
    const extended = overrides(this);
    let schema: z.ZodTypeAny = this.dto.extend(extended);

    // Apply strict mode if requested and apply refinements
    if (options?.strict && schema instanceof z.ZodObject) {
      schema = schema.strict();
    }

    // Apply refinements
    if (options?.refine) {
      options.refine.forEach(refinement => {
        schema = schema.refine(refinement.check, refinement.params);
      });
    }

    return schema;
  }
}

/**
 * Factory-Funktion zum Erstellen eines DTOSchemaBuilders
 * @param dto - Das Basis-DTO-Schema
 * @param labels - Die Labels für Fehlermeldungen
 * @returns Eine neue DTOSchemaBuilder-Instanz
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
