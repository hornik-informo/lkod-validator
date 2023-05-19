import {DatasetSparqlValidator} from "../../specification";

const validator: DatasetSparqlValidator = async ({dataset, ask, reporter}) => {
  const query = createQuery(dataset);
  if (await ask(query)) {
    reporter.info("sparql.group", "specification.has-theme");
  } else {
    reporter.warning("sparql.group", "specification.missing-theme");
  }
};

export default validator;

const createQuery = (dataset: string) => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dcterms: <http://purl.org/dc/terms/>

ASK {
  <${dataset}> a dcat:Dataset ;
    dcat:theme ?téma .
  FILTER(STRSTARTS(STR(?téma), "http://publications.europa.eu/resource/authority/data-theme/"))
}`;
