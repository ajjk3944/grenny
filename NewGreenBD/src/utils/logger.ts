/**
 * Logger Utility
 * Centralized logging with different levels and environments
 */

import { AppConfig } from './appConfig';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: Date;
  context?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private enabled = AppConfig.enableLogging;

  private log(level: LogLevel, message: string, data?: any, context?: string) {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date(),
      context,
    };

    // Store log entry
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove oldest log
    }

    // Console output in development
    if (this.enabled || __DEV__) {
      const prefix = context ? `[${context}]` : '';
      const timestamp = entry.timestamp.toISOString();

      switch (level) {
        case LogLevel.DEBUG:
          console.log(`🔍 ${timestamp} ${prefix} ${message}`, data || '');
          break;
        case LogLevel.INFO:
          console.info(`ℹ️ ${timestamp} ${prefix} ${message}`, data || '');
          break;
        case LogLevel.WARN:
          console.warn(`⚠️ ${timestamp} ${prefix} ${message}`, data || '');
          break;
        case LogLevel.ERROR:
          console.error(`❌ ${timestamp} ${prefix} ${message}`, data || '');
          break;
      }
    }
  }

  debug(message: string, data?: any, context?: string) {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  info(message: string, data?: any, context?: string) {
    this.log(LogLevel.INFO, message, data, context);
  }

  warn(message: string, data?: any, context?: string) {
    this.log(LogLevel.WARN, message, data, context);
  }

  error(message: string, error?: any, context?: string) {
    // Extract error details
    const errorData = error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : error;

    this.log(LogLevel.ERROR, message, errorData, context);
  }

  // Get logs for debugging or sending to server
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter((log) => log.level === level);
    }
    return [...this.logs];
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Export logs as JSON
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Get logs for specific context
  getLogsByContext(context: string): LogEntry[] {
    return this.logs.filter((log) => log.context === context);
  }

  // Get recent logs
  getRecentLogs(count: number = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  // Enable/disable logging
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}

// Create singleton instance
export const logger = new Logger();

// Context-specific loggers
export const createContextLogger = (context: string) => ({
  debug: (message: string, data?: any) => logger.debug(message, data, context),
  info: (message: string, data?: any) => logger.info(message, data, context),
  warn: (message: string, data?: any) => logger.warn(message, data, context),
  error: (message: string, error?: any) => logger.error(message, error, context),
});

// Pre-configured context loggers
export const apiLogger = createContextLogger('API');
export const authLogger = createContextLogger('Auth');
export const cameraLogger = createContextLogger('Camera');
export const locationLogger = createContextLogger('Location');
export const notificationLogger = createContextLogger('Notification');
export const offlineLogger = createContextLogger('Offline');
export const storeLogger = createContextLogger('Store');

// Performance logging
export const performanceLogger = {
  start: (label: string) => {
    if (__DEV__) {
      console.time(label);
    }
  },
  end: (label: string) => {
    if (__DEV__) {
      console.timeEnd(label);
    }
  },
};

// Network request logging
export const logRequest = (method: string, url: string, data?: any) => {
  apiLogger.debug(`${method} ${url}`, data);
};

export const logResponse = (method: string, url: string, status: number, data?: any) => {
  if (status >= 200 && status < 300) {
    apiLogger.info(`${method} ${url} - ${status}`, data);
  } else if (status >= 400) {
    apiLogger.error(`${method} ${url} - ${status}`, data);
  }
};

// Error logging with stack trace
export const logError = (error: Error, context?: string) => {
  logger.error(error.message, error, context);
};

// User action logging (for analytics)
export const logUserAction = (action: string, data?: any) => {
  logger.info(`User action: ${action}`, data, 'UserAction');
};

// Screen view logging
export const logScreenView = (screenName: string) => {
  logger.info(`Screen view: ${screenName}`, undefined, 'Navigation');
};

export default logger;
