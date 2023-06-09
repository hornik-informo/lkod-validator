import { DistributionSparqlValidator } from "../../specification";

const validator: DistributionSparqlValidator = async ({
  distribution,
  ask,
  reporter,
}) => {
  const query = createQuery(distribution);
  if (await ask(query)) {
    // We are silent when all is alright, otherwise there would be a lot of
    // messages.
  } else {
    reporter.error("sparql.group", "missing.access-url", {
      distribution,
    });
  }
};

export default validator;

const createQuery = (distribution: string) => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>

ASK {
  <${distribution}> a dcat:Distribution ;
    dcat:accessURL ?přístupovéURL .
}`;
