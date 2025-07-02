// shared/lib/dto-schema-builder.ts
import { z } from 'zod';

export class DTOSchemaBuilder<
  TDTOShape extends z.ZodRawShape,
  TLabels extends Record<string, string>,
> {
  constructor(
    private readonly dto: z.ZodObject<TDTOShape>,
    private readonly labels: TLabels
  ) {}

  // Methoden mit DTO-Key Constraint
  requiredString(key: keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels, minLength = 1) {
    return z
      .string({ required_error: `${this.labels[key]} ist erforderlich` })
      .min(minLength, `${this.labels[key]} muss mindestens ${minLength} Zeichen haben`);
  }

  requiredEmail<TKey extends keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels>(key: TKey) {
    return z
      .string({ required_error: `${this.labels[key]} ist erforderlich` })
      .min(1, `${this.labels[key]} ist erforderlich`)
      .email(`${this.labels[key]} muss eine gültige E-Mail-Adresse sein`);
  }

  requiredNumber<TKey extends keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels>(key: TKey) {
    return z.number({
      required_error: `${this.labels[key]} ist erforderlich`,
      invalid_type_error: `${this.labels[key]} muss eine Zahl sein`,
    });
  }

  optionalString<TKey extends keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels>(key: TKey) {
    return z.string({ required_error: `${this.labels[key]} ist erforderlich` }).optional();
  }

  boolean() {
    return z.preprocess(val => val ?? false, z.boolean());
  }

  // NEU: Enum mit Error Map
  enum<
    TKey extends keyof z.infer<z.ZodObject<TDTOShape>> & keyof TLabels,
    TEnum extends [string, ...Array<string>],
  >(
    key: TKey,
    values: TEnum,
    options?: {
      errorMap?: (issue: z.ZodIssueOptionalMessage, ctx: z.ErrorMapCtx) => { message: string };
      defaultError?: string;
    }
  ) {
    const errorMap =
      options?.errorMap ||
      ((issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_enum_value) {
          return {
            message:
              options?.defaultError ??
              `${this.labels[key]} muss einer der folgenden Werte sein: ${values.join(', ')}`,
          };
        }
        return { message: ctx.defaultError };
      });

    return z.enum(values, { errorMap });
  }

  // NEU: Refine Support
  refine<TInput = z.infer<z.ZodObject<TDTOShape>>>(
    check: (data: TInput) => boolean | Promise<boolean>,
    options: {
      message: string;
      path?: Array<keyof TInput>;
    }
  ) {
    return {
      check,
      params: options,
    };
  }

  // Die Extend-Methode mit perfekter Type-Inference und optionalem strict()
  extend<TOverrides extends Record<string, z.ZodTypeAny>>(
    overrides: (builder: this) => TOverrides,
    options?: {
      strict?: boolean;
      refine?: Array<{
        check: (data: z.infer<z.ZodObject<TDTOShape>>) => boolean | Promise<boolean>;
        params: { message: string; path?: Array<string> };
      }>;
    }
  ): z.ZodTypeAny {
    let schema: z.ZodTypeAny = this.dto.extend(overrides(this)) as z.ZodObject<
      TDTOShape & { [K in keyof TOverrides]: TOverrides[K] },
      z.UnknownKeysParam,
      z.ZodTypeAny,
      z.infer<z.ZodObject<TDTOShape & { [K in keyof TOverrides]: TOverrides[K] }>>,
      z.output<z.ZodObject<TDTOShape & { [K in keyof TOverrides]: TOverrides[K] }>>
    >;

    // Apply strict mode if requested
    if (options?.strict) {
      if (schema instanceof z.ZodObject) {
        schema = schema.strict();
      }
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

// Helper Factory Function
export function createDTOSchemaBuilder<
  TDTOShape extends z.ZodRawShape,
  TLabels extends Record<string, string>,
>(dto: z.ZodObject<TDTOShape>, labels: TLabels): DTOSchemaBuilder<TDTOShape, TLabels> {
  return new DTOSchemaBuilder(dto, labels);
}
