import {DatasetSparqlValidator} from "../../specification";

const validator: DatasetSparqlValidator = async ({dataset, ask, reporter}) => {
  const query = createQuery(dataset);
  if (await ask(query)) {
    reporter.info("sparql.group", "specification.dataset-found");
  } else {
    reporter.error("sparql.group", "specification.missing-dataset");
  }
};

export default validator;

const createQuery = (dataset: string) => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
ASK {
  <${dataset}> a dcat:Dataset .
}`;
