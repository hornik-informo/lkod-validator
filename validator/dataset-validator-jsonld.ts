import {ValidationReporter} from "./validator-api";
import {validateDatasetWithJsonSchema} from "./json-schema";
import {jsonLdToRdf} from "./rdf-reader";
import {validateDatasetFromQuads} from "./dataset-validator-quads";

const GROUP = "JSON-LD";

export async function validateDatasetFromJsonld(
  reporter: ValidationReporter, url: string,
  response: Response
): Promise<undefined> {
  let responseData;
  try {
    responseData = await response.json();
  } catch (error) {
    reporter.critical(
      GROUP,
      `Can't parse content as JSON: ${error}`)
    return;
  }
  await validateDatasetWithJsonSchema(reporter, responseData);
  let quads;
  try {
    quads = await jsonLdToRdf(responseData);
  } catch (error) {
    reporter.critical(
      GROUP,
      `Can't parse content as JSON-LD: ${error}`)
    return;
  }
  reporter.info(
    GROUP,
    `Loaded ${quads.length} statements.`);
  await validateDatasetFromQuads(reporter, quads, url);
}
