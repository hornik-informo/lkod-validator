import { ValidationReporter } from "./validator-api";
import { streamN3ToRdf } from "./rdf-reader";
import { validateCatalogFromQuads } from "./catalog-validator-quads";

const GROUP = "TURTLE";

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
    reporter.critical(GROUP, `Can't parse content as turtle: ${error}`);
    return;
  }
  reporter.info(GROUP, `Loaded ${quads.length} statements.`);
  // Validate as RDF.
  await validateCatalogFromQuads(reporter, quads, url);
}
