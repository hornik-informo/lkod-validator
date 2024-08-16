import React from "react";

import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { Report } from "../validator-service";

export function LevelIcon({ level }: { level: Report.Level }) {
  switch (level) {
    case Report.Level.SUCCESS:
      return (
        <Tooltip placement="left" title={""} arrow>
          <InfoOutlinedIcon sx={{ color: "green" }} />
        </Tooltip>
      );
    case Report.Level.INFO:
      return (
        <Tooltip placement="left" title={""} arrow>
          <InfoOutlinedIcon sx={{ color: "blue" }} />
        </Tooltip>
      );
    case Report.Level.WARNING:
      return (
        <Tooltip placement="left" title={""} arrow>
          <WarningAmberOutlinedIcon sx={{ color: "yellow" }} />
        </Tooltip>
      );
    case Report.Level.ERROR:
    case Report.Level.CRITICAL:
      return (
        <Tooltip placement="left" title={""} arrow>
          <ErrorOutlineIcon sx={{ color: "red" }} />
        </Tooltip>
      );
  }
}
