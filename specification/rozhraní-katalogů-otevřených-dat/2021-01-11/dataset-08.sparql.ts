import {DatasetSparqlValidator} from "../../specification";

const validator: DatasetSparqlValidator = async ({dataset, ask, reporter}) => {
  const query = createQuery(dataset);
  if (await ask(query)) {
    reporter.info("SPARQL", "Datová sada má periodicitu aktualizace.");
  } else {
    reporter.warning("SPARQL", "Datová sada nemá periodicitu aktualizace z požadovaného slovníku.");
  }
};

export default validator;

const createQuery = (dataset: string) => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dcterms: <http://purl.org/dc/terms/>

ASK {
  <${dataset}> a dcat:Dataset ;
    dcterms:accrualPeriodicity ?periodicita .
  FILTER(STRSTARTS(STR(?periodicita), "http://publications.europa.eu/resource/authority/frequency/"))
}`;
