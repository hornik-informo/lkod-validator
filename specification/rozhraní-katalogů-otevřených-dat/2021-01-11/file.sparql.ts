import { DistributionSparqlValidator } from "../../specification";

const validator: DistributionSparqlValidator = async ({
  distribution,
  ask,
  select,
  reporter,
}) => {
  const selectResult = await select(createSelectDownloadUrl(distribution));
  if (selectResult.length === 0) {
    // It is not file distribution.
    return;
  }
  if (!(await ask(createCheckMediaType(distribution)))) {
    reporter.error("sparql.group", "specification.invalid-media-type", {
      distribution,
    });
  }
  if (!(await ask(createCheckFormat(distribution)))) {
    reporter.error("sparql.group", "specification.invalid-format", {
      distribution,
    });
  }
};

export default validator;

const createSelectDownloadUrl = (distribution: string) => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>

SELECT ?downloadURL WHERE {
  <${distribution}> a dcat:Distribution ;
    dcat:downloadURL ?downloadURL .
}`;

const createCheckMediaType = (distribution: string) => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>

ASK {
  <${distribution}> dcat:mediaType ?mediaType .
  
  FILTER(STRSTARTS(STR(?mediaType), "http://www.iana.org/assignments/media-types/"))
}`;

const createCheckFormat = (distribution: string) => `
PREFIX dcat: <http://www.w3.org/ns/dcat#>

ASK {
  <${distribution}> dcterms:format ?format .
  
  FILTER(STRSTARTS(STR(?format), "http://publications.europa.eu/resource/authority/file-type/"))
}`;
