import { FetchService } from "./fetch";

export interface DetextedContentType {
  /**
   * Content type as determined using standard HTTP tools.
   * Use this as the primary type.
   */
  contentType: ContentType | null;

  /**
   * Raw value of header content type if available.
   */
  rawHeaderContentType: string | null;

  /**
   * Content type determined based on URL suffix.
   */
  contentTypeFromUrl: ContentType | null;

  /**
   * Response code for non SPARQL query.
   */
  statusCode: number | null;
}

export enum ContentType {
  SPARQL = "SPARQL",
  TURTLE = "TURTLE",
  JSONLD = "JSONLD",
}

const TURTLE_TYPES = ["text/turtle"];

const TURTLE_EXTENSIONS = ["ttl"];

const JSONLD_TYPES = ["application/json", "application/ld+json"];

const JSONLD_EXTENSIONS = ["json", "jsonld"];

/**
 * Using given fetch service tries to detect content of the URL.
 * Can make a request to given URL file.
 */
export async function detectContentType(
  fetchService: FetchService,
  url: string,
): Promise<DetextedContentType> {
  const contentTypeFromUrl = detectContentTypeUsingUrlExtension(url);
  if (await isSparqlEndpoint(fetchService, url)) {
    return {
      contentType: ContentType.SPARQL,
      rawHeaderContentType: null,
      statusCode: null,
      contentTypeFromUrl,
    };
  }
  const contentType = await detectContentTypeUsingContentType(
    fetchService,
    url,
  );
  return {
    ...contentType,
    contentTypeFromUrl,
  };
}

function detectContentTypeUsingUrlExtension(url: string): ContentType | null {
  const extension = getExtension(url);
  if (TURTLE_EXTENSIONS.includes(extension)) {
    return ContentType.TURTLE;
  } else if (JSONLD_EXTENSIONS.includes(extension)) {
    return ContentType.JSONLD;
  } else {
    return null;
  }
}

function getExtension(url: string): string {
  return url.substr(url.lastIndexOf(".") + 1).toLowerCase();
}

/**
 * Test SPARQL endpoint by executing simple ASK query
 */
async function isSparqlEndpoint(
  fetchService: FetchService,
  url: string,
): Promise<boolean> {
  try {
    // We just execute simple ASK query and if we get a reponse it is a SPARQL endpoint.
    await fetchService.sparqlAsk(url, "ASK {?s ?p ?o}");
    return true;
  } catch (error) {
    return false;
  }
}

async function detectContentTypeUsingContentType(
  fetchService: FetchService,
  url: string,
): Promise<{
  contentType: ContentType | null;
  rawHeaderContentType: string | null;
  statusCode: number | null;
}> {
  const response = await fetchService.httpGet(url);
  if (response.payload === null) {
    return {
      contentType: null,
      rawHeaderContentType: null,
      statusCode: response.statusCode,
    };
  }
  const contentTypeHeader = response.payload.headers.get("content-type");
  const contentTypeFromHeader = detectContentTypeFromHeader(contentTypeHeader);
  if (contentTypeFromHeader !== null) {
    return {
      contentType: contentTypeFromHeader,
      rawHeaderContentType: contentTypeHeader,
      statusCode: response.statusCode,
    };
  }
  return {
    contentType: null,
    rawHeaderContentType: contentTypeHeader,
    statusCode: response.statusCode,
  };
}

function detectContentTypeFromHeader(
  contentTypeHeader: string | null,
): ContentType | null {
  if (contentTypeHeader === null) {
    return null;
  }
  const contentType = parseContentTypeHeader(contentTypeHeader).type;
  if (TURTLE_TYPES.includes(contentType)) {
    return ContentType.TURTLE;
  } else if (JSONLD_TYPES.includes(contentType)) {
    return ContentType.JSONLD;
  } else {
    return null;
  }
}

/**
 * "text/csv;language=cs" => {type: "text/csv", parameters: { language: "cs" }}
 */
function parseContentTypeHeader(contentTypeHeader: string): {
  type: string;
  parameters: Record<string, string>;
} {
  const tokens = contentTypeHeader.split(";").map(item => item.trim());
  const parameters = {};
  for (let index = 1; index < tokens.length; ++index) {
    const [key, value] = tokens[index].split("=", 2);
    parameters[key.trim()] = value.trim();
  }
  return {
    type: tokens[0],
    parameters: parameters,
  };
}

export async function detectContentTypeWithoutSparql(
  fetchService: FetchService,
  url: string,
): Promise<DetextedContentType> {
  const contentTypeFromUrl = detectContentTypeUsingUrlExtension(url);
  const contentType = await detectContentTypeUsingContentType(
    fetchService,
    url,
  );
  return {
    ...contentType,
    contentTypeFromUrl,
  };
}
