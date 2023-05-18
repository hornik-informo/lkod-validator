import {CatalogSparqlValidator} from "../../specification";

const validator: CatalogSparqlValidator = async ({ask, reporter}) => {
  const query = createQuery();
  if (await ask(query)) {
    reporter.info("SPARQL", "V katalogu je český popis.");
  } else {
    reporter.error("SPARQL", "V katalogu není český popis.");
  }
};

export default validator;

const createQuery = () => `
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
ASK {
  [] a dcat:Catalog ;
    dcterms:description ?description .
  FILTER(langMatches(LANG(?description), "cs"))
}`;
