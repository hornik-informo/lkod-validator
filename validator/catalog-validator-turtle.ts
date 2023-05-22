import { ValidationReporter } from "./validator-api";
import { streamN3ToRdf } from "./rdf-reader";
import { validateCatalogFromQuads } from "./catalog-validator-quads";
import { validateDatasetFromUrl } from "./dataset-validator";

const GROUP = "turtle.group";

export async function validateCatalogFromTurtle(
  reporter: ValidationReporter,
  url: string,
  response: Response
): Promise<undefined> {
  // Convert to RDF.
  let quads;
  try {
    quads = await streamN3ToRdf(response.body.getReader(), "Turtle");
  } catch (error) {
    reporter.critical(GROUP, "turtle.can-not-parse", { error });
    return;
  }
  reporter.info(GROUP, "validator.quad-count", { count: quads.length });
  // Validate as RDF.
  await validateCatalogFromQuads(reporter, validateDatasetFromUrl, quads, url);
}
