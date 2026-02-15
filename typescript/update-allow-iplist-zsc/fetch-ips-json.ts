import https, { IncomingMessage } from "https";
import { Result, SuccessResult, FailureResult, Failure } from "../result/result";
import { ResultPipeline } from "../result/result-pipeline";
import { Logger, LogLevel } from "../logger/logger";

const logger = Logger.getInstance(LogLevel.Info);

export interface IpEntry {
  ipv4Ranges?: string[];
  ipv6Ranges?: string[];
}

export interface IpsResponse {
  ips: IpEntry[];
}

export function safeParseJson<T>(raw: string): Result<T, Failure> {
  try {
    return new SuccessResult(JSON.parse(raw) as T);
  } catch (err) {
    return new FailureResult({
      code: "JSON_PARSE_ERROR",
      message: (err as Error).message,
    });
  }
}

export function fetchIpsJson(
  url: string
): ResultPipeline<IpsResponse, Failure> {
  logger.request({
    functionName: "fetchIpsJson",
    message: { url },
  });

  const promise = new Promise<Result<IpsResponse, Failure>>((resolve) => {
    const handleError = (err: Error) => {
      logger.error({
        functionName: "fetchIpsJson",
        message: { error: err.message },
      });

      resolve(
        new FailureResult({
          code: "FETCH_JSON_ERROR",
          message: err.message,
        })
      );
    };

    const handleEnd = (raw: string) => {
      logger.response({
        functionName: "fetchIpsJson",
        message: { rawLength: raw.length },
      });

      resolve(safeParseJson<IpsResponse>(raw));
    };

    const handleResponse = (res: IncomingMessage) => {
      let raw = "";

      res.on("data", (chunk) => {
        raw += chunk;
      });

      res.on("end", () => {
        handleEnd(raw);
      });
    };

    https.get(url, handleResponse).on("error", handleError);
  });

  return ResultPipeline.from(promise);
}
