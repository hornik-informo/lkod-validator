import {ValidationReporter} from "../../../validator";

const create = () => `
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
ASK {
  [] a dcat:Catalog ;
    dcterms:description ?description .
    FILTER(langMatches(LANG(?description), "cs"))
}`;

const pass = (reporter: ValidationReporter) => {
  reporter.info("SPARQL", `V katalogu je český popis.`);
};

const failed = (reporter: ValidationReporter) => {
  reporter.error("SPARQL", `V katalogu není český popis.`);
};

export default {
  create,
  pass,
  failed
};
