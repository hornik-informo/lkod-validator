import { DatasetSparqlValidator } from "../../specification";

const validator: DatasetSparqlValidator = async ({
  dataset,
  ask,
  reporter,
}) => {
  const query = createQuery(dataset);
  if (await ask(query)) {
    reporter.info("sparql.group", "specification.has-publisher-ovm");
  } else {
    reporter.warning("sparql.group", "specification.missing-publisher-ovm");
  }
};

export default validator;

const createQuery = (dataset: string) => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dcterms: <http://purl.org/dc/terms/>

ASK {
  <${dataset}> a dcat:Dataset ;
    dcterms:publisher ?publisher .
  FILTER(isIRI(?publisher) && STRSTARTS(STR(?publisher), "https://rpp-opendata.egon.gov.cz/odrpp/zdroj/orgán-veřejné-moci/"))
}`;
