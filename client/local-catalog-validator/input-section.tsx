import React, { useState, useMemo, ChangeEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { useUrlQuery } from "../application/url-query";

/**
 * Allow users to provide URL of a local catalog to validate.
 */
export function InputSection(props: {
  onStartValidation: (url: string) => void,
  disabled: boolean,
}) {
  return (
    <InputArea {...props} />
  )
}

const InputArea = (props: {
  onStartValidation: (url: string) => void;
  disabled: boolean;
}) => {
  const { t } = useTranslation();
  const urlQuery = useUrlQuery();
  const { url, onChangeUrl, onSubmit } = useInputAreaController(
    urlQuery.catalog, props.onStartValidation);
  return (
    <div>
      <TextField
        id="resource-url"
        label={t("ui.resource-url")}
        variant="standard"
        value={url}
        onChange={onChangeUrl}
        disabled={props.disabled}
        fullWidth
      />
      <br /> <br />
      <Button
        variant="outlined"
        onClick={onSubmit}
        disabled={props.disabled || url === ""}
      >
        {t("ui.submit")}
      </Button>
    </div>
  );
};

const useInputAreaController = (
  defaultValue: null | string,
  onStartValidation: (url: string) => void
) => {
  const [url, setUrl] = useState(defaultValue ?? "");

  useEffect(() => {
    if (defaultValue === null) {
      return;
    } else {
      // Start validation with given URL.
      onStartValidation(defaultValue);
    }
  }, []);

  const onChangeUrl = useMemo(
    () => (event: ChangeEvent<HTMLInputElement>) => {
      setUrl(event.target.value);
    },
    [setUrl]
  );

  const onSubmit = useMemo(
    () => () => onStartValidation(url),
    [url, onStartValidation]
  );

  return {
    url,
    onChangeUrl,
    onSubmit,
  };
};
