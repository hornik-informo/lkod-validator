import { addSchema, validate } from "@hyperjump/json-schema";
import { BASIC } from "@hyperjump/json-schema/experimental";
import "@hyperjump/json-schema/draft-2019-09";
import "@hyperjump/json-schema/draft-2020-12";

export interface JsonSchemaService {

  addJsonSchema(jsonSchema: object): string;

  addJsonSchemaString(jsonSchema: string): string;

  validate(jsonSchemaIdentifier: string, value: unknown) : Promise<boolean>;

}

export const createJsonSchemaService = () => new DefaultJsonSchemaService();

class DefaultJsonSchemaService implements JsonSchemaService {

  addJsonSchema(jsonSchema: object): string {
    addSchema(patchJsonSchemaPattern(jsonSchema));
    return jsonSchema["$id"];
  }

  addJsonSchemaString(jsonSchema: string): string {
    addSchema(patchJsonSchemaPattern(jsonSchema));
    return jsonSchema["$id"];
  }

  async validate(jsonSchemaIdentifier: string, value: any): Promise<boolean> {
    const report = await validate(jsonSchemaIdentifier, value, BASIC);
    return report.valid;
  }

}

function patchJsonSchemaPattern(schemaObject: any): any {
  if (typeof schemaObject !== "object") {
    return schemaObject;
  }
  for (const [key, value] of Object.entries(schemaObject)) {
    if (key === "pattern") {
      schemaObject[key] = sanitizePattern(String(value));
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
