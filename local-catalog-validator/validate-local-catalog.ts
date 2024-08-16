// Command line interface for local data catalog validator.
// Given URL of a catalog to validate prints a JSON report to standard output.

import { createFetchService } from "../service/fetch";
import { createJsonSchemaService } from "../service/json-schema";
import { createNoOpLogger } from "../service/logger";

import { loadSchemasToJsonSchemaService, LocalCatalogLoader } from "./local-catalog-loader";
import { createLocalCatalogReport } from "./local-catalog-validator";

await (async function main() {
  // Use last argument as the URL.
  if (process.argv.length !== 3) {
    console.log("Please read instrcutions in the readme file on how to use this command.")
    return;
  }

  const url = process.argv[process.argv.length - 1];
  const fetchService = createFetchService();
  const jsonSchemaService = createJsonSchemaService();
  loadSchemasToJsonSchemaService(jsonSchemaService);
  const logger = createNoOpLogger();

  const loader = new LocalCatalogLoader(fetchService, jsonSchemaService, logger);
  const localCatalog = await loader.load(url);

  const report = createLocalCatalogReport(localCatalog);

  // We remove issues as they are part of the internal state.
  delete (report.summary as any).issues;
  report.datasets.forEach(dataset => {
    delete (dataset as any).issues;
    dataset.datasets.forEach(dataset => {
      delete (dataset as any).issues;
      dataset.distributions.forEach(distribution => {
        delete (distribution as any).issues;
      });
    });
  })

  console.log(JSON.stringify(report, null, 2));
})();
