import jsonld from "jsonld";
import * as RDF from "@rdfjs/types";
import N3 from "n3";

export async function jsonLdToRdf(document: any): Promise<RDF.Quad[]> {
  return (await jsonld.toRDF(document)) as RDF.Quad[];
}

export function stringN3ToRdf(
  document: string,
  format: N3.BaseFormat,
): Promise<RDF.Quad[]> {
  return new Promise((accept, reject) => {
    const parser = new N3.Parser({ format });
    const collector: N3.Quad[] = [];
    parser.parse(document, (error, quad, prefixes) => {
      if (quad === null) {
        accept(collector);
      } else if (error) {
        reject(error);
      } else {
        collector.push(quad);
      }
    });
  });
}

export function streamN3ToRdf(
  document: ReadableStreamDefaultReader,
  format: N3.BaseFormat,
): Promise<RDF.Quad[]> {
  const collector: N3.Quad[] = [];
  return new Promise((accept, reject) => {
    const parser = new N3StreamReader(
      { format },
      {
        onQuad: quad => collector.push(quad),
        onError: error => reject(error),
      },
    );
    parser
      .parse(document)
      .then(() => accept(collector))
      .catch(error => reject(error));
  });
}

interface Handler {
  onQuad(quad: N3.Quad): void;

  onError(error: Error): void;
}

class N3StreamReader {
  protected readonly parser: N3.Parser;

  protected readonly handler: Handler;

  protected readonly decoder = new TextDecoder("utf-8");

  /**
   * Parser callback for when data ara available.
   */
  protected onData?: (data: string) => void;

  /**
   * Parser callback for end of the data.
   */
  protected onEnd?: () => void;

  constructor(options: N3.ParserOptions, collector: Handler) {
    this.parser = new N3.Parser(options);
    this.handler = collector;
    this.initializeParser();
  }

  protected initializeParser() {
    const source = this.createCaptureSource();

    const callback: N3.ParseCallback<N3.Quad> = (
      error: Error,
      quad: N3.Quad,
      prefixes: N3.Prefixes,
    ) => {
      if (error) {
        this.handler.onError(error);
      }
      if (quad) {
        this.handler.onQuad(quad);
      }
    };

    // Trigger parser to register callbacks.
    this.parser.parse(source as any, callback);
  }

  /**
   * Create and return source that only captures callbacks.
   */
  protected createCaptureSource() {
    return {
      on: (event, callback) => {
        switch (event) {
          case "data":
            this.onData = callback;
            break;
          case "end":
            this.onEnd = callback;
            break;
          case "error":
            // We do not need to capture error callback.
            break;
        }
      },
    };
  }

  public async parse(reader: ReadableStreamDefaultReader): Promise<void> {
    let readResult = await reader.read();
    while (!readResult.done) {
      const decoded = this.decoder.decode(readResult.value);
      this.onData?.(decoded);
      readResult = await reader.read();
    }
    this.onEnd?.();
  }
}
