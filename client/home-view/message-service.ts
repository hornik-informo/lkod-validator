import { ReducerState, useReducer, useMemo } from "react";
import {
  createNoActionValidationListener,
  Level,
  Message,
  ResourceInValidation,
  ValidationListener,
} from "../../validator";

interface State {
  /**
   * Groups of messages.
   */
  groups: MessageGroup[];
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

enum Action {
  VALIDATION_START = "VALIDATION_START",
  MESSAGE = "MESSAGE",
  RESOURCE_OPEN = "RESOURCE_OPEN",
  RESOURCE_CLOSE = "RESOURCE_CLOSE",
}

export function useMessageService() {
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
    groups: [],
  };
}

function createListener(dispatch): ValidationListener {
  return {
    ...createNoActionValidationListener(),
    onValidationWillStart() {
      dispatch({ type: Action.VALIDATION_START });
    },
    onResourceWillStart(resource: ResourceInValidation) {
      dispatch({ type: Action.RESOURCE_OPEN, value: resource });
    },
    onMessage(resource: ResourceInValidation, message: Message) {
      dispatch({ type: Action.MESSAGE, value: message });
    },
  };
}

function reducer(state: State, action: any): State {
  switch (action.type) {
    case Action.VALIDATION_START:
      return createInitialState();
    case Action.MESSAGE:
      return onMessage(state, action.value);
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
    groups: [...state.groups, nextGroup],
  };
}
