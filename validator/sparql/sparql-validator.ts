import * as RDF from "@rdfjs/types";
import { MemoryLevel } from "memory-level";
import { Quadstore } from "quadstore";
import { DataFactory } from "rdf-data-factory";
import { Engine } from "quadstore-comunica";

import { ValidationReporter } from "../validator-api";
import { v20210111 } from "../../specification/rozhraní-katalogů-otevřených-dat/";

export interface SparqlWrap {
  ask: (query: string) => Promise<Boolean>;
  select: (query: string) => Promise<object[]>;
}

export async function validateCatalogWithSparql(
  reporter: ValidationReporter,
  content: RDF.Quad[]
): Promise<void> {
  const sparqlWrap = await wrapWithSparql(content);
  await validateCatalog(reporter, sparqlWrap);
}

export async function wrapWithSparql(content: RDF.Quad[]): Promise<SparqlWrap> {
  const engine = await prepareEngine(content);
  const ask = (query: string) => engine.queryBoolean(query);
  const select = (query: string) => executeSelect(engine, query);
  return { ask, select };
}

async function prepareEngine(content: RDF.Quad[]): Promise<Engine> {
  const store = new Quadstore({
    backend: new MemoryLevel(),
    dataFactory: new DataFactory(),
  });
  const engine = new Engine(store as any);
  await store.open();
  content.forEach(quad => store.put(quad));
  return engine;
}

async function executeSelect(engine: Engine, query: string): Promise<object[]> {
  const stream = await engine.queryBindings(query);
  return new Promise((accept, reject) => {
    const collector = [];
    stream.on("data", binding => collector.push(binding));
    stream.on("end", () => accept(collector));
    stream.on("error", error => reject(error));
  });
}

async function validateCatalog(reporter: ValidationReporter, wrap: SparqlWrap) {
  for (const validator of v20210111.Catalog.SPARQL) {
    await validator({ ...wrap, reporter });
  }
}

export async function validateDatasetWithSparql(
  reporter: ValidationReporter,
  sparqlWrap: SparqlWrap,
  dataset: string
): Promise<void> {
  for (const validator of v20210111.Dataset.SPARQL) {
    await validator({ ...sparqlWrap, dataset, reporter });
  }
}

export async function validateDistributionWithSparql(
  reporter: ValidationReporter,
  sparqlWrap: SparqlWrap,
  dataset: string,
  distribution: string
): Promise<void> {
  for (const validator of v20210111.Distributions.SPARQL) {
    await validator({ ...sparqlWrap, dataset, distribution, reporter });
  }
}
