import { useState, useMemo, ChangeEvent } from "react";

export const useInputAreaController = (
  onStartValidation: (url: string) => void
) => {
  const [url, setUrl] = useState(
    "https://dev.nkod.opendata.cz/api/v2/vdf/dataset?iri=https://data.gov.cz/zdroj/datové-sady/00007064/cd9a963ddff984087857cc891a790784"
  );

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
