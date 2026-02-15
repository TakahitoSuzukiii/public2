import path from "path";
import { Logger, LogLevel } from "./../logger/logger";
import { fetchIpsJson, IpEntry } from "./fetch-ips-json";
import { updateCdkJson } from "./update-cdk-json.ts";

const logger = Logger.getInstance(LogLevel.Info);
logger.setContext();

const ZSCALER_URL = "https://config.zscaler.com/api/zscaler.net/future/json";
const CDK_JSON_PATH = path.resolve(__dirname, "../cdk.json");

async function main() {
  logger.info({
    functionName: "main",
    message: { action: "Fetching Zscaler IP list" },
  });

  const result = await fetchIpsJson(ZSCALER_URL).run();

  if (result.isFailure()) {
    logger.error({
      functionName: "main",
      message: result.getFailure(),
    });
    process.exit(1);
  }

  const json = result.getValue();

  const ipv4Ranges = json.ips
    .filter((item: IpEntry) => Array.isArray(item.ipv4Ranges))
    .flatMap((item: IpEntry) => item.ipv4Ranges ?? []);

  logger.info({
    functionName: "main",
    message: { ipv4Count: ipv4Ranges.length },
  });

  const updateResult = await updateCdkJson(CDK_JSON_PATH, ipv4Ranges).run();

  if (updateResult.isFailure()) {
    logger.error({
      functionName: "main",
      message: updateResult.getFailure(),
    });
    process.exit(1);
  }

  logger.info({
    functionName: "main",
    message: { updated: true },
  });
}

main().catch((err) => {
  logger.error({
    functionName: "main",
    message: { error: err.message },
  });
  process.exit(1);
});
