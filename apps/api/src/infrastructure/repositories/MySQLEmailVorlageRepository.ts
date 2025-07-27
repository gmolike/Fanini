// apps/api/src/infrastructure/repositories/MySQLEmailVorlageRepository.ts
import type { IEmailVorlageRepository, EmailVorlageFilters } from "@/domain/repositories/IEmailVorlageRepository";
import type { EmailVorlage } from "@/domain/entities/EmailVorlage";
import type { MySQLConnection } from "./MySQLConnection";
import { generateId } from "@faninitiative/shared";

const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

export const createMySQLEmailVorlageRepository = (
  db: MySQLConnection
): IEmailVorlageRepository => {

  const mapRowToVorlage = (row: any): EmailVorlage => ({
    id: row.id,
    titel: row.titel,
    betreff: row.betreff,
    inhalt: row.inhalt,
    kategorie: row.kategorie,
    platzhalter: row.platzhalter ? JSON.parse(row.platzhalter) : [],
    istAktiv: Boolean(row.ist_aktiv),
    erstelltAm: new Date(row.erstellt_am),
    aktualisiertAm: new Date(row.aktualisiert_am)
  });

  const findAll = async (
    filters?: EmailVorlageFilters
  ): Promise<EmailVorlage[]> => {
    let sql = `
      SELECT * FROM email_vorlagen
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters?.kategorie) {
      sql += ' AND kategorie = ?';
      params.push(filters.kategorie);
    }

    if (filters?.istAktiv !== undefined) {
      sql += ' AND ist_aktiv = ?';
      params.push(filters.istAktiv);
    }

    sql += ' ORDER BY kategorie, titel';

    const rows = await db.query<any[]>(sql, params);
    return rows.map(mapRowToVorlage);
  };

  const findById = async (id: string): Promise<EmailVorlage | null> => {
    const [row] = await db.query<any[]>(
      `SELECT * FROM email_vorlagen WHERE id = ?`,
      [id]
    );

    return row ? mapRowToVorlage(row) : null;
  };

  const findByKategorie = async (kategorie: string): Promise<EmailVorlage[]> => {
    const rows = await db.query<any[]>(
      `SELECT * FROM email_vorlagen
       WHERE kategorie = ? AND ist_aktiv = 1
       ORDER BY titel`,
      [kategorie]
    );

    return rows.map(mapRowToVorlage);
  };

  const create = async (
    data: Omit<EmailVorlage, 'id' | 'erstelltAm'>,
    userId: string
  ): Promise<EmailVorlage> => {
    const id = generateId();

    // Extract placeholders from template
    const platzhalter = extractPlaceholders(data.inhalt);

    await db.query(
      `INSERT INTO email_vorlagen
       (id, titel, betreff, inhalt, kategorie, platzhalter, ist_aktiv)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.titel,
        data.betreff,
        data.inhalt,
        data.kategorie,
        JSON.stringify(platzhalter),
        data.istAktiv !== false
      ]
    );

    return (await findById(id))!;
  };

  const update = async (
    id: string,
    data: Partial<EmailVorlage>,
    userId: string
  ): Promise<EmailVorlage> => {
    // Update platzhalter if inhalt changes
    let updateData = { ...data };
    if (data.inhalt) {
      updateData = { ...updateData, platzhalter: extractPlaceholders(data.inhalt) };
    }

    const fields = Object.keys(updateData)
      .filter(key => !['id', 'erstelltAm', 'aktualisiertAm'].includes(key))
      .map(key => `${camelToSnake(key)} = ?`)
      .join(', ');

    const values = Object.entries(updateData)
      .filter(([key]) => !['id', 'erstelltAm', 'aktualisiertAm'].includes(key))
      .map(([key, value]) => {
        if (key === 'platzhalter') {
          return JSON.stringify(value);
        }
        return value;
      });

    values.push(id);

    await db.query(
      `UPDATE email_vorlagen
       SET ${fields}, aktualisiert_am = NOW()
       WHERE id = ?`,
      values
    );

    return (await findById(id))!;
  };

  const deleteVorlage = async (id: string, userId: string): Promise<void> => {
    await db.query(
      `DELETE FROM email_vorlagen WHERE id = ?`,
      [id]
    );
  };

  const renderTemplate = async (
    id: string,
    data: Record<string, any>
  ): Promise<string> => {
    const vorlage = await findById(id);
    if (!vorlage) {
      throw new Error('Template not found');
    }

    let rendered = vorlage.inhalt;

    // Replace placeholders
    vorlage.platzhalter.forEach((placeholder: string | number) => {
      const value = data[placeholder] || `{{${placeholder}}}`;
      const regex = new RegExp(`{{${placeholder}}}`, 'g');
      rendered = rendered.replace(regex, value);
    });

    return rendered;
  };

  return {
    findAll,
    findById,
    findByKategorie,
    create,
    update,
    delete: deleteVorlage,
    renderTemplate
  };
};

// Helper function
const extractPlaceholders = (template: string): string[] => {
  const regex = /{{(\w+)}}/g;
  const placeholders = new Set<string>();
  let match;

  while ((match = regex.exec(template)) !== null) {
    placeholders.add(match[1]);
  }

  return Array.from(placeholders);
};
