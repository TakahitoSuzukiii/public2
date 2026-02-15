export enum LogLevel {
  Error = "error",
  Warn = "warn",
  Info = "info",
  Debug = "debug",
  Request = "request",
  Response = "response",
}

export interface LogPayload {
  functionName: string;
  message?: object;
}

export interface LogContext {
  traceId?: string;
  requestId?: string;
}

export class Logger {
  private static instance: Logger;
  private context: LogContext = {};

  private constructor(private readonly level: LogLevel) {}

  // Singleton
  static getInstance(level: LogLevel = LogLevel.Info): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(level);
    }
    return Logger.instance;
  }

  private generateUUID(): string {
    return crypto.randomUUID();
  }

  setContext(context?: Partial<LogContext>): void {
    this.context = {
      traceId: context?.traceId ?? this.generateUUID(),
      requestId: context?.requestId ?? this.generateUUID(),
    };
  }

  private format(level: LogLevel, payload: LogPayload): string {
    const { functionName, message = {} } = payload;

    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      traceId: this.context.traceId,
      requestId: this.context.requestId,
      functionName,
      message,
    });
  }

  error(payload: LogPayload): void {
    console.error(this.format(LogLevel.Error, payload));
  }

  warn(payload: LogPayload): void {
    console.warn(this.format(LogLevel.Warn, payload));
  }

  info(payload: LogPayload): void {
    console.log(this.format(LogLevel.Info, payload));
  }

  debug(payload: LogPayload): void {
    console.log(this.format(LogLevel.Debug, payload));
  }

  request(payload: LogPayload): void {
    console.log(this.format(LogLevel.Request, payload));
  }

  response(payload: LogPayload): void {
    console.log(this.format(LogLevel.Response, payload));
  }
}
