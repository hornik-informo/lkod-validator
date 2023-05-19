import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import LinkIcon from "@mui/icons-material/Link";
import FolderIcon from "@mui/icons-material/Folder";
import TopicIcon from "@mui/icons-material/Topic";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";

import {Level, ResourceType} from "../../validator";
import {MessageGroup} from "./validator-service";

const GROUP_TO_LABEL = {
  [ResourceType.URL]: "home-view.entry-point",
  [ResourceType.CATALOG]: "home-view.catalog",
  [ResourceType.DATASET]: "home-view.dataset",
}

const GROUP_TO_ICON = {
  [ResourceType.URL]: LinkIcon,
  [ResourceType.CATALOG]: FolderIcon,
  [ResourceType.DATASET]: TopicIcon,
}

const LEVEL_TO_COLOR = {
  [Level.INFO]: "green",
  [Level.WARNING]: "yellow",
  [Level.ERROR]: "red",
  [Level.CRITICAL]: "red",
}

const LEVEL_TO_LABEL = {
  [Level.INFO]: "home-view.info",
  [Level.WARNING]: "home-view.warning",
  [Level.ERROR]: "home-view.error",
  [Level.CRITICAL]: "home-view.critical",
}

const MESSAGE_LEVEL_TO_ICON = {
  [Level.INFO]: InfoOutlinedIcon,
  [Level.WARNING]: WarningAmberOutlinedIcon,
  [Level.ERROR]: ErrorOutlineIcon,
  [Level.CRITICAL]: ErrorOutlineIcon,
}

export function MessageListItem({group, levelThreshold}: {
  group: MessageGroup,
  levelThreshold: Level,
}) {
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);
  const {resource, messages} = group;
  return <React.Fragment key={resource.type + resource.url}>
    <ListItem>
      <GroupIcon type={resource.type} level={group.level}/>
      <ListItemText
        primary={t(GROUP_TO_LABEL[resource.type])}
        secondary={resource.url}
      />
      <div onClick={() => setOpen(!open)}>
        {open ? <ExpandLess/> : <ExpandMore/>}
      </div>
    </ListItem>
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {messages
          .filter(messages => messages.level >= levelThreshold)
          .map((message, index) => (
          <ListItem key={index} sx={{pl: 4}}>
            <MessageIcon level={message.level}/>
            <ListItemText
              primary={t(message.message, message.args)}
              secondary={t(message.validator)}
            />
          </ListItem>
        ))}
      </List>
    </Collapse>
  </React.Fragment>
}

function GroupIcon({type, level}: { type: string, level: Level }) {
  const Icon = GROUP_TO_ICON[type];
  const color = LEVEL_TO_COLOR[level];
  if (Icon == undefined) {
    return null;
  } else {
    return (
      <ListItemIcon>
        <Icon sx={{"color": color}}/>
      </ListItemIcon>
    );
  }
}

function MessageIcon({level}: { level: Level }) {
  const {t} = useTranslation();
  const Icon = MESSAGE_LEVEL_TO_ICON[level];
  const color = LEVEL_TO_COLOR[level];
  const label = LEVEL_TO_LABEL[level];
  return (
    <ListItemIcon>
      <Tooltip placement="left" title={t(label)} arrow>
        <Icon sx={{"color": color}}/>
      </Tooltip>
    </ListItemIcon>
  );
}
