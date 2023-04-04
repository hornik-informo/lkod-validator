import { ValidationReporter } from "../validator-api";

export type ContentTypeHeader = {
  type: string;
  parameters: Record<string, string>;
};

const GROUP = "HTTP";

/**
 * Start a fetch request and return response object.
 */
export async function initiateResourceFetch(
  url: string,
  report: ValidationReporter
): Promise<Response | null> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    report.critical(GROUP, `Fetch of '${url}' failed, with error message '${error.message}'.`);
    return null;
  }
  if (!response.ok) {
    // Status is not in the range 200-299.
    report.critical(
      GROUP,
      `Can't fetch data, status '${response.status}'` +
        `text: '${response.statusText}'.`
    );
  } else {
    report.info(GROUP, "Fetching data from URL.");
    return response;
  }
}

export function parseContentType(contentTypeHeader: string): ContentTypeHeader {
  const tokens = contentTypeHeader.split(";").map(item => item.trim());
  const parameters = {};
  for (let index = 1; index < tokens.length; ++index) {
    const [key, value] = tokens[index].split("=", 2);
    parameters[key.trim()] = value.trim();
  }
  return {
    type: tokens[0],
    parameters: parameters,
  };
}
