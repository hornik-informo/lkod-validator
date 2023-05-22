import { ReducerState, useReducer, useMemo } from "react";
import {
  createNoActionValidationListener,
  Message,
  ResourceContentType,
  ResourceInValidation,
  validateCatalogFromUrl,
  ValidationListener,
  ValidationReporter,
} from "../../validator";
import { Quad } from "@rdfjs/types";

interface State {
  /**
   * Loading and processing is active.
   */
  working: boolean;
  /**
   * Set to true once validation is finished.
   */
  completed: boolean;
  /**
   * Status message.
   */
  statusMessage: string;
  /**
   * Arguments for status message.
   */
  statusArgs: object | undefined;
}

enum Action {
  VALIDATION_START = "VALIDATION_START",
  VALIDATION_END = "VALIDATION_END",
  STATUS = "STATUS",
}

export const useValidatorService = (listeners: ValidationListener[]) => {
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState() as ReducerState<State>
  );

  const listener = useMemo(() => createListener(dispatch), [dispatch]);

  const onBeginValidation = useMemo(
    () => (url: string) => {
      dispatch({ type: Action.VALIDATION_START });
      validateCatalogFromUrl(
        new ValidationReporter([listener, ...listeners]),
        url
      ).then(() => dispatch({ type: Action.VALIDATION_END }));
    },
    [dispatch, listener, listeners]
  );

  return {
    state,
    onBeginValidation,
  };
};

const createInitialState: () => State = () => ({
  working: false,
  statusMessage: "",
  statusArgs: undefined,
  completed: false,
});

function createListener(dispatch): ValidationListener {
  return {
    ...createNoActionValidationListener(),
    onStatus(status: string, args: object | undefined) {
      dispatch({ type: Action.STATUS, value: status, args: args });
    },
  };
}

function reducer(state: State, action: any): State {
  switch (action.type) {
    case Action.VALIDATION_START:
      return {
        ...state,
        working: true,
      };
    case Action.VALIDATION_END:
      return {
        ...state,
        working: false,
        completed: true,
      };
    case Action.STATUS:
      return onStatus(state, action.value, action.args);
    default:
      throw new Error();
  }
}

function onStatus(
  state: State,
  status: String,
  args: object | undefined
): State {
  return {
    ...state,
    statusMessage: status,
    statusArgs: args,
  };
}
