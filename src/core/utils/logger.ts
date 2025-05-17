import { config } from "@env/config";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private logHistory: LogEntry[] = [];
  private readonly maxHistorySize = 1000;

  constructor(private context: string = "App") {}

  private shouldLog(level: LogLevel): boolean {
    if (config.env === "production") {
      return level !== "debug";
    }
    return true;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: unknown
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message: `[${this.context}] ${message}`,
      data,
    };

    // Keep log history for debugging
    if (config.features.debugInfo) {
      this.logHistory.push(entry);
      if (this.logHistory.length > this.maxHistorySize) {
        this.logHistory.shift();
      }
    }

    return entry;
  }

  private formatMessage(entry: LogEntry): string {
    let message = `${entry.timestamp} [${entry.level.toUpperCase()}] ${
      entry.message
    }`;
    if (entry.data) {
      message += "\n" + JSON.stringify(entry.data, null, 2);
    }
    return message;
  }

  debug(message: string, data?: unknown): void {
    if (this.shouldLog("debug")) {
      const entry = this.createLogEntry("debug", message, data);
      console.debug(this.formatMessage(entry));
    }
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog("info")) {
      const entry = this.createLogEntry("info", message, data);
      console.info(this.formatMessage(entry));
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.shouldLog("warn")) {
      const entry = this.createLogEntry("warn", message, data);
      console.warn(this.formatMessage(entry));
    }
  }

  error(message: string, error?: Error | unknown): void {
    if (this.shouldLog("error")) {
      const entry = this.createLogEntry("error", message, {
        error:
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
                name: error.name,
              }
            : error,
      });
      console.error(this.formatMessage(entry));
    }
  }

  getLogHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  clearHistory(): void {
    this.logHistory = [];
  }
}

// Create logger instances for different contexts
export const createLogger = (context: string) => new Logger(context);

// Default logger instance
export const logger = new Logger();

// Create specific loggers for different parts of the application
export const authLogger = createLogger("Auth");
export const apiLogger = createLogger("API");
export const routerLogger = createLogger("Router");
