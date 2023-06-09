import * as RDF from "@rdfjs/types";

import { ValidationReporter } from "./validator-api";
import { validateDatasetWithSparql, wrapWithSparql } from "./sparql";
import { SparqlWrap } from "./sparql/sparql-validator";
import { validateDistributionWithSparql } from "./sparql/sparql-validator";

const GROUP = "quads.group";

const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";

const DCAT_DATASET = "http://www.w3.org/ns/dcat#Dataset";

const DCAT_DISTRIBUTION = "http://www.w3.org/ns/dcat#Distribution";

const DCAT_HAS_DISTRIBUTION = "http://www.w3.org/ns/dcat#distribution";

export async function validateDatasetFromQuads(
  reporter: ValidationReporter,
  quads: RDF.Quad[],
  expectedDatasetUrl: string
): Promise<undefined> {
  reporter.contentAsRdf(quads);
  const datasets = validateDatasetUrl(reporter, quads, expectedDatasetUrl);
  const distributions = selectDistributions(quads);
  const sparqlWrap = await wrapWithSparql(quads);
  for (const dataset of datasets) {
    await validateDatasetWithSparql(reporter, sparqlWrap, dataset);
    await validateDistributions(
      reporter,
      sparqlWrap,
      dataset,
      distributions[dataset] ?? []
    );
  }
}

function validateDatasetUrl(
  reporter: ValidationReporter,
  quads: RDF.Quad[],
  expectedDatasetUrl: string
): string[] {
  const datasets = selectDatasets(quads);
  if (datasets.length === 0) {
    reporter.critical(GROUP, "quads.missing-dataset");
  } else if (datasets.length > 1) {
    reporter.error(GROUP, "quads.multiple-datasets", {
      count: datasets.length,
    });
  } else if (datasets[0] !== expectedDatasetUrl) {
    reporter.error(GROUP, "quads.unexpected-dataset", {
      expected: expectedDatasetUrl,
      actual: datasets[0],
    });
  } else {
    reporter.info(GROUP, "quads.dataset-url", { url: datasets[0] });
  }
  return datasets;
}

function selectDatasets(quads: RDF.Quad[]): string[] {
  const result = [];
  for (const {
    subject: { value: subject },
    predicate: { value: predicate },
    object: { value: object },
  } of quads) {
    if (predicate === RDF_TYPE && object === DCAT_DATASET) {
      result.push(subject);
    }
  }
  return result;
}

function selectDistributions(quads: RDF.Quad[]): Record<string, string[]> {
  // Collect list of distributions and their connection to datasets.
  const distibutions = new Set<string>();
  const ownership: Record<string, string> = {};
  for (const {
    subject: { value: subject },
    predicate: { value: predicate },
    object: { value: object },
  } of quads) {
    if (predicate === DCAT_HAS_DISTRIBUTION) {
      ownership[object] = subject;
    } else if (predicate === RDF_TYPE && object === DCAT_DISTRIBUTION) {
      distibutions.add(subject);
    }
  }
  const result = {};
  for (const [distribution, dataset] of Object.entries(ownership)) {
    if (distibutions.has(distribution)) {
      result[dataset] = [...(result[dataset] ?? []), distribution];
    }
  }
  return result;
}

async function validateDistributions(
  reporter: ValidationReporter,
  sparqlWrap: SparqlWrap,
  dataset: string,
  distributions: string[]
): Promise<undefined> {
  if (distributions.length === 0) {
    // It may be that this is top dataset in dataset series.
    // Yet since we may have data only about single dataset (loaded
    // from TTL or JSON-LD file) we are unable to check for any related
    // using isPartOf.
    return;
  }
  for (const distribution of distributions) {
    await validateDistributionWithSparql(
      reporter,
      sparqlWrap,
      dataset,
      distribution
    );
  }
}
