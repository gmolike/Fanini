// apps/api/src/domain/repositories/ISettingsRepository.ts
import type { Settings } from "@/domain/entities/Settings";

export type ISettingsRepository = {
  getSettings(): Promise<Settings>;
  updateSettings(data: Partial<Settings>, userId: string): Promise<Settings>;
}
