import { ValidationReporter } from "./validator-api";
import { validateDatasetWithJsonSchema } from "./json-schema";
import { jsonLdToRdf } from "./rdf-reader";
import { validateDatasetFromQuads } from "./dataset-validator-quads";

const GROUP = "json-ld.group";

export async function validateDatasetFromJsonld(
  reporter: ValidationReporter,
  url: string,
  response: Response
): Promise<undefined> {
  let responseData;
  try {
    responseData = await response.json();
  } catch (error) {
    reporter.critical(GROUP, "json-ld.can-not-parse-json", {error});
    return;
  }
  await validateDatasetWithJsonSchema(reporter, responseData);
  let quads;
  try {
    quads = await jsonLdToRdf(responseData);
  } catch (error) {
    reporter.critical(GROUP, "json-ld.can-not-parse-json-ld", {error});
    return;
  }
  reporter.info(GROUP, "validator.quad-count", {count: quads.length});
  await validateDatasetFromQuads(reporter, quads, url);
}
