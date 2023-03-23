import * as RDF from "@rdfjs/types";
import factory from "rdf-ext";
import SHACLValidator from "rdf-validate-shacl";

import { ValidationReporter } from "../validator-api";
import { stringN3ToRdf } from "../rdf-reader";
import { v20210111 } from "../../specification/rozhraní-katalogů-otevřených-dat/";
import { ValidationReport } from "rdf-validate-shacl/src/validation-report";

export async function validateCatalogWithShacl(
  reporter: ValidationReporter,
  content: RDF.Quad[]
): Promise<void> {
  for (const catalogShape of v20210111.Catalog.SHACL) {
    const shape = await createShape(catalogShape.create());
    const validator = new SHACLValidator(shape, { factory });
    const report = await validator.validate(quadsToDataset(content));
    if (report.conforms) {
      catalogShape.pass(reporter);
    } else {
      reportShapes(reporter, report);
      catalogShape.failed(reporter);
    }
  }
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

function reportShapes(reporter: ValidationReporter, report: ValidationReport) {
  // TODO Report violated shapes.
  // for (const result of report.results) {
  //   // See https://www.w3.org/TR/shacl/#results-validation-result for details
  //   // about each property
  //   console.log(result.message)
  //   console.log(result.path)
  //   console.log(result.focusNode)
  //   console.log(result.severity)
  //   console.log(result.sourceConstraintComponent)
  //   console.log(result.sourceShape)
  // }
}
