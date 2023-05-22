import { DatasetSparqlValidator } from "../../specification";

const validator: DatasetSparqlValidator = async ({
  dataset,
  ask,
  reporter,
}) => {
  const query = createQuery(dataset);
  if (await ask(query)) {
    reporter.info("sparql.group", "specification.has-title");
  } else {
    reporter.error("sparql.group", "specification.missing-title");
  }
};

export default validator;

const createQuery = (dataset: string) => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
ASK {
  <${dataset}> a dcat:Dataset ;
    dcterms:title ?title .
  FILTER(langMatches(LANG(?title), "cs"))
}`;
