import { useState } from "react";
import { useTranslation } from "react-i18next";

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
      <InputArea
        disabled={state.working}
        onStartValidation={onBeginValidation}
      />
      <StatusBar
        working={state.working}
        message={state.statusMessage}
        args={state.statusArgs}
      />
      <hr />
      <Summary
        catalog={summaryService.state.catalog}
        datasets={summaryService.state.datasets}
        entrypoint={summaryService.state.entrypoint}
        ready={state.working || state.completed}
      />
      <hr />
      <MessageList
        groups={messageService.state.groups}
        ready={state.working || state.completed}
      />
    </>
  );
}
