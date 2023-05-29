import React, {useEffect, useState} from "react";
import List from "@mui/material/List";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import Pagination from '@mui/material/Pagination';

import { MessageGroup } from "./message-service";
import { MessageListGroup } from "./message-list-group";
import { Level } from "../../validator";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 12;

export const MessageList = ({ groups }: { groups: MessageGroup[] }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState(Level.INFO);
  const [page, setPage] = useState(1);
  const onChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const [state, setState] = useState<{pageCount:number, items: JSX.Element[]}>({"pageCount": 1, "items": []});
  useEffect(() => {
    const filteredItems = groups
      .filter(item => item.level >= filter)
      .map(item => (
        <MessageListGroup
          key={item.resource.type + item.resource.url}
          group={item}
          levelThreshold={filter}
        />
      ));
    setState({
      "pageCount": Math.ceil(filteredItems.length / PAGE_SIZE),
      "items": filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    });
  }, [groups, filter, page, setState])
  return (
    <>
      <Filter value={filter} onUpdateValue={setFilter} />
      <List>{selectContent(t, groups, state.items)}</List>
      <Pagination count={state.pageCount} variant="outlined" page={page} onChange={onChangePage} />
    </>
  );
};

function selectContent(t, groups: MessageGroup[], items: JSX.Element[]) {
  if (groups.length === 0) {
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
