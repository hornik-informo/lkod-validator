import { ValidationReporter } from "../../../validator";

const create = () => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
ASK {
  [] a dcat:Catalog
}`;

const pass = (reporter: ValidationReporter) => {
  reporter.info("SPARQL", "Je tam katalog.");
};

const failed = (reporter: ValidationReporter) => {
  reporter.critical("SPARQL", `Není tam katalog.`);
};

export default {
  create,
  pass,
  failed,
};
