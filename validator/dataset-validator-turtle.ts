import { ValidationReporter } from "./validator-api";
import { streamN3ToRdf } from "./rdf-reader";
import { validateDatasetFromQuads } from "./dataset-validator-quads";

const GROUP = "turtle.group";

export async function validateDatasetFromTurtle(
  reporter: ValidationReporter,
  url: string,
  response: Response
): Promise<undefined> {
  let quads;
  try {
    quads = await streamN3ToRdf(response.body.getReader(), "Turtle");
  } catch (error) {
    reporter.critical(GROUP, "turtle.can-not-parse", { error });
    return;
  }
  reporter.info(GROUP, "validator.quad-count", { count: quads.length });
  await validateDatasetFromQuads(reporter, quads, url);
}
