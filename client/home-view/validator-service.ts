import {Reducer, ReducerState, useReducer, useMemo} from "react";
import {
  Level,
  Message,
  ResourceInValidation, validateCatalogFromUrl,
  ValidationListener, ValidationReporter
} from "../../validator";

interface State {
  /**
   * Loading and processing is active.
   */
  working: boolean;
  /**
   * Groups of messages.
   */
  groups: MessageGroup[];
  /**
   * Status message.
   */
  statusMessage: string;
  /**
   * Arguments for status message.
   */
  statusArgs: object | undefined;
  /**
   * Validation summary.
   */
  summary: Summary | undefined;
}

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
   * Highest message level.
   */
  level: Level;
}

interface Summary {

}

enum Action {
  VALIDATION_START = "VALIDATION_START",
  VALIDATION_END = "VALIDATION_END",
  MESSAGE = "MESSAGE",
  STATUS = "STATUS",
  RESOURCE_OPEN = "RESOURCE_OPEN",
  RESOURCE_CLOSE = "RESOURCE_CLOSE",
}

export const useValidatorService = () => {
  const [state, dispatch] = useReducer(
    serviceReducer,
    createInitialState() as ReducerState<State>
  );

  const onBeginValidation = useMemo(() => (url: string) => {
    const observer: ValidationListener = {
      onMessage(message: Message) {
        dispatch({type: Action.MESSAGE, value: message});
      },
      onStatus(status: string, args: object | undefined) {
        dispatch({type: Action.STATUS, value: status, args: args});
      },
      onResourceWillStart(resource: ResourceInValidation) {
        dispatch({type: Action.RESOURCE_OPEN, value: resource});
      },
      onResourceDidEnd(resource: ResourceInValidation) {
        dispatch({type: Action.RESOURCE_CLOSE, value: resource});
      },
    };
    dispatch({type: Action.VALIDATION_START});
    validateCatalogFromUrl(new ValidationReporter(observer), url)
      .then(() => dispatch({type: Action.VALIDATION_END}));
  }, [dispatch]);

  return {
    state, onBeginValidation
  }
}

const serviceReducer: Reducer<State, any> = (state, action): State => {
  switch (action.type) {
    case Action.VALIDATION_START:
      return {
        ...state,
        working: true,
        groups: [],
      };
    case Action.VALIDATION_END:
      return {
        ...state,
        working: false,
      };
    case Action.MESSAGE:
      return onMessage(state, action.value);
    case Action.STATUS:
      return onStatus(state, action.value, action.args);
    case Action.RESOURCE_OPEN:
      return onResourceOpen(state, action.value);
    case Action.RESOURCE_CLOSE:
      // No action here.
      return state;
    default:
      throw new Error();
  }
}

function onMessage(state: State, message: Message): State {
  const last = state.groups[state.groups.length - 1];
  return {
    ...state,
    groups: [
      ...state.groups.slice(0, -1),
      {
        ...last,
        messages: [...last.messages, message],
        level: Math.max(last.level, message.level),
      },
    ],
  };
}

function onStatus(state: State, status: String, args: object | undefined): State {
  return {
    ...state,
    statusMessage: status,
    statusArgs: args,
  };
}

function onResourceOpen(state: State, resource: any): State {
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

const createInitialState: () => State = () => ({
  working: false,
  groups: [],
  statusMessage: "",
  statusArgs: undefined,
  summary: undefined,
});
