import { SparqlEndpointFetcher } from "fetch-sparql-endpoint";

import { ValidationReporter } from "./validator-api";
import { v20210111 } from "../specification/rozhraní-katalogů-otevřených-dat";

const fetcher = new SparqlEndpointFetcher();

/**
 * Unliked other validators, once we are in SPARQL endpoint,
 * we are not leaving it.
 */
export async function validateCatalogFromSparql(
  reporter: ValidationReporter,
  url: string
): Promise<undefined> {
  // TODO Add SPARQL extraction query to load all relevant quads.
  // await validateCatalog(reporter, url);
  // await validateDatasets(reporter, url);
}

async function validateCatalog(
  reporter: ValidationReporter,
  url: string
): Promise<undefined> {
  for (const sparqlAsk of v20210111.Catalog.SPARQL.ASK) {
    const query = sparqlAsk.create();
    const result = await executeAsk(url, query);
    if (result) {
      sparqlAsk.pass(reporter);
    } else {
      sparqlAsk.failed(reporter);
    }
  }
}

export async function executeAsk(url: string, query: string): Promise<boolean> {
  return await fetcher.fetchAsk(url, query);
}

export async function validateDatasets(
  reporter: ValidationReporter,
  url: string
): Promise<undefined> {
  for (const sparqlAsk of v20210111.Dataset.SPARQL.ASK) {
    const query = sparqlAsk.create();
    const result = await executeAsk(url, query);
    if (result) {
      sparqlAsk.pass(reporter);
    } else {
      sparqlAsk.failed(reporter);
    }
  }
  for (const sparqlAsk of v20210111.Dataset.SPARQL.SELECT) {
    const query = sparqlAsk.create();
    const result = await executeSelect(url, query);
    sparqlAsk.handle(reporter, result);
  }
}

async function executeSelect(url: string, query: string): Promise<object[]> {
  const bindingsStream = await fetcher.fetchBindings(url, query);
  return new Promise((accept, reject) => {
    const collector = [];
    bindingsStream.on("data", binding => collector.push(binding));
    bindingsStream.on("end", () => accept(collector));
    bindingsStream.on("error", error => reject(error));
  });
}
