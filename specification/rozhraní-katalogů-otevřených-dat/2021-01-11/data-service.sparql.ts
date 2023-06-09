import { DistributionSparqlValidator } from "../../specification";

const validator: DistributionSparqlValidator = async ({
  distribution,
  ask,
  select,
  reporter,
}) => {
  const selectResult = await select(createDataService(distribution));
  if (selectResult.length === 0) {
    // It is not a DataService.
    return;
  }
  const dataService = selectResult[0].entries.get("accessService").value;
  if (!(await ask(createCheckTitle(dataService)))) {
    reporter.warning(
      "sparql.group",
      "specification.data-service.missing-title",
      {
        distribution,
      }
    );
  }
  if (!(await ask(createCheckEndpointURL(dataService)))) {
    reporter.error(
      "sparql.group",
      "specification.data-service.missing-endpoint-url",
      {
        distribution,
      }
    );
  }
};

export default validator;

const createDataService = (distribution: string) => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>

SELECT ?accessService WHERE {
  <${distribution}> a dcat:Distribution ;
    dcat:accessService ?accessService .
}`;

const createCheckTitle = (dataService: string) => `
PREFIX dcterms: <http://purl.org/dc/terms/>

ASK {
  <${dataService}> dcterms:title ?title .
  FILTER(langMatches(LANG(?title), "cs"))
}`;

const createCheckEndpointURL = (dataService: string) => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>

ASK {
  <${dataService}> dcat:endpointURL ?urlEndpointu .
}`;
