import {CatalogSparqlValidator} from "../../specification";

const validator: CatalogSparqlValidator = async ({ask, reporter}) => {
  const query = createQuery();
  if (await ask(query)) {
    reporter.info("sparql.group", "specification.has-catalog");
  } else {
    reporter.critical("sparql.group", "specification.missing-catalog");
  }
};

export default validator;

const createQuery = () => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
ASK {
  [] a dcat:Catalog
}`;
