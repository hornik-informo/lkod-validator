import {ValidationReporter} from "./validator-api";
import {streamN3ToRdf} from "./rdf-reader";
import {validateDatasetFromQuads} from "./dataset-validator-quads";

const GROUP = "NONE";

export async function validateDatasetFromTurtle(
  reporter: ValidationReporter, url: string,
  response: Response,
): Promise<undefined> {
  let quads;
  try {
    quads = await streamN3ToRdf(response.body.getReader(), "Turtle");
  } catch (error) {
    reporter.critical(
      GROUP,
      `Can't parse content as turtle: ${error}`)
    return;
  }
  reporter.info(
    GROUP,
    `Loaded ${quads.length} statements.`);
  await validateDatasetFromQuads(reporter, quads, url)
}
