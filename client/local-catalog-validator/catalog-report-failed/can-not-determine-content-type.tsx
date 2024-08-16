import React from "react";

import { useTranslation } from "react-i18next";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { Report } from "../validator-service";

export function CanNotDetermineContentType({ report }: { report: Report.LocalCatalogReport }) {
  const { t } = useTranslation();

  let content: React.ReactNode = null;
  if (report.loadingFailure?.headerContentType === null) {
    // We did not even get a status code, so probably an issue with CORS.
    content = (
      <div>
        <div>{t("ui.can-not-determine-content-type-no-status-summary")}</div>
        <div>{t("ui.can-not-determine-content-type-no-status-suggestion")}</div>
      </div>
    );
  } else {
    // We get a status code and perhaps even content-type.
    content = (
      <div>
        <div>{t("ui.can-not-determine-content-type-status-summary")}</div>
        <div>{t("ui.can-not-determine-content-type-status-suggestion-{status-code}-{content-type}", {
          "status-code": report.loadingFailure?.contentTypeStatusCode,
          "content-type": report.loadingFailure?.headerContentType ?? "",
        })}</div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: "1em" }}>
      <ErrorOutlineIcon sx={{ color: "red" }} />
      {content}
    </div>
  );
}

