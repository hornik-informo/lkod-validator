import { ValidationReporter } from "../validator-api";
import { addSchema, validate } from "@hyperjump/json-schema";
import { BASIC } from "@hyperjump/json-schema/experimental";
import "@hyperjump/json-schema/draft-2019-09";

import { v20200701 } from "../../specification/základní-datové-typy/";
import { v20210111 } from "../../specification/rozhraní-katalogů-otevřených-dat";

addSchema(patchJsonSchemaPattern(v20200701.TextJsonSchema));
addSchema(patchJsonSchemaPattern(v20200701.TextsJsonSchema));
addSchema(patchJsonSchemaPattern(v20210111.Catalog.JSON_SCHEMA));
addSchema(patchJsonSchemaPattern(v20210111.Dataset.JSON_SCHEMA));

const GROUP = "JSON-SCHEMA";

const CATALOG_SCHEMA_ID = v20210111.Catalog.JSON_SCHEMA["$id"];

const DATASET_SCHEMA_ID = v20210111.Dataset.JSON_SCHEMA["$id"];

function patchJsonSchemaPattern(schemaObject: any): any {
  if (typeof schemaObject !== "object") {
    return schemaObject;
  }

  for (const [key, value] of Object.entries(schemaObject)) {
    if (key === "pattern") {
      schemaObject[key] = sanitizePattern(value);
    } else {
      patchJsonSchemaPattern(value);
    }
  }

  return schemaObject;
}

function sanitizePattern(value: string): string {
  // Loading from JSON directly does not work for values as "^mailto\\:".
  return value.replace(/\\:/g, ":");
}

export async function validateCatalogWithJsonSchema(
  reporter: ValidationReporter,
  content: any
) {
  const report = await validate(CATALOG_SCHEMA_ID, content, BASIC);
  if (report.valid) {
    reporter.info(GROUP, "JSON is valid according to JSON schema.");
  } else {
    reporter.error(GROUP, "JSON is not valid according to JSON schema.");
  }
}

export async function validateDatasetWithJsonSchema(
  reporter: ValidationReporter,
  content: any
) {
  const report = await validate(DATASET_SCHEMA_ID, content, BASIC);
  if (report.valid) {
    reporter.info(GROUP, "JSON is valid according to JSON schema.");
  } else {
    reporter.error(GROUP, "JSON is not valid according to JSON schema.");
  }
}
