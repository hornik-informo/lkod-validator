import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";

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
  const [simpleMode, setSimpleMode] = useState(true);
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
      {renderSwitch(t, simpleMode, setSimpleMode)}
      {renderContent(
        simpleMode,
        state.working || state.completed,
        summaryService,
        messageService
      )}
    </>
  );
}

function renderSwitch(t, value, onChange) {
  return (
    <FormGroup>
      <FormControlLabel
        control={<Switch checked={value} onChange={() => onChange(!value)} />}
        label={t("home-view.show-simplified")}
      />
    </FormGroup>
  );
}

function renderContent(
  simpleView: boolean,
  ready: boolean,
  summaryService,
  messageService
) {
  if (!ready) {
    return (
      <Box display="flex" sx={{ justifyContent: "center" }}>
        <br />
        Výsledky se zde zobrazí po spuštění validace.
      </Box>
    );
  }
  if (simpleView) {
    return (
      <Summary
        catalog={summaryService.state.catalog}
        datasets={summaryService.state.datasets}
        entrypoint={summaryService.state.entrypoint}
      />
    );
  } else {
    return <MessageList groups={messageService.state.groups} />;
  }
}
