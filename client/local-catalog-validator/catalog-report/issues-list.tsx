import React from "react";

import { useTranslation } from "react-i18next";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { LevelIcon } from "./level-icon";
import { Report } from "../validator-service";

export function IssuesList({ issues }: { issues: Report.Issue[] }) {
  if (issues.length === 0) {
    return null;
  }
  return (
    <List disablePadding>
      {issues.map((issue, index) => (
        <IssueListItem key={index} issue={issue} />
      ))}
    </List>
  );
}

function IssueListItem({ issue }: { issue: Report.Issue }) {
  const { t } = useTranslation();
  // This is not a good solution, but we just need it to be
  // compatible with use in React bellow.
  const content = t(issue.payload, issue.args) as string;
  return (
    <ListItem sx={{ pl: 4 }}>
      <ListItemIcon>
        <LevelIcon level={issue.level} />
      </ListItemIcon>
      <ListItemText>
        {content}
      </ListItemText>
    </ListItem>
  );
}
