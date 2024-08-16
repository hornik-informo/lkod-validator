import React from "react";

import { useTranslation } from "react-i18next";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { Report } from "../validator-service";

export function CanNotConvertToRdf(props: {
  report: Report.LocalCatalogReport;
}) {
  const { t } = useTranslation();

  return (
    <div style={{ display: "flex", gap: "1em" }}>
      <ErrorOutlineIcon sx={{ color: "red" }} />
      <div>
        <div>{t("ui.can-not-convert-to-rdf-summary")}</div>
        <div>{t("ui.can-not-convert-to-rdf-suggestion")}</div>
      </div>
    </div>
  );
}
