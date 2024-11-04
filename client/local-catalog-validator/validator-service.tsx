import { useState } from "react";

export * as Report from "../../local-catalog-validator/local-catalog-validator-model";
export { ContentType } from "../../service/content-type";

import * as Model from "../../local-catalog-validator/local-catalog-validator-model";
import { createLocalCatalogReport } from "../../local-catalog-validator/local-catalog-validator";
import {
  loadSchemasToJsonSchemaService,
  LocalCatalogLoader,
} from "../../local-catalog-validator/local-catalog-loader";

import { createFetchService } from "../../service/fetch";
import { createJsonSchemaService } from "../../service/json-schema";
import { createConsoleLogger } from "../../service/logger";

interface State {
  /**
   * URL of latest validation.
   */
  url: string | null;
  /**
   * Loading and processing is active.
   */
  working: boolean;
  /**
   * Set to true once validation is finished.
   */
  completed: boolean;
  /**
   * Status message.
   */
  statusMessage: string;
  /**
   * Arguments for status message.
   */
  statusArgs: object | undefined;
  /**
   * Validation report;
   */
  report: UiLocalCatalogReport | null;
  /**
   * Total number of dataset resources to process.
   */
  progressTotal: number | null;
  /**
   * Number of processed dataset resources.
   */
  progressActual: number | null;
}

export interface UiLocalCatalogReport extends Model.LocalCatalogReport {

  datasets: UiDatasetReference[];

}

export interface UiDatasetReference extends Model.DatasetReference {

  datasets: UiDataset[];

}

export interface UiDataset extends Model.Dataset {

  /**
   * Issues related to datasets and distributions.
   * We use this to optimize rendering.
   */
  allIssues: Model.Issue[];

}

interface ValidatorServiceType extends State {
  validate: (url: string) => void;
}

const fetchService = createFetchService();

const jsonSchemaService = createJsonSchemaService();
loadSchemasToJsonSchemaService(jsonSchemaService);

export function useValidatorServiceType(): ValidatorServiceType {
  const [state, setState] = useState<State>({
    url: null,
    working: false,
    completed: false,
    statusMessage: "",
    statusArgs: undefined,
    report: null,
    progressTotal: null,
    progressActual: null,
  });

  const validate = (url: string): void => {
    if (state.working === true) {
      return;
    }
    setState({
      url: url,
      working: true,
      completed: false,
      statusMessage: "",
      statusArgs: undefined,
      report: null,
      progressTotal: null,
      progressActual: null,
    });

    const consoleLogger = createConsoleLogger();
    const logger = {
      info: (message: string, args?: object) => {
        consoleLogger.info(message, args);
        setState(previous => {
          if (previous.url === url) {
            return {
              ...previous,
              statusMessage: message,
              statusArgs: args,
            };
          } else {
            return previous;
          }
        });
      },
      startProcessing(total: number): void {
        setState(previous => ({ ...previous, progressTotal: total }));
        consoleLogger.startProcessing(total);
      },
      updateProcessing(actual: number): void {
        setState(previous => ({ ...previous, progressActual: actual }));
        consoleLogger.updateProcessing(actual);
      },
      endProcessing(): void {
        setState(previous => ({ ...previous, progressTotal: null }));
        consoleLogger.endProcessing();
      },
    };

    const loader = new LocalCatalogLoader(
      fetchService,
      jsonSchemaService,
      logger,
    );

    loader
      .load(url)
      .then(localCatalog => {
        const rawReport = createLocalCatalogReport(localCatalog);
        const report = adoptLocalCatalogReport(rawReport);

        consoleLogger.info("Validation report is ready.", {
          "catalog": localCatalog,
          "raw-report": rawReport,
          "report": report });

        setState(previous => {
          if (previous.url === url) {
            // Update state.
            return {
              ...previous,
              working: false,
              completed: true,
              statusMessage: "",
              report,
            };
          } else {
            // We got outdated validation report.
            return previous;
          }
        });
      })
      .catch(error => {
        setState(previous => {
          if (previous.url === url) {
            // Update state.
            return {
              ...previous,
              working: false,
              completed: true,
              statusMessage: "ui.validation-failed-{error}",
              statusArgs: { error },
            };
          } else {
            // We got outdated validation report.
            return previous;
          }
        });
      });
  };

  return {
    ...state,
    validate,
  };
}

/**
 * In the Model.LocalCatalogReport issues are stored on per entity basis.
 * Yet as we render dataset we need to move issues from  distributions to datasets.
 */
function adoptLocalCatalogReport(report: Model.LocalCatalogReport) : UiLocalCatalogReport {
  return {
    ...report,
    datasets: report.datasets.map(datasetReference => ({
      ...datasetReference,
      datasets: datasetReference.datasets.map((dataset) => {
        let allIssues = dataset.issues;
        for (const distribution of dataset.distributions) {
          allIssues = [...allIssues, ...distribution.issues];
        }
        return {
          ...dataset,
          allIssues,
        }
      }),
    })),
  };
}
