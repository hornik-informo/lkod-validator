import {DatasetSparqlValidator} from "../../specification";

const validator: DatasetSparqlValidator = async ({dataset, ask, reporter}) => {
  const query = createQuery(dataset);
  if (await ask(query)) {
    reporter.info("SPARQL", "Datová sada má územní pokrytí aktualizace.");
  } else {
    reporter.warning("SPARQL", "Datová sada nemá územní pokrytí z požadovaného slovníku.");
  }
};

export default validator;

const createQuery = (dataset: string) => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dcterms: <http://purl.org/dc/terms/>

ASK {
  <${dataset}> a dcat:Dataset ;
    dcterms:spatial ?uzemní_pokrytí .
  FILTER(STRSTARTS(STR(?uzemní_pokrytí), "https://linked.cuzk.cz/resource/ruian/"))
}`;
