import N3 from "n3";
import * as RDF from "@rdfjs/types";

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
  protected onData: (data: string) => void;

  /**
   * Parser callback for end of the data.
   */
  protected onEnd: () => void;

  constructor(options: N3.ParserOptions, collector: Handler) {
    this.parser = new N3.Parser(options);
    this.handler = collector;
    this.initializeParser();
  }

  protected initializeParser() {
    const source = this.createCaptureSource();
    // Trigger parser to register callbacks.
    this.parser.parse(
      // The types do not match here, the source may not be a string.
      source as unknown as any,
      // Register callback to collect statements.
      (error: Error, quad: N3.Quad) => {
        if (error) {
          this.handler.onError(error);
        }
        if (quad) {
          this.handler.onQuad(quad);
        }
      },
      (prefix: string, uri: N3.NamedNode) => {
        // No action here.
      }
    );
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
      this.onData(decoded);
      readResult = await reader.read();
    }
    this.onEnd();
  }
}

export function stringN3ToRdf(
  document: string,
  format: N3.BaseFormat
): Promise<RDF.Quad[]> {
  return new Promise((accept, reject) => {
    const parser = new N3.Parser({ format });
    const collector = [];
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
  format: N3.BaseFormat
): Promise<RDF.Quad[]> {
  const collector = [];
  return new Promise((accept, reject) => {
    const parser = new N3StreamReader(
      { format },
      {
        onQuad: quad => collector.push(quad),
        onError: error => reject(error),
      }
    );
    parser
      .parse(document)
      .then(() => accept(collector))
      .catch(error => reject(error));
  });
}
