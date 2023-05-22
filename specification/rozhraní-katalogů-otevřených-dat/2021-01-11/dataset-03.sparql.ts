import { DatasetSparqlValidator } from "../../specification";

const validator: DatasetSparqlValidator = async ({
  dataset,
  ask,
  reporter,
}) => {
  const query = createQuery(dataset);
  if (await ask(query)) {
    reporter.info("sparql.group", "specification.has-description");
  } else {
    reporter.error("sparql.group", "specification.missing-description");
  }
};

export default validator;

const createQuery = (dataset: string) => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dcterms: <http://purl.org/dc/terms/>

ASK {
  <${dataset}> a dcat:Dataset ;
    dcterms:description ?description .
  FILTER(langMatches(LANG(?description), "cs"))
}`;
