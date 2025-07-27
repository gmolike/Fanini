// apps/api/src/infrastructure/repositories/MySQLProtokollRepository.ts
import type { IProtokollRepository, ProtokollFilters } from "@/domain/repositories/IProtokollRepository";
import type { Protokoll, Tagesordnungspunkt } from "@/domain/entities/Protokoll";
import type { ApprovalRequest } from "@/domain/entities/ApprovalRequest";
import type { MySQLConnection } from "./MySQLConnection";
import type { IApprovalRepository } from "@/domain/repositories/IApprovalRepository";
import { generateId } from "@faninitiative/shared";

const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

export const createMySQLProtokollRepository = (
  db: MySQLConnection,
  approvalRepo: IApprovalRepository
): IProtokollRepository => {

  const mapRowToProtokoll = (row: any): Protokoll => ({
    id: row.id,
    bereichId: row.bereich_id,
    datum: new Date(row.datum),
    titel: row.titel,
    typ: row.typ,
    teilnehmerIds: row.teilnehmer_ids ? JSON.parse(row.teilnehmer_ids) : [],
    protokollantId: row.protokollant_id,
    sitzungsleiterId: row.sitzungsleiter_id,
    status: row.status,
    inhalt: row.inhalt,
    genehmigtAm: row.genehmigt_am ? new Date(row.genehmigt_am) : undefined,
    genehmigtVon: row.genehmigt_von,
    erstelltAm: new Date(row.erstellt_am),
    aktualisiertAm: new Date(row.aktualisiert_am),
    tagesordnungspunkte: []
  });

  const mapRowToTagesordnungspunkt = (row: any): Tagesordnungspunkt => ({
    id: row.id,
    protokollId: row.protokoll_id,
    titel: row.titel,
    beschreibung: row.beschreibung,
    prioritaet: row.prioritaet,
    eingereichtVon: row.eingereicht_von,
    eingereichtAm: new Date(row.eingereicht_am),
    bereichId: row.bereich_id,
    ergebnis: row.ergebnis,
    massnahmen: row.massnahmen ? JSON.parse(row.massnahmen) : []
  });

  const checkApprovalRequired = async (
    protokollId: string,
    updates: Partial<Protokoll>,
    userRole: string
  ): Promise<boolean> => {
    // Admin und Vorstand brauchen kein Approval
    if (['ADMIN', 'VORSTAND'].includes(userRole)) {
      return false;
    }

    // Check if protokoll is already approved
    const [current] = await db.query<any[]>(
      `SELECT status FROM protokolle WHERE id = ?`,
      [protokollId]
    );

    // Änderungen an genehmigten Protokollen brauchen Approval
    return current?.status === 'genehmigt';
  };

  const findAllInternal = async (
    filters?: ProtokollFilters,
    userId?: string
  ): Promise<Protokoll[]> => {
    let sql = `
      SELECT p.*,
             m1.vorname as protokollant_vorname,
             m1.nachname as protokollant_nachname,
             m2.vorname as sitzungsleiter_vorname,
             m2.nachname as sitzungsleiter_nachname,
             COUNT(t.id) as punkt_count
      FROM protokolle p
      LEFT JOIN mitglieder m1 ON p.protokollant_id = m1.id
      LEFT JOIN mitglieder m2 ON p.sitzungsleiter_id = m2.id
      LEFT JOIN tagesordnungspunkte t ON p.id = t.protokoll_id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (filters?.bereichId) {
      sql += ' AND p.bereich_id = ?';
      params.push(filters.bereichId);
    }

    if (filters?.status) {
      sql += ' AND p.status = ?';
      params.push(filters.status);
    }

    if (filters?.jahr) {
      sql += ' AND YEAR(p.datum) = ?';
      params.push(filters.jahr);
    }

    if (filters?.search) {
      sql += ' AND (p.titel LIKE ? OR p.inhalt LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    sql += ' GROUP BY p.id ORDER BY p.datum DESC';

    const rows = await db.query<any[]>(sql, params);
    return rows.map(row => ({
      ...mapRowToProtokoll(row),
      metadata: {
        protokollantName: `${row.protokollant_vorname} ${row.protokollant_nachname}`,
        sitzungsleiterName: `${row.sitzungsleiter_vorname} ${row.sitzungsleiter_nachname}`,
        punktCount: row.punkt_count || 0
      }
    }));
  };

  const findByIdInternal = async (
    id: string,
    userId: string
  ): Promise<Protokoll | null> => {
    const [row] = await db.query<any[]>(
      `SELECT * FROM protokolle WHERE id = ?`,
      [id]
    );

    if (!row) return null;

    const protokoll = mapRowToProtokoll(row);

    // Lade Tagesordnungspunkte
    const punkteRows = await db.query<any[]>(
      `SELECT t.*,
              m.vorname as eingereicht_vorname,
              m.nachname as eingereicht_nachname
       FROM tagesordnungspunkte t
       LEFT JOIN mitglieder m ON t.eingereicht_von = m.id
       WHERE t.protokoll_id = ?
       ORDER BY t.prioritaet DESC, t.eingereicht_am ASC`,
      [id]
    );

    const tagesordnungspunkte = punkteRows.map(row => ({
      ...mapRowToTagesordnungspunkt(row),
      eingereichtVonName: `${row.eingereicht_vorname} ${row.eingereicht_nachname}`
    }));

    return {
      ...protokoll,
      tagesordnungspunkte
    };
  };

  const create = async (
    data: Omit<Protokoll, 'id' | 'erstelltAm'>,
    userId: string
  ): Promise<Protokoll> => {
    const protokollId = generateId();

    await db.query(
      `INSERT INTO protokolle
       (id, bereich_id, datum, titel, typ, teilnehmer_ids,
        protokollant_id, sitzungsleiter_id, status, inhalt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        protokollId,
        data.bereichId,
        data.datum,
        data.titel,
        data.typ,
        JSON.stringify(data.teilnehmerIds),
        data.protokollantId,
        data.sitzungsleiterId,
        'entwurf',
        data.inhalt || ''
      ]
    );

    return (await findByIdInternal(protokollId, userId))!;
  };

  const update = async (
    id: string,
    data: Partial<Protokoll>,
    userId: string
  ): Promise<Protokoll | ApprovalRequest> => {
    // TODO: Get userRole from auth context
    const userRole = 'BEIRAT'; // Placeholder

    const requiresApproval = await checkApprovalRequired(id, data, userRole);

    if (requiresApproval) {
      const current = await findByIdInternal(id, userId);
      if (!current) throw new Error('Protokoll not found');

      const approvalRequest = await approvalRepo.createRequest({
        requestType: 'protokoll_edit',
        resourceType: 'protokolle',
        resourceId: id,
        requestedBy: userId,
        oldData: current,
        newData: data,
        changesSummary: `Änderung an genehmigtem Protokoll: ${current.titel}`,
        priority: 'medium'
      });

      return approvalRequest;
    }

    // Direkte Aktualisierung für Entwürfe
    const fields = Object.keys(data)
      .filter(key => !['id', 'tagesordnungspunkte'].includes(key))
      .map(key => `${camelToSnake(key)} = ?`)
      .join(', ');

    const values = Object.entries(data)
      .filter(([key]) => !['id', 'tagesordnungspunkte'].includes(key))
      .map(([_, value]) => value);

    values.push(id);

    await db.query(
      `UPDATE protokolle SET ${fields}, aktualisiert_am = NOW() WHERE id = ?`,
      values
    );

    return (await findByIdInternal(id, userId))!;
  };

  const addTagesordnungspunkt = async (
    protokollId: string,
    punkt: Omit<Tagesordnungspunkt, 'id'>,
    userId: string
  ): Promise<Tagesordnungspunkt> => {
    const punktId = generateId();

    await db.query(
      `INSERT INTO tagesordnungspunkte
       (id, protokoll_id, titel, beschreibung, prioritaet,
        eingereicht_von, bereich_id, ergebnis, massnahmen)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        punktId,
        protokollId,
        punkt.titel,
        punkt.beschreibung,
        punkt.prioritaet,
        punkt.eingereichtVon,
        punkt.bereichId,
        punkt.ergebnis,
        punkt.massnahmen ? JSON.stringify(punkt.massnahmen) : null
      ]
    );

    const [newPunkt] = await db.query<any[]>(
      `SELECT * FROM tagesordnungspunkte WHERE id = ?`,
      [punktId]
    );

    return mapRowToTagesordnungspunkt(newPunkt);
  };

  const updateTagesordnungspunkt = async (
    punktId: string,
    data: Partial<Tagesordnungspunkt>,
    userId: string
  ): Promise<Tagesordnungspunkt> => {
    const fields = Object.keys(data)
      .filter(key => !['id', 'protokollId'].includes(key))
      .map(key => `${camelToSnake(key)} = ?`)
      .join(', ');

    const values = Object.entries(data)
      .filter(([key]) => !['id', 'protokollId'].includes(key))
      .map(([_, value]) => value);

    values.push(punktId);

    await db.query(
      `UPDATE tagesordnungspunkte SET ${fields}, aktualisiert_am = NOW() WHERE id = ?`,
      values
    );

    const [updated] = await db.query<any[]>(
      `SELECT * FROM tagesordnungspunkte WHERE id = ?`,
      [punktId]
    );

    return mapRowToTagesordnungspunkt(updated);
  };

  const removeTagesordnungspunkt = async (
    punktId: string,
    userId: string
  ): Promise<void> => {
    await db.query(
      `DELETE FROM tagesordnungspunkte WHERE id = ?`,
      [punktId]
    );
  };

  return {
    findAllInternal,
    findByIdInternal,
    create,
    update,
    addTagesordnungspunkt,
    updateTagesordnungspunkt,
    removeTagesordnungspunkt
  };
};
