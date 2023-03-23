import {ValidationReporter} from "../../../validator";

const create = (dataset: string) => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
ASK {
  <${dataset}> a dcat:Dataset
}`;

const pass = (reporter: ValidationReporter) => {
  reporter.info("SPARQL", `Nalezena datová sada.`);
};

const failed = (reporter: ValidationReporter) => {
  reporter.error("SPARQL", `Nenalezena datová sada.`);
};

export default {
  create,
  pass,
  failed
};
