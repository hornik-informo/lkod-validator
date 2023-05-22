import React, { useState } from "react";
import List from "@mui/material/List";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";

import { MessageGroup } from "./message-service";
import { MessageListGroup } from "./message-list-group";
import { Level } from "../../validator";
import { useTranslation } from "react-i18next";

export const MessageList = ({
  groups,
  ready,
}: {
  groups: MessageGroup[];
  ready: boolean;
}) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState(Level.INFO);
  const visibleItems = groups
    .filter(item => item.level >= filter)
    .map(item => (
      <MessageListGroup
        key={item.resource.type + item.resource.url}
        group={item}
        levelThreshold={filter}
      />
    ));
  return (
    <>
      <Filter value={filter} onUpdateValue={setFilter} />
      <List>{selectContent(t, ready, groups, visibleItems)}</List>
    </>
  );
};

function selectContent(
  t,
  ready: boolean,
  groups: MessageGroup[],
  items: JSX.Element[]
) {
  if (!ready) {
    return <>{t("home-view.no-groups")}</>;
  } else if (items.length > 0) {
    return items;
  } else {
    return <>{t("home-view.all-is-hidden")}</>;
  }
}

function Filter({
  value,
  onUpdateValue,
}: {
  value: Level;
  onUpdateValue: (value: Level) => void;
}) {
  const { t } = useTranslation();
  return (
    <div style={{ display: "flex", justifyContent: "end" }}>
      <FormControl sx={{ minWidth: 300 }}>
        <InputLabel variant="standard" htmlFor="filter-selector">
          {t("home-view.level-filter")}
        </InputLabel>
        <NativeSelect
          inputProps={{
            id: "filter-selector",
          }}
          value={value}
          onChange={event => onUpdateValue(Number(event.target.value))}
        >
          <option value={Level.INFO}>{t("home-view.info")}</option>
          <option value={Level.WARNING}>{t("home-view.warning")}</option>
          <option value={Level.ERROR}>{t("home-view.error")}</option>
          <option value={Level.CRITICAL}>{t("home-view.critical")}</option>
        </NativeSelect>
      </FormControl>
    </div>
  );
}
