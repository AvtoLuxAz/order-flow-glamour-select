import { envConfig } from "../config/environment";

export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    data?: unknown,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      error,
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.unshift(entry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.pop();
    }

    // Console output based on environment
    if (envConfig.debugMode) {
      const consoleMethod = {
        info: console.info,
        warn: console.warn,
        error: console.error,
        debug: console.debug,
      }[entry.level];

      consoleMethod(
        `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`,
        entry.data || "",
        entry.error || ""
      );
    }
  }

  public info(message: string, data?: unknown) {
    this.addLog(this.formatMessage("info", message, data));
  }

  public warn(message: string, data?: unknown) {
    this.addLog(this.formatMessage("warn", message, data));
  }

  public error(message: string, error?: Error, data?: unknown) {
    this.addLog(this.formatMessage("error", message, data, error));
  }

  public debug(message: string, data?: unknown) {
    if (envConfig.debugMode) {
      this.addLog(this.formatMessage("debug", message, data));
    }
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();
