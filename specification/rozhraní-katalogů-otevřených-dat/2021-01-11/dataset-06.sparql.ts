import { DatasetSparqlValidator } from "../../specification";

const validator: DatasetSparqlValidator = async ({
  dataset,
  ask,
  reporter,
}) => {
  const query = createQuery(dataset);
  if (await ask(query)) {
    reporter.info("sparql.group", "specification.has-keyword");
  } else {
    reporter.warning("sparql.group", "specification.missing-keyword");
  }
};

export default validator;

const createQuery = (dataset: string) => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dcterms: <http://purl.org/dc/terms/>

ASK {
  <${dataset}> a dcat:Dataset ;
    dcat:keyword ?keyword .
}`;
