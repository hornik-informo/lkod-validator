import {CatalogSparqlValidator} from "../../specification";

const validator: CatalogSparqlValidator = async ({ask, reporter}) => {
  const query = createQuery();
  if (await ask(query)) {
    reporter.info("SPARQL", "V katalogu je odkaz na nějaký dataset.");
  } else {
    reporter.error("SPARQL", "V katalogu není odkaz na nějaký dataset.");
  }
};

export default validator;

const createQuery = () => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
ASK {
  [] a dcat:Catalog ;
    dcat:dataset [] .
}`;
