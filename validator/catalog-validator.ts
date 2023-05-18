import {SparqlEndpointFetcher} from "fetch-sparql-endpoint";

import {ValidationReporter} from "./validator-api";
import {initiateResourceFetch, parseContentType} from "./url";
import {validateCatalogFromJsonLd} from "./catalog-validator-jsonld";
import {validateCatalogFromSparql} from "./catalog-validator-sparql";
import {validateCatalogFromTurtle} from "./catalog-validator-turtle";

const GROUP = "catalog.group";

const JSON_EXTENSION = ["json", "jsonld"];

const TURTLE_EXTENSION = ["ttl"];

const fetcher = new SparqlEndpointFetcher();

export async function validateCatalogFromUrl(
  reporter: ValidationReporter,
  url: string
): Promise<undefined> {
  reporter.beginUrlValidation(url);
  reporter.updateStatus("catalog.validating-catalog");
  try {
    await validateUrlOrThrow(reporter, url);
  } catch (error) {
    reporter.critical(GROUP, "catalog.unexpected-error", {error});
  } finally {
    reporter.endResourceValidation();
  }
  reporter.updateStatus("catalog.validation-is-done");
}

async function validateUrlOrThrow(
  reporter: ValidationReporter,
  url: string
): Promise<undefined> {
  if (await isSparqlEndpoint(url)) {
    reporter.info(GROUP, "catalog.as-sparql");
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
    reporter.info(GROUP, "catalog.as-turtle");
    await validateCatalogFromTurtle(reporter, url, response);
  } else if (contentTypeHeader.type === "application/ld+json") {
    reporter.info(GROUP, "catalog.as-jsonld");
    await validateCatalogFromJsonLd(reporter, url, response);
  } else {
    reporter.warning(GROUP, "catalog.unknown-content-type",
      {type: contentTypeHeader.type});
    const extension = getExtension(url);
    if (JSON_EXTENSION.includes(extension)) {
      reporter.info(GROUP, "catalog.as-jsonld-by-extension");
      await validateCatalogFromJsonLd(reporter, url, response);
    } else if (TURTLE_EXTENSION.includes(extension)) {
      reporter.info(GROUP, "catalog.as-turtle-by-extension");
      await validateCatalogFromTurtle(reporter, url, response);
    } else {
      reporter.critical(GROUP, "catalog.can-not-determine-type");
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
