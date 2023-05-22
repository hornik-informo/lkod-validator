import { Level } from "../../validator";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export const LEVEL_TO_COLOR = {
  [Level.INFO]: "green",
  [Level.WARNING]: "yellow",
  [Level.ERROR]: "red",
  [Level.CRITICAL]: "red",
};

export const LEVEL_TO_LABEL = {
  [Level.INFO]: "home-view.info",
  [Level.WARNING]: "home-view.warning",
  [Level.ERROR]: "home-view.error",
  [Level.CRITICAL]: "home-view.critical",
};

export const MESSAGE_LEVEL_TO_ICON = {
  [Level.INFO]: InfoOutlinedIcon,
  [Level.WARNING]: WarningAmberOutlinedIcon,
  [Level.ERROR]: ErrorOutlineIcon,
  [Level.CRITICAL]: ErrorOutlineIcon,
};
