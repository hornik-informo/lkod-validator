import {ChangeEvent, Reducer, ReducerState, useReducer} from "react";
import {
  Level,
  Message,
  ResourceInValidation,
  validateCatalogFromUrl,
  ValidationObserver,
  ValidationReporter,
} from "../../validator";

const URL_CHANGE = "URL_CHANGE";

const VALIDATION_START = "VALIDATION_START";

const VALIDATION_END = "VALIDATION_END";

const MESSAGE = "MESSAGE";

const RESOURCE_OPEN = "RESOURCE_OPEN";

const RESOURCE_CLOSE = "RESOURCE_CLOSE";

const TOGGLE = "TOGGLE";

export interface MessageGroup {
  /**
   * Subject of validation.
   */
  resource: ResourceInValidation;
  /**
   * Messages in group.
   */
  messages: Message[];
  /**
   * True if group is one in user interface.
   */
  open: boolean;
  /**
   * Set to true when user manually interacted with the toggle.
   */
  manualOpen: boolean;
  /**
   * Highest message level.
   */
  level: Level;
}

interface HomeState {
  /**
   * User provided URL or resource.
   */
  url: string;
  /**
   * Loading and processing is active.
   */
  working: boolean;
  /**
   * Groups of messages.
   */
  groups: MessageGroup[];
}

export function useHomeController() {
  const [state, dispatch] = useReducer(
    homeReducer,
    initialState as ReducerState<HomeState>
  );

  function onChangeUrl(event: ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: URL_CHANGE,
      value: event.target.value,
    });
  }

  function onSubmit() {
    const observer: ValidationObserver = {
      onMessage(message: Message) {
        dispatch({type: MESSAGE, value: message});
      },
      onResourceWillStart(resource: ResourceInValidation) {
        dispatch({type: RESOURCE_OPEN, value: resource});
      },
      onResourceDidEnd(resource: ResourceInValidation) {
        dispatch({type: RESOURCE_CLOSE, value: resource});
      },
    };

    dispatch({type: VALIDATION_START});
    validateCatalogFromUrl(new ValidationReporter(observer), state.url).then(
      () => dispatch({type: VALIDATION_END})
    );
  }

  function onToggle(index: number) {
    dispatch({type: TOGGLE, value: index});
  }

  return {
    state,
    onChangeUrl,
    onSubmit,
    onToggle,
  };
}

const homeReducer: Reducer<HomeState, any> = (state, action): HomeState => {
  switch (action.type) {
    case URL_CHANGE:
      return {
        ...state,
        url: action.value,
      };
    case VALIDATION_START:
      return {
        ...state,
        working: true,
        groups: [],
      };
    case VALIDATION_END:
      return {
        ...state,
        working: false,
      };
    case MESSAGE:
      return onMessage(state, action.value);
    case RESOURCE_OPEN:
      return onResourceOpen(state, action.value);
    case RESOURCE_CLOSE:
      return onResourceClose(state, action.value);
    case TOGGLE:
      return {
        ...state,
        groups: [
          ...state.groups.slice(0, action.value),
          {
            ...state.groups[action.value],
            open: !state.groups[action.value].open,
            manualOpen: true,
          },
          ...state.groups.slice(action.value + 1),
        ],
      };
    default:
      throw new Error();
  }
};

function onMessage(state: HomeState, message: Message): HomeState {
  const last = state.groups[state.groups.length - 1];
  return {
    ...state,
    groups: [
      ...state.groups.slice(0, -1),
      {
        ...last,
        messages: [...last.messages, message],
        level: Math.max(last.level, message.level)
      },
    ],
  };
}

function onResourceOpen(state: HomeState, resource: any): HomeState {
  const nextGroup = {
    resource: resource,
    messages: [],
    open: true,
    manualOpen: false,
    level: Level.INFO,
  };
  return {
    ...state,
    groups: [
      ...state.groups,
      nextGroup,
    ]
  }
}

function onResourceClose(state: HomeState, resource: any): HomeState {
  const nextGroups = state.groups.map(group => {
    if (group.resource.url !== resource.url) {
      // Not the group we want.
      return group;
    }
    if (group.manualOpen) {
      // There was user interaction.
      return group;
    }
    // Close the last group if there is no issue.
    const nextOpen = group.level !== Level.INFO;
    return {
      ...group,
      open: nextOpen,
    };
  });
  return {
    ...state,
    groups: nextGroups,
  };
}

const initialState: HomeState = {
  url:"https://data.mvcr.gov.cz/sparql",
  // "https://open.datakhk.cz/katalog.jsonld",
  working: false,
  groups: [],
};
