import {CatalogSparqlValidator} from "../../specification";

const validator: CatalogSparqlValidator = async ({ask, reporter}) => {
  const query = createQuery();
  if (await ask(query)) {
    reporter.info("sparql.group", "specification.has-title");
  } else {
    reporter.error("sparql.group", "specification.missing-title");
  }
};

export default validator;

const createQuery = () => `
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
ASK {
  [] a dcat:Catalog ;
    dcterms:title ?title .
    FILTER(langMatches(LANG(?title), "cs"))
}`;
