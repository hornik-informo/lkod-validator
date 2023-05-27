import { SparqlEndpointFetcher } from "fetch-sparql-endpoint";

import { ResourceContentType, ValidationReporter } from "./validator-api";
import { initiateResourceFetch } from "./url";
import { validateCatalogFromJsonLd } from "./catalog-validator-jsonld";
import { validateCatalogFromSparql } from "./catalog-validator-sparql";
import { validateCatalogFromTurtle } from "./catalog-validator-turtle";
import {
  detectContentType,
  detectContentTypeFromUrl,
} from "./url/content-type";

const GROUP = "catalog.group";

const fetcher = new SparqlEndpointFetcher();

export async function validateCatalogFromUrl(
  reporter: ValidationReporter,
  url: string
): Promise<undefined> {
  reporter.validationBegin();
  reporter.beginUrlValidation(url);
  reporter.updateStatus("catalog.validating-catalog");
  try {
    await validateUrlOrThrow(reporter, url);
  } catch (error) {
    reporter.critical(GROUP, "catalog.unexpected-error", { error });
    console.error(error);
  } finally {
    reporter.endResourceValidation();
  }
  reporter.updateStatus("catalog.validation-is-done");
  reporter.validationEnd();
}

async function validateUrlOrThrow(
  reporter: ValidationReporter,
  url: string
): Promise<undefined> {
  if (await isSparqlEndpoint(url)) {
    reporter.contentType(ResourceContentType.SPARQL);
    reporter.info(GROUP, "validator.as-sparql");
    await validateCatalogFromSparql(reporter, url);
    return;
  }
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
    await validateCatalogFromTurtle(reporter, url, response);
  } else if (ResourceContentType.JSONLD === type) {
    reporter.info(GROUP, "validator.as-jsonld");
    await validateCatalogFromJsonLd(reporter, url, response);
  }
}

/**
 * Test SPARQL endpoint by executing simple ASK query
 */
async function isSparqlEndpoint(url: string): Promise<boolean> {
  try {
    await fetcher.fetchAsk(url, "ASK {?s ?p ?o}");
    return true;
  } catch {
    return false;
  }
}
