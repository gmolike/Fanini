// apps/api/src/domain/entities/Settings.ts

/**
 * Settings Entity
 * @description Globale Einstellungen des Vereins
 */
export class Settings {
  constructor(
    public readonly id: string,
    public readonly associationName: string,
    public readonly foundedYear: number,
    public readonly passionPercentage: number,
    public readonly contact: {
      email?: string;
      phone?: string;
      address?: {
        street?: string;
        zip?: string;
        city?: string;
      };
    },
    public readonly branding: {
      colors: {
        primary: string;
        secondary: string;
        accent?: string;
      };
      logo?: {
        url: string;
        alt: string;
      };
    },
    public readonly features: {
      events: boolean;
      members: boolean;
      gallery: boolean;
      newsletter: boolean;
      creators: boolean;
    },
    public readonly updatedAt: Date,
  ) {}

  /**
   * Konvertiert zu JSON
   */
  toJSON() {
    return {
      id: this.id,
      associationName: this.associationName,
      foundedYear: this.foundedYear,
      passionPercentage: this.passionPercentage,
      contact: this.contact,
      branding: this.branding,
      features: this.features,
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
