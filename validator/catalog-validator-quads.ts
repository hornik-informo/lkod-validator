import * as RDF from "@rdfjs/types";

import { ValidationReporter } from "./validator-api";
import { validateCatalogWithShacl } from "./shacl";
import { validateCatalogWithSparql } from "./sparql";
import { validateDatasetFromUrl } from "./dataset-validator";

const GROUP = "RDF";

const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";

const DCAT_CATALOG = "http://www.w3.org/ns/dcat#Catalog";

const DCAT_HAS_DATASET = "http://www.w3.org/ns/dcat#dataset";

export async function validateCatalogFromQuads(
  reporter: ValidationReporter,
  quads: RDF.Quad[],
  expectedCatalogUrl: string
): Promise<undefined> {
  validateCatalogUrl(reporter, quads, expectedCatalogUrl);
  await validateCatalogWithShacl(reporter, quads);
  await validateCatalogWithSparql(reporter, quads);
  await validateDatasets(reporter, quads);
}

function validateCatalogUrl(
  reporter: ValidationReporter,
  quads: RDF.Quad[],
  expectedCatalogUrl: string
) {
  const catalogs = selectCatalogs(quads);
  if (catalogs.length === 0) {
    reporter.error(GROUP, "No catalog resource found.");
  } else if (catalogs.length > 1) {
    reporter.error(GROUP, `Expected one catalog, found ${catalogs.length}.`);
  } else if (catalogs[0] !== expectedCatalogUrl) {
    reporter.error(
      GROUP,
      `Expected catalog '${expectedCatalogUrl}', 'found ${catalogs.length}'.`
    );
  } else {
    reporter.info(GROUP, `Found catalog '${catalogs[0]}'`);
  }
}

function selectCatalogs(quads: RDF.Quad[]): string[] {
  const result = [];
  for (const {
    subject: { value: subject },
    predicate: { value: predicate },
    object: { value: object },
  } of quads) {
    if (predicate === RDF_TYPE && object === DCAT_CATALOG) {
      result.push(subject);
    }
  }
  return result;
}

async function validateDatasets(
  reporter: ValidationReporter,
  quads: RDF.Quad[]
): Promise<undefined> {
  const datasets = selectDatasets(quads);
  reporter.info(GROUP, `Found ${datasets.length} datasets.`);
  let counter = 0;
  for (const dataset of datasets) {
    await validateDatasetFromUrl(reporter, dataset);
    ++counter;
    if (counter > 2) break;
  }
}

function selectDatasets(quads: RDF.Quad[]): string[] {
  const result = [];
  for (const {
    predicate: { value: predicate },
    object: { value: object },
  } of quads) {
    if (predicate === DCAT_HAS_DATASET) {
      result.push(object);
    }
  }
  return result;
}
