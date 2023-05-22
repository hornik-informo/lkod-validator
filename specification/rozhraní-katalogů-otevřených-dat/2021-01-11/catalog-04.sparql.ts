import { CatalogSparqlValidator } from "../../specification";

const validator: CatalogSparqlValidator = async ({ ask, reporter }) => {
  const query = createQuery();
  if (await ask(query)) {
    reporter.info("sparql.group", "specification.has-description");
  } else {
    reporter.error("sparql.group", "specification.missing-description");
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
