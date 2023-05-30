import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import LinkIcon from "@mui/icons-material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FolderIcon from "@mui/icons-material/Folder";
import TopicIcon from "@mui/icons-material/Topic";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import Box from "@mui/material/Box";

import { Level, ResourceType } from "../../validator";
import { MessageGroup } from "./message-service";
import { LEVEL_TO_COLOR } from "./well-known";
import { MessageListItem } from "./message-list-item";

const GROUP_TO_LABEL = {
  [ResourceType.URL]: "home-view.entry-point",
  [ResourceType.CATALOG]: "home-view.catalog",
  [ResourceType.DATASET]: "home-view.dataset",
};

const GROUP_TO_ICON = {
  [ResourceType.URL]: LinkIcon,
  [ResourceType.CATALOG]: FolderIcon,
  [ResourceType.DATASET]: TopicIcon,
};

export function MessageListGroup({
  group,
  levelThreshold,
}: {
  group: MessageGroup;
  levelThreshold: Level;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { resource, messages } = group;
  return (
    <React.Fragment key={resource.type + resource.url}>
      <ListItem>
        <GroupIcon type={resource.type} level={group.level} />
        <ListItemText
          primary={t(GROUP_TO_LABEL[resource.type])}
          secondary={resource.url}
        />
        <Box sx={{ mr: "1rem" }}>
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            <OpenInNewIcon />
          </a>
        </Box>
        <Box onClick={() => setOpen(!open)}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </Box>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {messages
            .filter(messages => messages.level >= levelThreshold)
            .map((message, index) => (
              <MessageListItem key={index} message={message} />
            ))}
        </List>
      </Collapse>
    </React.Fragment>
  );
}

function GroupIcon({ type, level }: { type: string; level: Level }) {
  const Icon = GROUP_TO_ICON[type];
  const color = LEVEL_TO_COLOR[level];
  if (Icon == undefined) {
    return null;
  } else {
    return (
      <ListItemIcon>
        <Icon sx={{ color: color }} />
      </ListItemIcon>
    );
  }
}
