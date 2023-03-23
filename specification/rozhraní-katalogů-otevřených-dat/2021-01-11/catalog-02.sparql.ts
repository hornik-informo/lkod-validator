import { ValidationReporter } from "../../../validator";

const create = () => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
ASK {
  [] a dcat:Catalog ;
    dcat:dataset [] .
}`;

const pass = (reporter: ValidationReporter) => {
  reporter.info("SPARQL", `V katalogu je odkaz na nějaký dataset.`);
};

const failed = (reporter: ValidationReporter) => {
  reporter.error("SPARQL", `V katalogu není odkaz na nějaký dataset.`);
};

export default {
  create,
  pass,
  failed,
};
