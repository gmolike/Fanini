// apps/api/src/presentation/controllers/event/InternalEventController.ts
import { EventStatus } from "@/domain/entities/Event";
import {
  created,
  error,
  notFound,
  success
} from "@/presentation/helpers/responses";
import { withErrorHandling } from "@/presentation/helpers/responses/errorHandler";
import z from "zod";

const createEventSchema = z.object({
  titel: z.string().min(3).max(255),
  beschreibung: z.string().min(10),
  kurzbeschreibung: z.string().max(500).optional(),
  datum: z.string().refine((val) => !isNaN(Date.parse(val))),
  uhrzeit: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  dauer_minuten: z.number().min(15).max(1440).optional(),
  ort: z.object({
    name: z.string().min(1),
    adresse: z.string().optional(),
    beschreibung: z.string().optional(),
  }),
  typ: z.enum([
    "vereinstreffen",
    "sportveranstaltung",
    "fanfahrt",
    "social",
    "sitzung",
    "workshop",
    "turnier",
    "sonstiges",
  ]),
  sportBereich: z
    .enum([
      "league_of_legends",
      "valorant",
      "fussball",
      "esports_allgemein",
      "sonstiges",
    ])
    .optional(),
  ist_oeffentlich: z.boolean().default(false),
  verantwortlich_id: z.string(),
  stellvertreter_ids: z.array(z.string()).optional(),
  budget: z.number().min(0).max(100000).optional(),
  max_teilnehmer: z.number().min(1).max(10000).optional(),
  anmeldeschluss: z.string().optional(),
  ticket_link: z.string().url().optional(),
});

const updateEventSchema = createEventSchema.partial();

const changeStatusSchema = z.object({
  status: z.enum([
    "entwurf",
    "geplant",
    "genehmigt",
    "aktiv",
    "abgeschlossen",
    "abgesagt",
  ]),
  kommentar: z.string().optional(),
});
export class InternalEventController {
  constructor(
    private readonly createEventUseCase: any,
    private readonly updateEventUseCase: any,
    private readonly getInternalEventsUseCase: any,
    private readonly getInternalEventByIdUseCase: any,
  ) {}

  /**
   * Create event
   */
  createEvent = withErrorHandling(async (req: Request) => {
    const body = await req.json();
    const validated = createEventSchema.parse(body);
    const { userId, userRole, userName } = req as any;

    const result = await this.createEventUseCase.execute({
      data: validated,
      userId,
      userRole,
      userName,
      context: {
        ipAddress: req.headers.get("x-forwarded-for") || undefined,
        userAgent: req.headers.get("user-agent") || undefined,
      },
    });

    if (!result.success) {
      return error(
        result.error.message,
        result.error.code,
        result.error.statusCode,
      );
    }

    return created(
      {
        eventId: result.eventId,
        requiresApproval: result.requiresApproval,
      },
      `/api/internal/events/${result.eventId}`,
    );
  });

  /**
   * Update event
   */
  updateEvent = withErrorHandling(async (req: Request) => {
    const { params } = req as any;
    const body = await req.json();
    const validated = updateEventSchema.parse(body);
    const { userId, userRole, userName } = req as any;

    const result = await this.updateEventUseCase.execute({
      id: params.id,
      data: validated,
      userId,
      userRole,
      userName,
      context: {
        ipAddress: req.headers.get("x-forwarded-for") || undefined,
        userAgent: req.headers.get("user-agent") || undefined,
      },
    });

    if (!result.success) {
      return error(
        result.error.message,
        result.error.code,
        result.error.statusCode,
      );
    }

    return success({
      modifiedFields: result.modifiedFields,
      requiresApproval: result.requiresApproval,
      approvalRequestId: result.approvalRequestId,
    });
  });

  /**
   * Get internal events
   */
  getInternalEvents = withErrorHandling(async (req: Request) => {
    const url = new URL(req.url);
    const { userId, userRole } = req as any;

    const params = {
      userId,
      userRole,
      filters: {
        status: url.searchParams.get("status") as EventStatus | undefined,
        type: url.searchParams.get("type") || undefined,
        sportBereich: url.searchParams.get("sportBereich") || undefined,
        fromDate: url.searchParams.get("fromDate") || undefined,
        toDate: url.searchParams.get("toDate") || undefined,
        responsibleId: url.searchParams.get("responsibleId") || undefined,
        search: url.searchParams.get("search") || undefined,
        includeDeleted: url.searchParams.get("includeDeleted") === "true",
        onlyMyEvents: url.searchParams.get("onlyMyEvents") === "true",
      },
      pagination: {
        page: parseInt(url.searchParams.get("page") || "1"),
        pageSize: parseInt(url.searchParams.get("pageSize") || "20"),
      },
    };

    const result = await this.getInternalEventsUseCase.execute(params);

    return success({
      items: result.items,
      pagination: result.pagination,
    });
  });

  /**
   * Get internal event by ID
   */
  getInternalEventById = withErrorHandling(async (req: Request) => {
    const { params } = req as any;
    const { userId, userRole } = req as any;

    const event = await this.getInternalEventByIdUseCase.execute({
      id: params.id,
      userId,
      userRole,
    });

    if (!event) {
      return notFound("Event", params.id);
    }

    return success(event);
  });
}
