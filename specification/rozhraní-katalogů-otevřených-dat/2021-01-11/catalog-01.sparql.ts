import {CatalogSparqlValidator} from "../../specification";

const validator: CatalogSparqlValidator = async ({ask, reporter}) => {
  const query = createQuery();
  if (await ask(query)) {
    reporter.info("SPARQL", "Je tam katalog.");
  } else {
    reporter.critical("SPARQL", "Není tam katalog.");
  }
};

export default validator;

const createQuery = () => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
ASK {
  [] a dcat:Catalog
}`;
