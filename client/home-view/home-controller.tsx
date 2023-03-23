import { Reducer, ReducerState, useReducer, ChangeEvent } from "react";
import {
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
   * Messages to show.
   */
  messages: Message[];
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
        dispatch({ type: MESSAGE, value: message });
      },
      onResourceWillStart(resource: ResourceInValidation) {
        dispatch({
          type: MESSAGE,
          value: {
            create: new Date(),
            level: "INFO",
            validator: "",
            message: `Processing ${resource.url}`,
          },
        });
      },
      onResourceDidEnd(resource: ResourceInValidation) {
        // No action here
      },
    };

    dispatch({ type: VALIDATION_START });
    validateCatalogFromUrl(new ValidationReporter(observer), state.url).then(
      () => dispatch({ type: VALIDATION_END })
    );
  }

  return {
    state: state,
    onChangeUrl: onChangeUrl,
    onSubmit: onSubmit,
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
        messages: [],
      };
    case VALIDATION_END:
      return {
        ...state,
        working: false,
      };
    case MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.value],
      };
    default:
      throw new Error();
  }
};

const initialState: HomeState = {
  url: "https://open.datakhk.cz/katalog.jsonld",
  working: false,
  messages: [],
};
