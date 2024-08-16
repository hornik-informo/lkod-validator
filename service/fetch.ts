import * as RDF from "@rdfjs/types";

import { SparqlEndpointFetcher } from "fetch-sparql-endpoint";

export interface FetchService {

  sparqlAsk(endpoint: string, query: string): Promise<boolean>;

  sparqlConstruct(endpoint: string, query: string): Promise<RDF.Quad[]>

  httpGet(url: string): Promise<HttpResponse<Response>>;

  httpGetAsJson(url: string): Promise<HttpResponse<object>>;

  httpGetAsStream(url: string): Promise<HttpResponse<ReadableStream<Uint8Array>>>;

}

export interface HttpResponse<T> {

  payload: T | null;

  statusCode: number | null;

}

export const createFetchService = () => new DefaultFetchService();

class DefaultFetchService implements FetchService {

  private sparqlFetcher: SparqlEndpointFetcher;

  constructor() {
    this.sparqlFetcher = new SparqlEndpointFetcher();
  }

  async sparqlAsk(endpoint: string, query: string): Promise<boolean> {
    return await this.sparqlFetcher.fetchAsk(endpoint, query);
  }

  async sparqlConstruct(endpoint: string, query: string): Promise<RDF.Quad[]> {
    const bindingsStream = await this.sparqlFetcher.fetchTriples(endpoint, query);
    return new Promise((accept, reject) => {
      const collector: RDF.Quad[] = [];
      bindingsStream.on("data", binding => collector.push(binding));
      bindingsStream.on("end", () => accept(collector));
      bindingsStream.on("error", error => reject(error));
    });
  }

  async httpGet(url: string): Promise<HttpResponse<Response>> {
    let response: Response;
    try {
      response = await fetch(url);
    } catch (error) {
      return {
        payload: null,
        statusCode: null,
      }
    }
    if (!response.ok) {
      return {
        payload: response,
        statusCode: response.status,
      }
    }
    return {
      payload: response,
      statusCode: response.status,
    }
  }

  async httpGetAsJson(url: string): Promise<HttpResponse<object>> {
    const response = await this.httpGet(url);
    if (response.payload === null) {
      return {
        ...response,
        payload: null,
      };
    }
    let payload = null;
    try {
      payload = await response.payload.json();
    } catch (error) {

    }

    return {
      ...response,
      payload,
    }
  }

  async httpGetAsStream(url: string): Promise<HttpResponse<ReadableStream<Uint8Array>>> {
    const response = await this.httpGet(url);
    if (response.payload === null) {
      return {
        ...response,
        payload: null,
      };
    }
    return {
      ...response,
      payload: response.payload.body,
    }
  }

}
