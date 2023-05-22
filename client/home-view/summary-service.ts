import { ReducerState, useMemo, useReducer } from "react";

import { Quad } from "@rdfjs/types";

import {
  createNoActionValidationListener,
  Level,
  Message,
  ResourceContentType,
  ResourceInValidation,
  ResourceType,
  ValidationListener,
} from "../../validator";
import { loadIntoCatalogSummary, loadIntoDatasetSummary } from "./summary-load";

interface State {
  /**
   * Some messages and state are set
   */
  entrypoint: EntrypointSummary;
  /**
   * We have only one catalog, if there are multiple we aggregate the information.
   */
  catalog: CatalogSummary;
  /**
   * Datasets.
   */
  datasets: DatasetSummary[];
}

export interface EntrypointSummary {
  /**
   * Entry point URL.
   */
  url?: string;
  /**
   * We get content type for URL. This must be used for catalogs, which
   * may not report their content type. Similar is for datasets from SPARQL
   * endpoint.
   */
  contentType?: ResourceContentType;
  /**
   * Messages for URL, can be used when no catalog or dataset is found.
   */
  messages: Message[];
  /**
   * Highest level for all messages.
   */
  level?: Level;
}

/**
 * Represent data about a catalog. Should there be more then one,
 * we merge the data together.
 */
export interface CatalogSummary {
  /**
   * URL as expected.
   */
  expectedUrl?: string;
  /**
   * Catalog URLs as loaded from RDF.
   */
  urls: string[];
  /**
   * Catalog content type.
   */
  contentType?: ResourceContentType;
  /**
   * Titles as loaded from RDF.
   */
  titles: string[];
  /**
   * Messages for given catalog.
   */
  messages: Message[];
  /**
   * Highest message level for the catalog.
   */
  level?: Level;
  /**
   * Set to true when object is found and loaded from RDF.
   */
  contentLoaded: boolean;
}

export interface DatasetSummary {
  /**
   * Dataset URL.
   */
  url: string;
  /**
   * Dataset content type.
   */
  contentType?: ResourceContentType;
  /**
   * Title.
   */
  title?: string;
  /**
   * Highest level message for the dataset.
   */
  level?: Level;
}

enum Action {
  VALIDATION_START = "VALIDATION_START",
  MESSAGE = "MESSAGE",
  RESOURCE_OPEN = "RESOURCE_OPEN",
  CONTENT_TYPE = "CONTENT_TYPE",
  RDF = "RDF",
}

export function useSummaryService() {
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState() as ReducerState<State>
  );
  const listener = useMemo(() => createListener(dispatch), [dispatch]);
  return {
    state,
    listener,
  };
}

function createInitialState(): State {
  return {
    entrypoint: {
      messages: [],
    },
    catalog: {
      urls: [],
      titles: [],
      messages: [],
      contentLoaded: false,
    },
    datasets: [],
  };
}

function createListener(dispatch): ValidationListener {
  return {
    ...createNoActionValidationListener(),
    onValidationWillStart() {
      dispatch({ type: Action.VALIDATION_START });
    },
    onResourceWillStart(resource: ResourceInValidation) {
      dispatch({ type: Action.RESOURCE_OPEN, resource: resource });
    },
    onMessage(resource: ResourceInValidation, message: Message) {
      dispatch({ type: Action.MESSAGE, resource: resource, value: message });
    },
    onContentType(resource: ResourceInValidation, type: ResourceContentType) {
      dispatch({ type: Action.CONTENT_TYPE, resource: resource, value: type });
    },
    onRdfContent(resource: ResourceInValidation, quads: Quad[]) {
      dispatch({ type: Action.RDF, resource: resource, value: quads });
    },
  };
}

function reducer(state: State, action: any): State {
  switch (action.type) {
    case Action.VALIDATION_START:
      return createInitialState();
    case Action.MESSAGE:
      return onMessage(state, action.resource, action.value);
    case Action.RESOURCE_OPEN:
      return onResourceOpen(state, action.resource);
    case Action.CONTENT_TYPE:
      return onContentType(state, action.resource, action.value);
    case Action.RDF:
      return onRdfContent(state, action.resource, action.value);
    default:
      throw new Error();
  }
}

function onMessage(
  state: State,
  resource: ResourceInValidation,
  message: Message
): State {
  if (resource.type === ResourceType.URL) {
    return {
      ...state,
      entrypoint: {
        ...state.entrypoint,
        messages: [...state.entrypoint.messages, message],
        level: Math.max(state.entrypoint.level ?? 0, message.level),
      },
    };
  } else if (resource.type === ResourceType.CATALOG) {
    const catalog = { ...state.catalog };
    catalog.level = Math.max(catalog.level ?? 0, message.level);
    catalog.messages = [...catalog.messages, message];
    return {
      ...state,
      entrypoint: {
        ...state.entrypoint,
        level: Math.max(state.entrypoint.level ?? 0, message.level),
      },
      catalog: catalog,
    };
  } else if (resource.type === ResourceType.DATASET) {
    const [index, dataset] = secureDataset(state, resource.url);
    dataset.level = Math.max(dataset.level ?? 0, message.level);
    return {
      ...state,
      entrypoint: {
        ...state.entrypoint,
        level: Math.max(state.entrypoint.level ?? 0, message.level),
      },
      datasets: updateArray(state.datasets, index, dataset),
    };
  }
  return state;
}

function updateArray<T>(array: T[], index: number, value: T): T[] {
  return [...array.slice(0, index), value, ...array.slice(index + 1)];
}

/**
 * Return shallow copy of existing or new dataset.
 */
function secureDataset(state: State, url: string): [number, DatasetSummary] {
  for (const index of state.datasets.keys()) {
    const dataset = state.datasets[index];
    if (dataset.url === url) {
      return [index, { ...dataset }];
    }
  }
  console.error("Dataset resource was not open as it should.");
  return [
    state.datasets.length,
    {
      url: url,
      contentType: state.entrypoint.contentType,
    },
  ];
}

function onResourceOpen(state: State, resource: ResourceInValidation): State {
  if (resource.type === ResourceType.CATALOG) {
    return {
      ...state,
      catalog: {
        ...state.catalog,
        expectedUrl: resource.url,
        contentType: state.entrypoint.contentType,
      },
    };
  } else if (resource.type === ResourceType.DATASET) {
    const dataset: DatasetSummary = {
      url: resource.url,
      contentType: state.entrypoint.contentType,
    };
    return {
      ...state,
      datasets: [...state.datasets, dataset],
    };
  }
  return state;
}

function onContentType(
  state: State,
  resource: ResourceInValidation,
  contentType: ResourceContentType
): State {
  if (resource.type === ResourceType.URL) {
    return {
      ...state,
      entrypoint: {
        ...state.entrypoint,
        contentType,
      },
    };
  } else if (resource.type === ResourceType.CATALOG) {
    return {
      ...state,
      catalog: {
        ...state.catalog,
        contentType,
      },
    };
  } else if (resource.type === ResourceType.DATASET) {
    const [index, dataset] = secureDataset(state, resource.url);
    dataset.contentType = contentType;
    return {
      ...state,
      datasets: updateArray(state.datasets, index, dataset),
    };
  } else {
    return state;
  }
}

function onRdfContent(
  state: State,
  resource: ResourceInValidation,
  quads: Quad[]
): State {
  if (resource.type === ResourceType.CATALOG) {
    return {
      ...state,
      catalog: loadIntoCatalogSummary(state.catalog, quads),
    };
  } else if (resource.type === ResourceType.DATASET) {
    const [index, dataset] = secureDataset(state, resource.url);
    return {
      ...state,
      datasets: updateArray(
        state.datasets,
        index,
        loadIntoDatasetSummary(dataset, quads)
      ),
    };
  }
  return state;
}
