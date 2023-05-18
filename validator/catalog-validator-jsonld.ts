import { ValidationReporter } from "./validator-api";
import { validateCatalogWithJsonSchema } from "./json-schema";
import { jsonLdToRdf } from "./rdf-reader";
import { validateCatalogFromQuads } from "./catalog-validator-quads";
import { validateDatasetFromUrl } from "./dataset-validator";

const GROUP = "json-ld.group";

export async function validateCatalogFromJsonLd(
  reporter: ValidationReporter,
  url: string,
  response: Response
): Promise<undefined> {
  // Parse data.
  let responseData;
  try {
    responseData = await response.json();
  } catch (error) {
    reporter.critical(GROUP, "json-ld.can-not-parse-json", {error});
    return;
  }
  // Validate using JSON Schema.
  await validateCatalogWithJsonSchema(reporter, responseData);
  // Convert to RDF.
  let quads;
  try {
    quads = await jsonLdToRdf(responseData);
  } catch (error) {
    reporter.critical(GROUP, "json-ld.can-not-parse-json-ld", {error});
    return;
  }
  reporter.info(GROUP, "validator.quad-count", {count: quads.length});
  // Validate as RDF.
  await validateCatalogFromQuads(reporter, validateDatasetFromUrl, quads, url);
}
