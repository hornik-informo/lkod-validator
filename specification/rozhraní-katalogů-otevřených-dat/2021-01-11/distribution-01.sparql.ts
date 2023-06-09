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
    reporter.error("sparql.group", "specification.missing-terms-of-use", {
      distribution,
    });
  }
};

export default validator;

const createQuery = (distribution: string) => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX pu: <https://data.gov.cz/slovník/podmínky-užití/>

ASK {
  <${distribution}> a dcat:Distribution ;
    pu:specifikace ?podmínky .
    
  ?podmínky a pu:Specifikace ;
    pu:autorské-dílo [] ;
    pu:databáze-jako-autorské-dílo [] ;
    pu:databáze-chráněná-zvláštními-právy [] ;
    pu:osobní-údaje [] .
}`;
