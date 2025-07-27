// apps/api/src/infrastructure/repositories/MySQLSettingsRepository.ts
import type { ISettingsRepository } from "@/domain/repositories/ISettingsRepository";
import type { Settings } from "@/domain/entities/Settings";
import type { MySQLConnection } from "./MySQLConnection";

const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

export const createMySQLSettingsRepository = (
  db: MySQLConnection,
): ISettingsRepository => {
  const mapRowToSettings = (row: any): Settings => ({
    id: row.id,
    associationName: row.association_name,
    foundedYear: row.founded_year,
    passionPercentage: row.passion_percentage,
    contact: {
      email: row.contact_email,
      phone: row.contact_phone,
      address: row.contact_address_street
        ? {
            street: row.contact_address_street,
            zip: row.contact_address_zip,
            city: row.contact_address_city,
          }
        : undefined,
    },
    theme: {
      primaryColor: row.primary_color,
      secondaryColor: row.secondary_color,
      accentColor: row.accent_color,
      logo: row.logo_url
        ? {
            url: row.logo_url,
            alt: row.logo_alt,
          }
        : undefined,
    },
    features: {
      events: Boolean(row.feature_events),
      members: Boolean(row.feature_members),
      gallery: Boolean(row.feature_gallery),
      newsletter: Boolean(row.feature_newsletter),
      creators: Boolean(row.feature_creators),
    },
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  });

  const getSettings = async (): Promise<Settings> => {
    const [row] = await db.query<any[]>(
      `SELECT * FROM settings WHERE id = 'global-settings'`,
    );

    if (!row) {
      // Create default settings if not exists
      await createDefaultSettings(db);
      return getSettings();
    }

    return mapRowToSettings(row);
  };

  const updateSettings = async (
    data: Partial<Settings>,
    userId: string,
  ): Promise<Settings> => {
    const flatData: Record<string, any> = {};

    // Flatten nested objects
    if (data.contact) {
      if (data.contact.email !== undefined) {
        flatData.contact_email = data.contact.email;
      }
      if (data.contact.phone !== undefined) {
        flatData.contact_phone = data.contact.phone;
      }
      if (data.contact.address) {
        flatData.contact_address_street = data.contact.address.street;
        flatData.contact_address_zip = data.contact.address.zip;
        flatData.contact_address_city = data.contact.address.city;
      }
    }

    if (data.theme) {
      if (data.theme.primaryColor !== undefined) {
        flatData.primary_color = data.theme.primaryColor;
      }
      if (data.theme.secondaryColor !== undefined) {
        flatData.secondary_color = data.theme.secondaryColor;
      }
      if (data.theme.accentColor !== undefined) {
        flatData.accent_color = data.theme.accentColor;
      }
      if (data.theme.logo) {
        flatData.logo_url = data.theme.logo.url;
        flatData.logo_alt = data.theme.logo.alt;
      }
    }

    if (data.features) {
      if (data.features.events !== undefined) {
        flatData.feature_events = data.features.events;
      }
      if (data.features.members !== undefined) {
        flatData.feature_members = data.features.members;
      }
      if (data.features.gallery !== undefined) {
        flatData.feature_gallery = data.features.gallery;
      }
      if (data.features.newsletter !== undefined) {
        flatData.feature_newsletter = data.features.newsletter;
      }
      if (data.features.creators !== undefined) {
        flatData.feature_creators = data.features.creators;
      }
    }

    // Add other direct fields
    if (data.associationName !== undefined) {
      flatData.association_name = data.associationName;
    }
    if (data.foundedYear !== undefined) {
      flatData.founded_year = data.foundedYear;
    }
    if (data.passionPercentage !== undefined) {
      flatData.passion_percentage = data.passionPercentage;
    }

    if (Object.keys(flatData).length === 0) {
      return getSettings();
    }

    const fields = Object.keys(flatData)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = Object.values(flatData);
    values.push("global-settings");

    await db.query(
      `UPDATE settings SET ${fields}, updated_at = NOW() WHERE id = ?`,
      values,
    );

    return getSettings();
  };

  return {
    getSettings,
    updateSettings,
  };
};

const createDefaultSettings = async (db: MySQLConnection): Promise<void> => {
  await db.query(
    `INSERT INTO settings
     (id, association_name, founded_year, passion_percentage,
      contact_email, primary_color, secondary_color, accent_color,
      feature_events, feature_members, feature_gallery,
      feature_newsletter, feature_creators)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      "global-settings",
      "Faninitiative Spandau e.V.",
      2025,
      100,
      "info@faninitiative-spandau.de",
      "#1a1a1a",
      "#f5f5f5",
      "#ff6b6b",
      true,
      true,
      true,
      true,
      true,
    ],
  );
};
