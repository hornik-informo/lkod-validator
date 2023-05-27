import { ResourceContentType, ValidationReporter } from "./validator-api";
import { initiateResourceFetch } from "./url";
import { validateDatasetFromJsonld } from "./dataset-validator-jsonld";
import { validateDatasetFromTurtle } from "./dataset-validator-turtle";
import {
  detectContentType,
  detectContentTypeFromUrl,
} from "./url/content-type";

const GROUP = "dataset.group";

export async function validateDatasetFromUrl(
  reporter: ValidationReporter,
  url: string
): Promise<undefined> {
  reporter.beginDatasetValidation(url);
  try {
    await validateUrlOrThrow(reporter, url);
  } catch (error) {
    console.log("Validation failed with exception.", error);
  } finally {
    reporter.endResourceValidation();
  }
}

async function validateUrlOrThrow(
  reporter: ValidationReporter,
  url: string
): Promise<undefined> {
  const response = await initiateResourceFetch(url, reporter);
  if (response === null) {
    return;
  }
  const contentTypeHeader = response.headers.get("content-type");
  let { contentType, type } = detectContentType(contentTypeHeader);
  if (type === null) {
    reporter.warning(GROUP, "validator.unknown-content-type", { contentType });
    type = detectContentTypeFromUrl(url);
    if (type === null) {
      reporter.critical(GROUP, "validator.unknown-extension");
      return;
    }
  }
  reporter.contentType(type);
  if (ResourceContentType.TURTLE === type) {
    reporter.info(GROUP, "validator.as-turtle");
    await validateDatasetFromTurtle(reporter, url, response);
  } else if (ResourceContentType.JSONLD === type) {
    reporter.info(GROUP, "validator.as-jsonld");
    await validateDatasetFromJsonld(reporter, url, response);
  }
}
