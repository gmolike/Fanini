// apps/api/src/infrastructure/repositories/MySQLAusgabenRepository.ts
import type {
  IAusgabenRepository,
  AusgabenFilters,
} from "@/domain/repositories/IAusgabenRepository";
import type { Ausgabe } from "@/domain/entities/Ausgabe";
import type { ApprovalRequest } from "@/domain/entities/ApprovalRequest";
import type { MySQLConnection } from "./MySQLConnection";
import type { IApprovalRepository } from "@/domain/repositories/IApprovalRepository";
import { generateId } from "@faninitiative/shared";

const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

export const createMySQLAusgabenRepository = (
  db: MySQLConnection,
  approvalRepo: IApprovalRepository,
): IAusgabenRepository => {
  const mapRowToAusgabe = (row: any): Ausgabe => ({
    id: row.id,
    eventId: row.event_id,
    beschreibung: row.beschreibung,
    betrag: Number(row.betrag),
    kategorie: row.kategorie,
    belegUrl: row.beleg_url,
    rechnungsnummer: row.rechnungsnummer,
    status: row.status,
    eingereichtVon: row.eingereicht_von,
    eingereichtAm: new Date(row.eingereicht_am),
    genehmigtVon: row.genehmigt_von,
    genehmigtAm: row.genehmigt_am ? new Date(row.genehmigt_am) : undefined,
    ablehnungsgrund: row.ablehnungsgrund,
  });

  const findAll = async (
    userId: string,
    filters?: AusgabenFilters,
  ): Promise<Ausgabe[]> => {
    let sql = `
      SELECT a.*,
             e.titel as event_titel,
             m.vorname as einreicher_vorname,
             m.nachname as einreicher_nachname
      FROM ausgaben a
      JOIN events e ON a.event_id = e.id
      JOIN mitglieder m ON a.eingereicht_von = m.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters?.eventId) {
      sql += " AND a.event_id = ?";
      params.push(filters.eventId);
    }

    if (filters?.status) {
      sql += " AND a.status = ?";
      params.push(filters.status);
    }

    if (filters?.kategorie) {
      sql += " AND a.kategorie = ?";
      params.push(filters.kategorie);
    }

    if (filters?.dateFrom) {
      sql += " AND a.eingereicht_am >= ?";
      params.push(filters.dateFrom);
    }

    if (filters?.dateTo) {
      sql += " AND a.eingereicht_am <= ?";
      params.push(filters.dateTo);
    }

    sql += " ORDER BY a.eingereicht_am DESC";

    const rows = await db.query<any[]>(sql, params);
    return rows.map((row) => ({
      ...mapRowToAusgabe(row),
      metadata: {
        eventTitel: row.event_titel,
        einreicherName: `${row.einreicher_vorname} ${row.einreicher_nachname}`,
      },
    }));
  };

  const findById = async (
    id: string,
    userId: string,
  ): Promise<Ausgabe | null> => {
    const [row] = await db.query<any[]>(`SELECT * FROM ausgaben WHERE id = ?`, [
      id,
    ]);

    return row ? mapRowToAusgabe(row) : null;
  };

  const create = async (
    data: Omit<Ausgabe, "id" | "eingereichtAm">,
    userId: string,
  ): Promise<Ausgabe> => {
    const id = generateId();

    await db.query(
      `INSERT INTO ausgaben
       (id, event_id, beschreibung, betrag, kategorie,
        beleg_url, rechnungsnummer, status, eingereicht_von)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.eventId,
        data.beschreibung,
        data.betrag,
        data.kategorie,
        data.belegUrl || null,
        data.rechnungsnummer || null,
        "eingereicht",
        data.eingereichtVon,
      ],
    );

    // Create approval request automatically
    const ausgabe = await findById(id, userId);
    if (ausgabe) {
      await approvalRepo.createRequest({
        requestType: "finance_expense",
        resourceType: "ausgaben",
        resourceId: id,
        requestedBy: userId,
        newData: ausgabe,
        changesSummary: `Neue Ausgabe: ${data.beschreibung} - ${data.betrag}€`,
        priority: data.betrag > 500 ? "high" : "medium",
      });
    }

    return ausgabe!;
  };

  const update = async (
    id: string,
    data: Partial<Ausgabe>,
    userId: string,
  ): Promise<Ausgabe | ApprovalRequest> => {
    // Updates to approved expenses require new approval
    const current = await findById(id, userId);
    if (!current) throw new Error("Ausgabe not found");

    if (current.status === "genehmigt") {
      const approvalRequest = await approvalRepo.createRequest({
        requestType: "finance_expense",
        resourceType: "ausgaben",
        resourceId: id,
        requestedBy: userId,
        oldData: current,
        newData: data,
        changesSummary: `Änderung an genehmigter Ausgabe: ${current.beschreibung}`,
        priority: "high",
      });

      return approvalRequest;
    }

    const fields = Object.keys(data)
      .filter((key) => !["id", "eingereichtAm", "eingereichtVon"].includes(key))
      .map((key) => `${camelToSnake(key)} = ?`)
      .join(", ");

    const values = Object.entries(data)
      .filter(
        ([key]) => !["id", "eingereichtAm", "eingereichtVon"].includes(key),
      )
      .map(([_, value]) => value);

    values.push(id);

    await db.query(`UPDATE ausgaben SET ${fields} WHERE id = ?`, values);

    return (await findById(id, userId))!;
  };

  const deleteAusgabe = async (id: string, userId: string): Promise<void> => {
    // Only draft expenses can be deleted
    await db.query(
      `DELETE FROM ausgaben
       WHERE id = ? AND status = 'eingereicht' AND eingereicht_von = ?`,
      [id, userId],
    );
  };

  const getTotalByEvent = async (eventId: string): Promise<number> => {
    const [result] = await db.query<any[]>(
      `SELECT SUM(betrag) as total
       FROM ausgaben
       WHERE event_id = ? AND status = 'genehmigt'`,
      [eventId],
    );

    return result?.total || 0;
  };

  const getTotalByCategory = async (
    eventId: string,
  ): Promise<Record<string, number>> => {
    const rows = await db.query<any[]>(
      `SELECT kategorie, SUM(betrag) as total
       FROM ausgaben
       WHERE event_id = ? AND status = 'genehmigt'
       GROUP BY kategorie`,
      [eventId],
    );

    const totals: Record<string, number> = {};
    rows.forEach((row) => {
      totals[row.kategorie] = Number(row.total);
    });

    return totals;
  };

  return {
    findAll,
    findById,
    create,
    update,
    delete: deleteAusgabe,
    getTotalByEvent,
    getTotalByCategory,
  };
};
