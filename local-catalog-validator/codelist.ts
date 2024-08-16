
/**
 * @param iri
 * @returns True if given IRI is using OVM prefix.
 */
export const isPublisherOvm = (iri: string) => iri.startsWith("https://rpp-opendata.egon.gov.cz/odrpp/zdroj/orgán-veřejné-moci/");

/**
 * @param iri
 * @returns True if theme with given IRI is part of Eurovoc.
 */
export const isEurovocTheme = (iri: string) => iri.startsWith("http://publications.europa.eu/resource/authority/data-theme/");

/**
 * @param iri
 * @returns True when given IRI is from codelist based on the prefix.
 */
export const isFromAccrualPeriodicityCodelist = (iri: string) => iri.startsWith("http://publications.europa.eu/resource/authority/frequency/");

/**
 * @param iri
 * @returns True when given IRI is from RUAIN codelist based on the prefix.
 */
export const isFromRuianCodelist = (iri: string) => iri.startsWith("https://linked.cuzk.cz/resource/ruian/");

/**
 * @param iri
 * @returns True when given IRI is from IANA media-type codelist based on the prefix.
 */
export const isFromMediaTypeCodelist = (iri: string) => iri.startsWith("http://www.iana.org/assignments/media-types/");

/**
 * @param iri
 * @returns True when given IRI is from European file-type codelist based on the prefix.
 */
export const isFromFormatCodelist = (iri: string) => iri.startsWith("http://publications.europa.eu/resource/authority/file-type/");

/**
 * @param iri
 * @returns True when IRI of applicable legislation indicates high value dataset.
 */
export const isApplicableLegislationHvd = (iri: string) => "http://data.europa.eu/eli/reg_impl/2023/138/oj" === iri;

const HVD_TOP_CATEGORY: { [iri: string]: string } = {
  "http://data.europa.eu/bna/c_164e0bf5": "Meteorologie",
  "http://data.europa.eu/bna/c_a9135398": "Společnosti a vlastnictví společností",
  "http://data.europa.eu/bna/c_ac64a52d": "Geoprostorové údaje",
  "http://data.europa.eu/bna/c_b79e35eb": "Mobilita",
  "http://data.europa.eu/bna/c_dd313021": "Země a životní prostředí",
  "http://data.europa.eu/bna/c_e1da4e07": "Statistika",
};

/**
 * @param iri
 * @returns True when given HVD category is a top category.
 */
export const isTopHvdCategory = (iri: string) => HVD_TOP_CATEGORY[iri] !== undefined;
