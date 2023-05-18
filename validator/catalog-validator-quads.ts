import * as RDF from "@rdfjs/types";

import { ValidationReporter } from "./validator-api";
import { validateCatalogWithShacl } from "./shacl";
import { validateCatalogWithSparql } from "./sparql";

const GROUP = "RDF";

const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";

const DCAT_CATALOG = "http://www.w3.org/ns/dcat#Catalog";

const DCAT_HAS_DATASET = "http://www.w3.org/ns/dcat#dataset";

type DatasetValidatorCallback = (
  reporter: ValidationReporter,
  url: string
) => Promise<undefined>;

export async function validateCatalogFromQuads(
  reporter: ValidationReporter,
  datasetValidatorCallback: DatasetValidatorCallback,
  quads: RDF.Quad[],
  expectedCatalogUrl: string,
  forceCatalogUrl: boolean = true
): Promise<undefined> {
  const catalogs = selectCatalogs(quads);
  if (catalogs.length === 1 && !forceCatalogUrl) {
    // There is only one catalog in the data source, and we to not
    // force the URL.
    expectedCatalogUrl = catalogs[0];
  }
  reporter.beginCatalogValidation(expectedCatalogUrl);
  validateCatalogUrl(reporter, catalogs, expectedCatalogUrl);
  await validateCatalogWithShacl(reporter, quads);
  await validateCatalogWithSparql(reporter, quads);
  reporter.endResourceValidation();
  await validateDatasets(reporter, datasetValidatorCallback, quads);
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

function validateCatalogUrl(
  reporter: ValidationReporter,
  catalogs: string[],
  expectedCatalogUrl: string
) {
  if (catalogs.length === 0) {
    reporter.error(GROUP, "No catalog resource found.");
  } else if (catalogs.length > 1) {
    reporter.error(GROUP, `Expected one catalog, found ${catalogs.length}.`);
  } else if (catalogs[0] !== expectedCatalogUrl) {
    reporter.error(
      GROUP,
      `Expected catalog '${expectedCatalogUrl}', 'found ${catalogs[0]}'.`
    );
  } else {
    reporter.info(GROUP, `Found catalog '${catalogs[0]}'`);
  }
}

async function validateDatasets(
  reporter: ValidationReporter,
  datasetValidatorCallback: DatasetValidatorCallback,
  quads: RDF.Quad[]
): Promise<undefined> {
  const datasets = selectDatasets(quads);
  reporter.info(GROUP, `Found ${datasets.length} datasets.`);
  let counter = 1;
  for (const dataset of datasets) {
    reporter.updateStatus(`Validating dataset ${counter} / ${datasets.length}`);
    await datasetValidatorCallback(reporter, dataset);
    ++counter;
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
