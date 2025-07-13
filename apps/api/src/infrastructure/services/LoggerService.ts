// apps/api/src/infrastructure/services/LoggerService.ts
export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogContext {
  userId?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  metadata?: Record<string, any>;
}

/**
 * Logger Service für strukturiertes Logging
 */
export class LoggerService {
  private readonly serviceName = "FaniniAPI";

  /**
   * Log with context
   */
  log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      service: this.serviceName,
      message,
      ...context,
    };

    // In Production würde hier ein echter Logger wie Winston verwendet
    switch (level) {
      case "error":
        console.error("❌", JSON.stringify(logEntry, null, 2));
        break;
      case "warn":
        console.warn("⚠️", JSON.stringify(logEntry, null, 2));
        break;
      case "debug":
        console.debug("🔍", JSON.stringify(logEntry, null, 2));
        break;
      default:
        console.log("ℹ️", JSON.stringify(logEntry, null, 2));
    }
  }

  info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log("error", message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === "development") {
      this.log("debug", message, context);
    }
  }
}

// Singleton instance
export const logger = new LoggerService();
