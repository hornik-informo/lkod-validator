import * as RDF from "@rdfjs/types";
import factory from "rdf-ext";
import SHACLValidator from "rdf-validate-shacl";

import { stringN3ToRdf } from "./rdf";

export interface ShaclWrap {
  /**
   * Validates data using SHACL and returns result.
   */
  validate: (shacl: string) => Promise<boolean>;
}

/**
 * Given RDF quads return object with ability to perform SHACL validaiton.
 */
export async function validateWithShacl(
  content: RDF.Quad[],
): Promise<ShaclWrap> {
  return {
    validate: async (shacl: string) => {
      const shape = await createShape(shacl);
      const validator = new SHACLValidator(shape, { factory });
      const report = await validator.validate(quadsToDataset(content));
      return report.conforms;
    },
  };
}

async function createShape(contentAsTurtle: string): Promise<RDF.DatasetCore> {
  const quads = await stringN3ToRdf(contentAsTurtle, "Turtle");
  const result = factory.dataset();
  result.addAll(quads);
  return result as RDF.DatasetCore;
}

function quadsToDataset(quads: RDF.Quad[]): RDF.DatasetCore {
  const result = factory.dataset();
  result.addAll(quads);
  return result as RDF.DatasetCore;
}
