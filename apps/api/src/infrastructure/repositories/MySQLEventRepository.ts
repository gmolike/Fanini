// apps/api/src/infrastructure/database/repositories/mysql-event-repository.ts
import type { Event, EventLocation } from "@/domain/entities/Event";
import type {
  EventRepository,
  EventFilters,
} from "@/domain/repositories/IEventRepository";
import type { MySQLConnection } from "./MySQLConnection";

export const createMySQLEventRepository = (
  db: MySQLConnection,
): EventRepository => {
  const parseLocation = (locationJson: string): EventLocation => {
    try {
      return JSON.parse(locationJson);
    } catch {
      return { name: locationJson };
    }
  };

  const rowToEvent = (row: any): Event => ({
    id: row.id,
    title: row.titel,
    description: row.beschreibung,
    shortDescription: row.kurzbeschreibung,
    date: new Date(row.datum),
    time: row.uhrzeit,
    durationMinutes: row.dauer_minuten,
    location: parseLocation(row.ort),
    type: row.typ,
    sportBereich: row.sportbereich,
    status: row.status,
    isPublic: Boolean(row.ist_oeffentlich),
    isConfidential: Boolean(row.ist_vertraulich),
    responsibleMemberId: row.verantwortlich_id,
    deputyMemberIds: row.stellvertreter_ids
      ? JSON.parse(row.stellvertreter_ids)
      : undefined,
    budget: row.budget,
    budgetUsed: row.budget_verbraucht || 0,
    maxParticipants: row.max_teilnehmer,
    registrationDeadline: row.anmeldeschluss
      ? new Date(row.anmeldeschluss)
      : undefined,
    ticketLink: row.ticket_link,
    createdAt: new Date(row.erstellt_am),
    createdBy: row.erstellt_von,
    updatedAt: new Date(row.aktualisiert_am || row.erstellt_am),
    updatedBy: row.aktualisiert_von,
    approvedAt: row.genehmigt_am ? new Date(row.genehmigt_am) : undefined,
    approvedBy: row.genehmigt_von,
  });

  const findAll = async (filters?: EventFilters): Promise<Event[]> => {
    let sql = "SELECT * FROM events WHERE 1=1";
    const params: any[] = [];

    if (filters?.status) {
      sql += " AND status = ?";
      params.push(filters.status);
    }

    if (filters?.isPublic !== undefined) {
      sql += " AND ist_oeffentlich = ?";
      params.push(filters.isPublic);
    }

    if (filters?.createdBy) {
      sql += " AND erstellt_von = ?";
      params.push(filters.createdBy);
    }

    if (filters?.fromDate) {
      sql += " AND datum >= ?";
      params.push(filters.fromDate);
    }

    if (filters?.toDate) {
      sql += " AND datum <= ?";
      params.push(filters.toDate);
    }

    if (filters?.type) {
      sql += " AND typ = ?";
      params.push(filters.type);
    }

    if (filters?.sportBereich) {
      sql += " AND sportbereich = ?";
      params.push(filters.sportBereich);
    }

    sql += " ORDER BY datum DESC, uhrzeit DESC";

    const rows = await db.query<any[]>(sql, params);
    return rows.map(rowToEvent);
  };

  const findById = async (id: string): Promise<Event | null> => {
    const rows = await db.query<any[]>("SELECT * FROM events WHERE id = ?", [
      id,
    ]);

    if (rows.length === 0) return null;
    return rowToEvent(rows[0]);
  };

  const save = async (event: Event): Promise<Event> => {
    const sql = `
      INSERT INTO events
      (id, titel, beschreibung, kurzbeschreibung, datum, uhrzeit,
       dauer_minuten, ort, typ, sportbereich, status, ist_oeffentlich,
       ist_vertraulich, verantwortlich_id, budget, budget_verbraucht,
       max_teilnehmer, anmeldeschluss, ticket_link, erstellt_am,
       erstellt_von, genehmigt_am, genehmigt_von)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        titel = VALUES(titel),
        beschreibung = VALUES(beschreibung),
        kurzbeschreibung = VALUES(kurzbeschreibung),
        datum = VALUES(datum),
        uhrzeit = VALUES(uhrzeit),
        dauer_minuten = VALUES(dauer_minuten),
        ort = VALUES(ort),
        typ = VALUES(typ),
        sportbereich = VALUES(sportbereich),
        status = VALUES(status),
        ist_oeffentlich = VALUES(ist_oeffentlich),
        max_teilnehmer = VALUES(max_teilnehmer),
        anmeldeschluss = VALUES(anmeldeschluss),
        ticket_link = VALUES(ticket_link)
    `;

    await db.query(sql, [
      event.id,
      event.title,
      event.description,
      event.shortDescription || null,
      event.date,
      event.time,
      event.durationMinutes || null,
      JSON.stringify(event.location),
      event.type,
      event.sportBereich || null,
      event.status,
      event.isPublic,
      event.isConfidential,
      event.responsibleMemberId,
      event.budget || null,
      event.budgetUsed,
      event.maxParticipants || null,
      event.registrationDeadline || null,
      event.ticketLink || null,
      event.createdAt,
      event.createdBy,
      event.approvedAt || null,
      event.approvedBy || null,
    ]);

    return event;
  };

  const deleteEvent = async (id: string): Promise<void> => {
    await db.query("DELETE FROM events WHERE id = ?", [id]);
  };

  return {
    findAll,
    findById,
    save,
    delete: deleteEvent,
  };
};
