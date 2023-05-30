import {useState} from "react";

interface UrlQuery {
  catalog: null | string;
}

let parsedUrlQuery = parseUrlQuery();

function parseUrlQuery() {
  const params = new URLSearchParams(window.location.search);
  return {
    "catalog": params.get("catalog"),
  };
}

export function useUrlQuery(): UrlQuery {
  const [params, _] = useState<UrlQuery>(parsedUrlQuery);
  return params;
}
