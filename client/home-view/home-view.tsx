import React, {useState, useMemo} from "react";
import {useTranslation} from "react-i18next";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';


import {useValidatorService} from "./validator-service";
import {InputArea} from "./input-area";
import {StatusBar} from "./status-bar";
import {MessageList} from "./message-list";
import {useMessageService} from "./message-service";
import {useSummaryService} from "./summary-service";
import {Summary} from "./summary";

export function HomeView() {
  const {t} = useTranslation();
  const messageService = useMessageService();
  const summaryService = useSummaryService();
  const {state, onBeginValidation} = useValidatorService([
    messageService.listener,
    summaryService.listener,
  ]);
  return (
    <>
      <h1>{t("home-view.title")}</h1>
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
        state.working || state.completed,
        summaryService,
        messageService
      )}
    </>
  );
}

function renderContent(
  ready: boolean,
  summaryService,
  messageService
) {
  const {t} = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  if (!ready) {
    return (
      <Box display="flex" sx={{justifyContent: "center"}}>
        <br/>
        Výsledky se zde zobrazí po spuštění validace.
      </Box>
    );
  }

  return (
    <>
      <Summary
        catalog={summaryService.state.catalog}
        datasets={summaryService.state.datasets}
        entrypoint={summaryService.state.entrypoint}
      />
      <br/>
      <Button variant="outlined" onClick={() => setShowDetails(!showDetails)}>
        {t(showDetails ? "home-view.hide-details" : "home-view.show-details")}
      </Button>
      { showDetails && <MessageList groups={messageService.state.groups}/> }
    </>
  );
}
