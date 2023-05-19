import React from "react";
import {useTranslation} from "react-i18next";

import {useValidatorService} from "./validator-service";
import {InputArea} from "./input-area";
import {StatusBar} from "./status-bar";
import {MessageList} from "./message-list";

export function HomeView() {
  const {t} = useTranslation();
  const {state, onBeginValidation} = useValidatorService();
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
      <MessageList
        groups={state.groups}
      />
    </>
  );
}
