import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React from "react";
import { useTranslation } from "react-i18next";
import { useInputAreaController } from "./input-area-controller";
import { useUrlQuery } from "../application/url-query";

export const InputArea = ({
  onStartValidation,
  disabled,
}: {
  onStartValidation: (url: string) => void;
  disabled: boolean;
}) => {
  const { t } = useTranslation();
  const urlQuery = useUrlQuery();
  const { url, onChangeUrl, onSubmit } = useInputAreaController(
    urlQuery.catalog,
    onStartValidation
  );
  return (
    <div>
      <TextField
        id="resource-url"
        label={t("home-view.resource-url")}
        variant="standard"
        value={url}
        onChange={onChangeUrl}
        disabled={disabled}
        fullWidth
      />
      <br /> <br />
      <Button
        variant="outlined"
        onClick={onSubmit}
        disabled={disabled || url === ""}
      >
        {t("home-view.submit")}
      </Button>
    </div>
  );
};
