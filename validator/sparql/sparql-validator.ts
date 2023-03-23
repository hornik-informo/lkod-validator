import * as RDF from "@rdfjs/types";
import { MemoryLevel } from "memory-level";
import { Quadstore } from "quadstore";
import { DataFactory } from "rdf-data-factory";
import { Engine } from "quadstore-comunica";

import { ValidationReporter } from "../validator-api";
import { v20210111 } from "../../specification/rozhraní-katalogů-otevřených-dat/";

export async function validateCatalogWithSparql(
  reporter: ValidationReporter,
  content: RDF.Quad[]
): Promise<void> {
  const engine = await prepareEngine(content);
  await validateCatalog(reporter, engine);
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

async function validateCatalog(reporter: ValidationReporter, engine: Engine) {
  for (const sparqlAsk of v20210111.Catalog.SPARQL.ASK) {
    const query = sparqlAsk.create();
    const result = await engine.queryBoolean(query);
    if (result) {
      sparqlAsk.pass(reporter);
    } else {
      sparqlAsk.failed(reporter);
    }
  }
}

export async function validateDatasetWithSparql(
  reporter: ValidationReporter,
  content: RDF.Quad[],
  dataset: string
): Promise<void> {
  const engine = await prepareEngine(content);
  await validateDatasets(reporter, engine, dataset);
}

async function validateDatasets(
  reporter: ValidationReporter,
  engine: Engine,
  dataset: string
): Promise<undefined> {
  for (const sparqlAsk of v20210111.Dataset.SPARQL.ASK) {
    const query = sparqlAsk.create(dataset);
    const result = await engine.queryBoolean(query);
    if (result) {
      sparqlAsk.pass(reporter);
    } else {
      sparqlAsk.failed(reporter);
    }
  }
  for (const sparqlAsk of v20210111.Dataset.SPARQL.SELECT) {
    const query = sparqlAsk.create(dataset);
    const result = await executeSelect(engine, query);
    sparqlAsk.handle(reporter, result);
  }
}

async function executeSelect(engine: Engine, query: string): Promise<object[]> {
  const stream = await engine.queryBindings(query);
  return new Promise((accept, reject) => {
    const collector = [];
    stream.on("data", binding => collector.push(binding));
    stream.on("end", () => accept(collector));
    stream.on("data", error => reject(error));
  });
}
