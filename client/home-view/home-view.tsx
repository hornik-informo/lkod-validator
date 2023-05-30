import React, { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { useValidatorService } from "./validator-service";
import { InputArea } from "./input-area";
import { StatusBar } from "./status-bar";
import { MessageList } from "./message-list";
import { useMessageService } from "./message-service";
import { useSummaryService } from "./summary-service";
import { Summary } from "./summary";

export function HomeView() {
  const { t } = useTranslation();
  const messageService = useMessageService();
  const summaryService = useSummaryService();
  const { state, onBeginValidation } = useValidatorService([
    messageService.listener,
    summaryService.listener,
  ]);
  return (
    <>
      <h1>{t("home-view.title")}</h1>
      <Box sx={{mb: "1rem"}}>
        <Trans i18nKey="home-view.introduction">
          Dummy text node here to make i18n work ...
          <a href="https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/2021-01-11/" target="_blank" rel="noopener noreferrer">OFN</a>
          <a href="https://data.gov.cz/lokální-katalogy" target="_blank" rel="noopener noreferrer">Local Data Catalogs</a>
          <a href="https://opendata.gov.cz/špatná-praxe:chybějící-cors" target="_blank" rel="noopener noreferrer">CORS</a>
        </Trans>
      </Box>
      <InputArea
        disabled={state.working}
        onStartValidation={onBeginValidation}
      />
      <StatusBar
        working={state.working}
        message={state.statusMessage}
        args={state.statusArgs}
      />
      {renderContent(
        state.working,
        state.completed,
        summaryService,
        messageService
      )}
    </>
  );
}

function renderContent(
  working: boolean,
  completed: boolean,
  summaryService,
  messageService
) {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  if (!working && !completed) {
    return (
      <Box display="flex" sx={{ justifyContent: "center" }}>
        {t("home-view.waiting-for-validation-to-start")}
      </Box>
    );
  }
  return (
    <Box>
      <Box sx={{ mb: "2rem" }}>
        <Summary
          catalog={summaryService.state.catalog}
          datasets={summaryService.state.datasets}
          entrypoint={summaryService.state.entrypoint}
          completed={completed}
        />
      </Box>
      <Button variant="outlined" onClick={() => setShowDetails(!showDetails)}>
        {t(showDetails ? "home-view.hide-details" : "home-view.show-details")}
      </Button>
      {showDetails && <MessageList groups={messageService.state.groups} />}
    </Box>
  );
}
