import { ContentTypeHeader } from "./download-resource";
import { ResourceContentType } from "../validator-api";

const TURTLE_TYPES = ["text/turtle"];

const JSONLD_TYPES = ["application/json", "application/ld+json"];

const TURTLE_EXTENSIONS = ["ttl"];

const JSONLD_EXTENSIONS = ["json", "jsonld"];

export function detectContentType(contentTypeHeader: string): {
  type: ResourceContentType | null;
  contentType: string;
} {
  const contentType = parseContentType(contentTypeHeader).type;
  if (TURTLE_TYPES.includes(contentType)) {
    return { type: ResourceContentType.TURTLE, contentType };
  } else if (JSONLD_TYPES.includes(contentType)) {
    return { type: ResourceContentType.JSONLD, contentType };
  } else {
    return { type: null, contentType };
  }
}

function parseContentType(contentTypeHeader: string): ContentTypeHeader {
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

export function detectContentTypeFromUrl(
  url: string
): ResourceContentType | null {
  const extension = getExtension(url);
  if (TURTLE_EXTENSIONS.includes(extension)) {
    return ResourceContentType.TURTLE;
  } else if (JSONLD_EXTENSIONS.includes(extension)) {
    return ResourceContentType.JSONLD;
  } else {
    return null;
  }
}

function getExtension(url: string): string {
  return url.substr(url.lastIndexOf(".") + 1).toLowerCase();
}
