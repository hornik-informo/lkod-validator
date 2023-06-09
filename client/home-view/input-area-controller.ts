import { useState, useMemo, ChangeEvent, useEffect } from "react";

export const useInputAreaController = (
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
