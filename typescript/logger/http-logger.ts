import { Logger, LogLevel } from "./logger";

export interface RequestPayload {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
}

export interface ResponsePayload {
  statusCode: number;
  headers?: Record<string, string>;
  body?: unknown;
}

const logger = Logger.getInstance(LogLevel.Debug);

export const requestLogger = (params: {
  functionName: string;
  message: RequestPayload;
}) => {
  logger.request({
    functionName: params.functionName,
    message: params.message,
  });
};

export const responseLogger = (params: {
  functionName: string;
  message: ResponsePayload;
}) => {
  logger.response({
    functionName: params.functionName,
    message: params.message,
  });
};
