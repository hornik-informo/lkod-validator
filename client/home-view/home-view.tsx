import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Fade from "@mui/material/Fade";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useHomeController } from "./home-controller";

export function HomeView() {
  const { t } = useTranslation();

  const { state, onChangeUrl, onSubmit } = useHomeController();

  return (
    <div>
      <h1>{t("title")}</h1>
      <hr />
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
      <List>
        {state.messages.map((message, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={message.validator}
              secondary={message.message}
            />
          </ListItem>
        ))}
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
