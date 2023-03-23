import {ValidationReporter} from "./validator-api";
import {initiateResourceFetch, parseContentType} from "./url";
import {validateDatasetFromJsonld} from "./dataset-validator-jsonld";
import {validateDatasetFromTurtle} from "./dataset-validator-turtle";

const GROUP = "NONE";

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
  reporter: ValidationReporter, url: string
): Promise<undefined> {
  const response = await initiateResourceFetch(url, reporter);
  const contentTypeHeader =
    parseContentType(response.headers.get("content-type"));
  if (contentTypeHeader.type === "text/turtle") {
    reporter.info(
      GROUP,
      "Validating as turtle file.");
    await validateDatasetFromTurtle(reporter, url, response);
  } else if (contentTypeHeader.type === "application/ld+json") {
    reporter.info(
      GROUP,
      "Validating as JSON-LD file.");
    await validateDatasetFromJsonld(reporter, url, response);
  } else {
    reporter.critical(
      GROUP,
      `Invalid content type '${contentTypeHeader.type}'.`);
  }
}
