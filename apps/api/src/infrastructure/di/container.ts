// src/infrastructure/di/container.ts
import { MySQLConnection } from "@/infrastructure/repositories/MySQLConnection";
import { RetryableGoogleDriveService } from "@/infrastructure/services/RetryableGoogleDriveService";
import { LoggerService } from "@/infrastructure/services/LoggerService";
import {
  registerAuthSlice,
  registerEventSlice,
  registerDocumentSlice,
  registerMemberSlice,
  registerStatsSlice,
  registerCreatorSlice,
  registerNewsletterSlice,
  registerInternalEventSlice,
  registerTaskSlice,
  registerOrganizationSlice,
} from "./slices";

export class Container {
  private readonly services = new Map<string, any>();
  private readonly factories = new Map<string, () => any>();

  register(name: string, factory: () => any): void {
    this.factories.set(name, factory);
  }

  get(name: string): any {
    if (!this.services.has(name)) {
      const factory = this.factories.get(name);
      if (!factory) {
        console.error(
          `❌ Available services:`,
          Array.from(this.factories.keys()),
        );
        throw new Error(`Service ${name} not registered`);
      }
      this.services.set(name, factory());
    }
    return this.services.get(name);
  }
}

export function setupContainer(): Container {
  const container = new Container();

  // Core Infrastructure
  container.register("Database", () => {
    return new MySQLConnection({
      host: process.env.DB_HOST || "mysql",
      user: process.env.DB_USER || "fanini",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_NAME || "fanini_db",
    });
  });

  container.register("GoogleDriveService", () => {
    return new RetryableGoogleDriveService();
  });

  container.register("LoggerService", () => {
    return new LoggerService();
  });

  // Register all slices
  registerAuthSlice(container);
  registerEventSlice(container);
  registerDocumentSlice(container);
  registerMemberSlice(container);
  registerStatsSlice(container);
  registerCreatorSlice(container);
  registerNewsletterSlice(container);
  registerInternalEventSlice(container);
  registerTaskSlice(container);
  registerOrganizationSlice(container);

  return container;
}
