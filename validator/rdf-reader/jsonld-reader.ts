import {toRDF} from "jsonld";
import * as RDF from "@rdfjs/types";

export async function jsonLdToRdf(document:any) : Promise<RDF.Quad[]> {
  return await toRDF(document) as RDF.Quad[];
}
