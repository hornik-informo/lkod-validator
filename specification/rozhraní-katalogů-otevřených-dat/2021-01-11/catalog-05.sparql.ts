import { ValidationReporter } from "../../../validator";

const create = () => `
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
ASK {
  [] a dcat:Catalog ;
    dcterms:publisher ?publisher .
    FILTER(isIRI(?publisher))
}`;

const pass = (reporter: ValidationReporter) => {
  reporter.info("SPARQL", `V katalogu je poskytovatel.`);
};

const failed = (reporter: ValidationReporter) => {
  reporter.error("SPARQL", `V katalogu není poskytovatel.`);
};

export default {
  create,
  pass,
  failed,
};
