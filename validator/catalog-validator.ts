import { ValidationReporter } from "./validator-api";
import { initiateResourceFetch, parseContentType } from "./url";
import { validateCatalogFromJsonLd } from "./catalog-validator-jsonld";
import {
  validateCatalogFromSparql,
  executeAsk,
} from "./catalog-validator-sparql";
import { validateCatalogFromTurtle } from "./catalog-validator-turtle";

const GROUP = "NONE";

export async function validateCatalogFromUrl(
  reporter: ValidationReporter,
  url: string
): Promise<undefined> {
  reporter.beginUrlValidation(url);
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
  if (await isSparqlEndpoint(url)) {
    reporter.info(GROUP, "Validating as SPARQL endpoint.");
    await validateCatalogFromSparql(reporter, url);
    return;
  }
  const response = await initiateResourceFetch(url, reporter);
  const contentTypeHeader = parseContentType(
    response.headers.get("content-type")
  );
  if (contentTypeHeader.type === "text/turtle") {
    reporter.info(GROUP, "Validating as turtle file.");
    await validateCatalogFromTurtle(reporter, url, response);
  } else if (contentTypeHeader.type === "application/ld+json") {
    reporter.info(GROUP, "Validating as JSON-LD file.");
    await validateCatalogFromJsonLd(reporter, url, response);
  } else {
    reporter.critical(
      GROUP,
      `Invalid content type '${contentTypeHeader.type}'.`
    );
  }
}

/**
 * Test SPARQL endpoint by executing simple ASK query
 * @param url
 */
async function isSparqlEndpoint(url: string): Promise<boolean> {
  try {
    await executeAsk(url, "ASK {?s ?p ?o}");
    return true;
  } catch {
    return false;
  }
}
