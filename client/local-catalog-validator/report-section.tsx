import React from "react";

import Box from "@mui/material/Box";

import { UiLocalCatalogReport } from "./validator-service";
import { CanNotDetermineContentType } from "./catalog-report-failed/can-not-determine-content-type";
import { CanNotFetchData } from "./catalog-report-failed/can-not-fetch-data";
import { CanNotConvertToRdf } from "./catalog-report-failed/can-not-convert-to-rdf";
import { LocalCatalogReport } from "./catalog-report/catalog-report";

/**
 * Display results of the validation.
 */
export function ReportSection({
  report,
}: {
  report: UiLocalCatalogReport;
}) {
  let content: React.ReactNode;
  if (report.loadingFailure?.conversionToRdfFailed === true) {
    content = <CanNotConvertToRdf report={report} />;
  } else if (report.loadingFailure?.failedToFetchData === true) {
    content = <CanNotFetchData report={report} />;
  } else if (report.summary.contentType === null) {
    content = <CanNotDetermineContentType report={report} />;
  } else {
    content = <LocalCatalogReport report={report} />;
  }

  return <Box sx={{ my: "1rem" }}>{content}</Box>;
}
