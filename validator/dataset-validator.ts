import { ResourceContentType, ValidationReporter } from "./validator-api";
import { initiateResourceFetch, parseContentType } from "./url";
import { validateDatasetFromJsonld } from "./dataset-validator-jsonld";
import { validateDatasetFromTurtle } from "./dataset-validator-turtle";

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
  const contentType = parseContentType(
    response.headers.get("content-type")
  ).type;
  if (contentType === "text/turtle") {
    reporter.contentType(ResourceContentType.TURTLE);
    reporter.info(GROUP, "dataset.as-turtle");
    await validateDatasetFromTurtle(reporter, url, response);
  } else if (
    contentType === "application/ld+json" ||
    contentType === "application/json"
  ) {
    reporter.contentType(ResourceContentType.JSONLD);
    reporter.info(GROUP, "dataset.as-jsonld");
    await validateDatasetFromJsonld(reporter, url, response);
  } else {
    reporter.critical(GROUP, "dataset.unknown-content-type", {
      type: contentType,
    });
  }
}
