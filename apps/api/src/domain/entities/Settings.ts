// apps/api/src/domain/entities/Settings.ts
export type Settings = {
  id: string;
  associationName: string;
  foundedYear: number;
  passionPercentage: number;
  contact: {
    email: string;
    phone?: string;
    address?: {
      street: string;
      zip: string;
      city: string;
    };
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logo?: {
      url: string;
      alt: string;
    };
  };
  features: {
    events: boolean;
    members: boolean;
    gallery: boolean;
    newsletter: boolean;
    creators: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
