import { Quad } from "@rdfjs/types";

import { CatalogSummary, DatasetSummary } from "./summary-service";

const TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";

const CATALOG = "http://www.w3.org/ns/dcat#Catalog";

const TITLE = "http://purl.org/dc/terms/title";

export function loadIntoCatalogSummary(
  catalog: CatalogSummary,
  quads: Quad[]
): CatalogSummary {
  // We first need to detect all catalogs.
  catalog.urls = quads
    .filter(quad => quad.predicate.value === TYPE)
    .filter(quad => quad.object.value === CATALOG)
    .map(quad => quad.subject.value);
  for (const quad of quads) {
    if (!catalog.urls.includes(quad.subject.value)) {
      continue;
    }
    const predicate = quad.predicate.value;
    switch (predicate) {
      case TITLE:
        if (quad.object.language === "cs") {
          catalog.titles = [...catalog.titles, quad.object.value];
        }
        break;
    }
  }
  catalog.contentLoaded = true;
  return catalog;
}

export function loadIntoDatasetSummary(
  dataset: DatasetSummary,
  quads: Quad[]
): DatasetSummary {
  for (const quad of quads) {
    if (dataset.url !== quad.subject.value) {
      continue;
    }
    const predicate = quad.predicate.value;
    switch (predicate) {
      case TITLE:
        dataset.title = quad.object.value;
        break;
    }
  }
  return dataset;
}
