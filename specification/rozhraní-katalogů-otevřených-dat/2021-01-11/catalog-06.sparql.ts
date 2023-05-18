import {CatalogSparqlValidator} from "../../specification";

const validator: CatalogSparqlValidator = async ({ask, reporter}) => {
  const query = createQuery();
  if (await ask(query)) {
    reporter.info("sparql.group", "specification.has-publisher-ovm");
  } else {
    reporter.warning("sparql.group", "specification.missing-publisher-ovm");
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
