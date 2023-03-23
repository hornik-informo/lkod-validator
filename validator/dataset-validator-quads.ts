import * as RDF from "@rdfjs/types";

import {ValidationReporter} from "./validator-api";
import {validateDatasetWithSparql} from "./sparql";

const GROUP = "RDF";

const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";

const DCAT_DATASET = "http://www.w3.org/ns/dcat#Dataset";

export async function validateDatasetFromQuads(
  reporter: ValidationReporter,
  quads: RDF.Quad[],
  expectedDatasetUrl: string,
): Promise<undefined> {
  const datasets = validateDatasetUrl(reporter, quads, expectedDatasetUrl);
  for (const dataset of datasets) {
    await validateDatasetWithSparql(reporter, quads, dataset);
  }
}

function validateDatasetUrl(
  reporter: ValidationReporter, quads: RDF.Quad[],
  expectedDatasetUrl: string,
): string[] {
  const datasets = selectDatasets(quads);
  if (datasets.length === 0) {
    reporter.error(
      GROUP,
      "No dataset resource found.");
  } else if (datasets.length > 1) {
    reporter.error(
      GROUP,
      `Expected one dataset, found ${datasets.length}.`);
  } else if (datasets[0] !== expectedDatasetUrl) {
    reporter.error(
      GROUP,
      `Expected dataset '${expectedDatasetUrl}', 'found ${datasets.length}'.`);
  } else {
    reporter.info(
      GROUP,
      `Found dataset '${datasets[0]}'`);
  }
  return datasets;
}

function selectDatasets(quads: RDF.Quad[]): string[] {
  const result = [];
  for (const {
    "subject": {"value": subject},
    "predicate": {"value": predicate},
    "object": {"value": object}
  } of quads) {
    if (predicate === RDF_TYPE && object === DCAT_DATASET) {
      result.push(subject);
    }
  }
  return result;
}
