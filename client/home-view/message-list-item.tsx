import React from "react";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";

import { Level, Message } from "../../validator";
import { useTranslation } from "react-i18next";
import {
  LEVEL_TO_COLOR,
  LEVEL_TO_LABEL,
  MESSAGE_LEVEL_TO_ICON,
} from "./well-known";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";

export function MessageListItem({ message }: { message: Message }) {
  const { t } = useTranslation();
  return (
    <ListItem sx={{ pl: 4 }}>
      <MessageIcon level={message.level} />
      <ListItemText
        primary={t(message.message, message.args)}
        secondary={t(message.validator)}
      />
    </ListItem>
  );
}

function MessageIcon({ level }: { level: Level }) {
  const { t } = useTranslation();
  const Icon = MESSAGE_LEVEL_TO_ICON[level];
  const color = LEVEL_TO_COLOR[level];
  const label = LEVEL_TO_LABEL[level];
  return (
    <ListItemIcon>
      <Tooltip placement="left" title={t(label)} arrow>
        <Icon sx={{ color: color }} />
      </Tooltip>
    </ListItemIcon>
  );
}
