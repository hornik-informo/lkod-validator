import { useState, useMemo, ChangeEvent } from "react";

export const useInputAreaController = (
  onStartValidation: (url: string) => void
) => {
  const [url, setUrl] = useState("https://kod.brno.cz/nkod/index.ttl");

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
