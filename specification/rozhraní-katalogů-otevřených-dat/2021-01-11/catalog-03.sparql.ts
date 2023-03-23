import { ValidationReporter } from "../../../validator";

const create = () => `
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
ASK {
  [] a dcat:Catalog ;
    dcterms:title ?title .
    FILTER(langMatches(LANG(?title), "cs"))
}`;

const pass = (reporter: ValidationReporter) => {
  reporter.info("SPARQL", `V katalogu je český název.`);
};

const failed = (reporter: ValidationReporter) => {
  reporter.error("SPARQL", `V katalogu není český název.`);
};

export default {
  create,
  pass,
  failed,
};
