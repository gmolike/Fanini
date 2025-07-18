// apps/api/src/infrastructure/repositories/MySQLMemberRepository.ts
import { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import { MySQLConnection } from "./MySQLConnection";

export class MySQLMemberRepository implements IMemberRepository {
  constructor(private db: MySQLConnection) {}
  async create(data: {
    user_id: string;
    vorname: string;
    nachname: string;
    email: string;
    telefon?: string;
    member_type: "easyverein" | "creator" | "sponsor" | "partner";
    mitglied_seit: Date;
    ist_aktiv: boolean;
  }): Promise<any> {
    const id = `mbr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await this.db.query(
      `INSERT INTO mitglieder
       (id, user_id, vorname, nachname, email, telefon, member_type, mitglied_seit, ist_aktiv)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.user_id,
        data.vorname,
        data.nachname,
        data.email,
        data.telefon || null,
        data.member_type,
        data.mitglied_seit,
        data.ist_aktiv,
      ],
    );

    return { id, ...data };
  }

  async createCreatorProfile(data: {
    member_id: string;
    kuenstlername: string;
    portfolio_link?: string;
    ist_aktiv: boolean;
    aktiv_seit: Date;
  }): Promise<any> {
    const id = `crt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await this.db.query(
      `INSERT INTO creators
       (id, member_id, artist_name, portfolio, is_active, active_since)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.member_id,
        data.kuenstlername,
        data.portfolio_link || null,
        data.ist_aktiv,
        data.aktiv_seit,
      ],
    );

    return { id, ...data };
  }

  async findAll(filters?: {
    active?: boolean;
    search?: string;
    roleId?: string;
  }): Promise<any[]> {
    let query = `
      SELECT
        m.*,
        u.email as user_email,
        u.ist_aktiv as user_ist_aktiv,
        u.mitgliedsnummer,
        u.auth_source,
        u.letzter_login
      FROM mitglieder m
      LEFT JOIN users u ON m.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    // Apply filters
    if (filters?.active !== undefined) {
      query += ` AND m.ist_aktiv = ?`;
      params.push(filters.active);
    }

    if (filters?.search) {
      query += ` AND (m.vorname LIKE ? OR m.nachname LIKE ? OR u.email LIKE ?)`;
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (filters?.roleId) {
      query += ` AND EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = m.user_id
        AND ur.role_id = ?
      )`;
      params.push(filters.roleId);
    }

    query += ` ORDER BY m.nachname, m.vorname`;

    const rows = await this.db.query<any[]>(query, params);

    return rows.map((row) => this.mapRowToMember(row));
  }

  async findById(id: string): Promise<any | null> {
    const [row] = await this.db.query<any[]>(
      `SELECT
        m.*,
        u.email as user_email,
        u.ist_aktiv as user_ist_aktiv,
        u.mitgliedsnummer,
        u.auth_source,
        u.letzter_login
       FROM mitglieder m
       LEFT JOIN users u ON m.user_id = u.id
       WHERE m.id = ?`,
      [id],
    );

    if (!row) return null;

    return this.mapRowToMember(row);
  }

  async update(id: string, data: any): Promise<any> {
    const allowedFields = [
      "vorname",
      "nachname",
      "telefon",
      "profilbild",
      "beschreibung",
      "sichtbarkeit_email",
      "sichtbarkeit_telefon",
      "sichtbarkeit_profil",
      "geburtsdatum",
      "adresse_strasse",
      "adresse_hausnummer",
      "adresse_plz",
      "adresse_stadt",
      "notfallkontakt_name",
      "notfallkontakt_telefon",
      "iban",
      "datenschutz_einwilligung",
    ];

    const updates: Record<string, any> = {};

    // Handle nested address object
    if (data.adresse) {
      if (data.adresse.strasse) updates.adresse_strasse = data.adresse.strasse;
      if (data.adresse.hausnummer)
        updates.adresse_hausnummer = data.adresse.hausnummer;
      if (data.adresse.plz) updates.adresse_plz = data.adresse.plz;
      if (data.adresse.stadt) updates.adresse_stadt = data.adresse.stadt;
    }

    // Handle nested notfallkontakt object
    if (data.notfallkontakt) {
      if (data.notfallkontakt.name)
        updates.notfallkontakt_name = data.notfallkontakt.name;
      if (data.notfallkontakt.telefon)
        updates.notfallkontakt_telefon = data.notfallkontakt.telefon;
    }

    // Handle other fields
    for (const [key, value] of Object.entries(data)) {
      if (
        allowedFields.includes(key) &&
        key !== "adresse" &&
        key !== "notfallkontakt"
      ) {
        updates[key] = value;
      }
    }

    // Special handling for datenschutz_einwilligung
    if (data.datenschutz_einwilligung === true && !updates.datenschutz_datum) {
      updates.datenschutz_datum = new Date();
    }

    if (Object.keys(updates).length === 0) {
      return await this.findById(id);
    }

    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates);
    values.push(id);

    await this.db.query(
      `UPDATE mitglieder SET ${setClause}, aktualisiert_am = NOW() WHERE id = ?`,
      values,
    );

    return await this.findById(id);
  }

  /**
   * Private helper to map database row to member object
   */
  private mapRowToMember(row: any): any {
    return {
      // Basis-Daten
      id: row.id,
      userId: row.user_id,
      vorname: row.vorname,
      nachname: row.nachname,
      email: row.email || row.user_email,
      telefon: row.telefon,

      // Status
      istAktiv: Boolean(row.ist_aktiv),
      hatVertraulichkeitserklaerung: Boolean(
        row.hat_vertraulichkeitserklaerung,
      ),
      mitgliedSeit: row.mitglied_seit,
      austrittsDatum: row.austritts_datum,

      // Profil
      profilbild: row.profilbild,
      beschreibung: row.beschreibung,

      // Sichtbarkeit
      sichtbarkeitEmail: row.sichtbarkeit_email || "intern",
      sichtbarkeitTelefon: row.sichtbarkeit_telefon || "privat",
      sichtbarkeitProfil: row.sichtbarkeit_profil || "intern",

      // Sensitive Daten (werden später gefiltert)
      geburtsdatum: row.geburtsdatum,
      adresse:
        row.adresse_strasse || row.adresse_plz
          ? {
              strasse: row.adresse_strasse,
              hausnummer: row.adresse_hausnummer,
              plz: row.adresse_plz,
              stadt: row.adresse_stadt,
            }
          : undefined,
      iban: row.iban,
      notfallkontakt:
        row.notfallkontakt_name || row.notfallkontakt_telefon
          ? {
              name: row.notfallkontakt_name,
              telefon: row.notfallkontakt_telefon,
            }
          : undefined,

      // Datenschutz
      datenschutzEinwilligung: Boolean(row.datenschutz_einwilligung),
      datenschutzDatum: row.datenschutz_datum,

      // Metadaten
      erstelltAm: row.erstellt_am,
      aktualisiertAm: row.aktualisiert_am,
      letzterLogin: row.letzter_login,

      // Von User-Tabelle
      mitgliedsnummer: row.mitgliedsnummer,
      easyVereinId: row.easyverein_id,
      authSource: row.auth_source,
    };
  }
}
