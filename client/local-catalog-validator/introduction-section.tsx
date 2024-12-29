import React from "react";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";

/**
 * This section provide user with information and instruction about using this application.
 */
export function IntroductionSection() {
  return (
    <Box sx={{ mb: "1rem" }}>
      <Trans i18nKey="ui.introduction">
        Dummy text node here to make i18n work, it should not be visible to a
        user ...
        <a
          href="https://htmlpreview.github.io/?https://github.com/slovak-egov/centralny-model-udajov/blob/develop/tbox/national/dcat-ap-sk/index.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          OFN
        </a>
        <a
          href="https://data.slovensko.sk/lokalne-katalogy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Local Data Catalogs
        </a>
        <a
          href="https://opendata.gov.cz/špatná-praxe:chybějící-cors"
          target="_blank"
          rel="noopener noreferrer"
        >
          CORS
        </a>
      </Trans>
    </Box>
  );
}
