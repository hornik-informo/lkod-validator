import {DatasetSparqlValidator} from "../../specification";

const validator: DatasetSparqlValidator = async ({dataset, ask, reporter}) => {
  const query = createQuery(dataset);
  if (await ask(query)) {
    reporter.info("SPARQL", "Nalezena datová sada.");
  } else {
    reporter.error("SPARQL", "Nenalezena datová sada.");
  }
};

export default validator;

const createQuery = (dataset: string) => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
ASK {
  <${dataset}> a dcat:Dataset .
}`;
