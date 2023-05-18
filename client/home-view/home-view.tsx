import React from "react";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Fade from "@mui/material/Fade";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from '@mui/material/Tooltip';
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import TopicIcon from '@mui/icons-material/Topic';
import FolderIcon from '@mui/icons-material/Folder';
import LinkIcon from '@mui/icons-material/Link';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { useHomeController, MessageGroup } from "./home-controller";
import {ResourceType, Level} from "../../validator";

const GROUP_TO_LABEL = {
  [ResourceType.URL]: "Entry point",
  [ResourceType.CATALOG]: "Catalog",
  [ResourceType.DATASET]: "Dataset",
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
  [Level.INFO]: "Info",
  [Level.WARNING]: "Warning",
  [Level.ERROR]: "Error",
  [Level.CRITICAL]: "Critical",
}

const MESSAGE_LEVEL_TO_ICON = {
  [Level.INFO]: InfoOutlinedIcon,
  [Level.WARNING]: WarningAmberOutlinedIcon,
  [Level.ERROR]: ErrorOutlineIcon,
  [Level.CRITICAL]: ErrorOutlineIcon,
}

export function HomeView() {
  const { t } = useTranslation();

  const { state, onChangeUrl, onSubmit, onToggle } = useHomeController();

  return (
    <div>
      <h1>{t("title")}</h1>
      <LoaderIndicator show={state.working} />
      <br />
      <div>
        <TextField
          id="resource-url"
          label={t("resource-url")}
          variant="standard"
          value={state.url}
          onChange={onChangeUrl}
          fullWidth
        />
        <br /> <br />
        <Button variant="outlined" onClick={onSubmit} disabled={state.working}>
          {t("submit")}
        </Button>
      </div>
      <br />
      <hr />
      <br />
      {state.statusMessage}
      <br />
      <List>
        {state.groups.map(
          ({ resource, messages, open, level }: MessageGroup, index) => (
            <React.Fragment key={resource.type + resource.url}>
              <ListItem>
                <GroupIcon type={resource.type} level={level}/>
                <ListItemText
                  primary={GROUP_TO_LABEL[resource.type]}
                  secondary={resource.url}
                />
                <div onClick={() => onToggle(index)}>
                  {open ? <ExpandLess/> : <ExpandMore/>}
                </div>
              </ListItem>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {messages.map((message, index) => (
                    <ListItem key={index} sx={{ pl: 4 }}>
                      <MessageIcon level={message.level}/>
                      <ListItemText
                        primary={message.message}
                        secondary={`Validator : ${message.validator}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          )
        )}
      </List>
    </div>
  );
}

function LoaderIndicator({ show }: { show: boolean }) {
  return (
    <Fade in={show} style={{ transitionDelay: show ? "800ms" : "0ms" }}>
      <LinearProgress />
    </Fade>
  );
}

function GroupIcon({type, level}) {
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

function MessageIcon({level}) {
  const Icon = MESSAGE_LEVEL_TO_ICON[level];
  const color = LEVEL_TO_COLOR[level];
  const label = LEVEL_TO_LABEL[level];
  return (
    <ListItemIcon>
      <Tooltip placement="left" title={label} arrow>
        <Icon sx={{"color": color}}/>
      </Tooltip>
    </ListItemIcon>
  );
}
