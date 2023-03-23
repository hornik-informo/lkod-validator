import { ValidationReporter } from "../../../validator";

const create = () => `
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
ASK {
  [] a dcat:Catalog ;
    dcterms:publisher ?publisher .
    FILTER(isIRI(?publisher) && STRSTARTS(STR(?publisher), "https://rpp-opendata.egon.gov.cz/odrpp/zdroj/orgán-veřejné-moci/"))
}`;

const pass = (reporter: ValidationReporter) => {
  reporter.info("SPARQL", `V katalogu je poskytovatel OVM.`);
};

const failed = (reporter: ValidationReporter) => {
  reporter.warning("SPARQL", `V katalogu není poskytovatel OVM.`);
};

export default {
  create,
  pass,
  failed,
};
