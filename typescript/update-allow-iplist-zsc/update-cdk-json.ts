import fs from "fs";
import { Logger, LogLevel } from "../logger/logger";
import { Result, SuccessResult, FailureResult, Failure } from "../result/result";
import { ResultPipeline } from "../result/result-pipeline";

const logger = Logger.getInstance(LogLevel.Info);

export function updateCdkJson(
  filePath: string,
  ipv4Ranges: string[],
): ResultPipeline<void, Failure> {
  const promise = new Promise<Result<void, Failure>>((resolve) => {
    try {
      logger.info({
        functionName: "updateCdkJson",
        message: { action: "Reading cdk.json", filePath },
      });

      const raw = fs.readFileSync(filePath, "utf8");

      const json = JSON.parse(raw) as {
        allowedIpV4AddressRanges?: string[];
        [key: string]: unknown;
      };

      json.allowedIpV4AddressRanges = ipv4Ranges;

      logger.info({
        functionName: "updateCdkJson",
        message: { action: "Writing updated cdk.json", count: ipv4Ranges.length },
      });

      fs.writeFileSync(filePath, JSON.stringify(json, null, 2));

      resolve(new SuccessResult<void>(undefined));
    } catch (err) {
      resolve(
        new FailureResult({
          code: "UPDATE_CDK_JSON_ERROR",
          message: (err as Error).message,
        })
      );
    }
  });

  return ResultPipeline.from(promise);
}
