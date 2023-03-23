import { ValidationReporter } from "./validator-api";
import { validateCatalogWithJsonSchema } from "./json-schema";
import { jsonLdToRdf } from "./rdf-reader";
import { validateCatalogFromQuads } from "./catalog-validator-quads";

const GROUP = "JSON-LD";

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
    reporter.critical(GROUP, `Can't parse content as JSON: ${error}`);
    return;
  }
  // Validate using JSON Schema.
  await validateCatalogWithJsonSchema(reporter, responseData);
  // Convert to RDF.
  let quads;
  try {
    quads = await jsonLdToRdf(responseData);
  } catch (error) {
    reporter.critical(GROUP, `Can't parse content as JSON-LD: ${error}`);
    return;
  }
  reporter.info(GROUP, `Loaded ${quads.length} statements.`);
  // Validate as RDF.
  await validateCatalogFromQuads(reporter, quads, url);
}
