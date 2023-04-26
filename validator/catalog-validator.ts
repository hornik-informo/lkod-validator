import { SparqlEndpointFetcher } from "fetch-sparql-endpoint";

import { ValidationReporter } from "./validator-api";
import { initiateResourceFetch, parseContentType } from "./url";
import { validateCatalogFromJsonLd } from "./catalog-validator-jsonld";
import { validateCatalogFromSparql } from "./catalog-validator-sparql";
import { validateCatalogFromTurtle } from "./catalog-validator-turtle";

const GROUP = "NONE";

const JSON_EXTENSION = ["json", "jsonld"];

const TURTLE_EXTENSION = ["ttl"];

const fetcher = new SparqlEndpointFetcher();

export async function validateCatalogFromUrl(
  reporter: ValidationReporter,
  url: string
): Promise<undefined> {
  reporter.beginUrlValidation(url);
  try {
    await validateUrlOrThrow(reporter, url);
  } catch (error) {
    console.error("Validation failed with exception.", error);
    reporter.critical(GROUP, "There might be a bug in this application.");
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
  if (response === null) {
    return;
  }
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
    reporter.warning(
      GROUP,
      `Can't determine type from content type '${contentTypeHeader.type}'.`
    );
    const extension = getExtension(url);
    if (JSON_EXTENSION.includes(extension)) {
      reporter.info(
        GROUP,
        "Validating as JSON-LD file based on file extension"
      );
      await validateCatalogFromJsonLd(reporter, url, response);
    } else if (TURTLE_EXTENSION.includes(extension)) {
      reporter.info(
        GROUP,
        "Validating as turtle file based on file extension."
      );
      await validateCatalogFromTurtle(reporter, url, response);
    } else {
      reporter.critical(GROUP, `Can not determine type of data.`);
    }
  }
}

/**
 * Test SPARQL endpoint by executing simple ASK query
 * @param url
 */
async function isSparqlEndpoint(url: string): Promise<boolean> {
  try {
    await fetcher.fetchAsk(url, "ASK {?s ?p ?o}");
    return true;
  } catch {
    return false;
  }
}

function getExtension(url: string): string {
  return url.substr(url.lastIndexOf(".") + 1).toLowerCase();
}
