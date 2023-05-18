import {CatalogSparqlValidator} from "../../specification";

const validator: CatalogSparqlValidator = async ({ask, reporter}) => {
  const query = createQuery();
  if (await ask(query)) {
    reporter.info("SPARQL", "V katalogu je poskytovatel OVM.");
  } else {
    reporter.warning("SPARQL", "V katalogu není poskytovatel OVM.");
  }
};

export default validator;

const createQuery = () => `
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
ASK {
  [] a dcat:Catalog ;
    dcterms:publisher ?publisher .
  FILTER(isIRI(?publisher) && STRSTARTS(STR(?publisher), "https://rpp-opendata.egon.gov.cz/odrpp/zdroj/orgán-veřejné-moci/"))
}`;
