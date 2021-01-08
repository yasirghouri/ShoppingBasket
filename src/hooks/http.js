import { useReducer, useCallback } from "react";

const initialState = {
  laoding: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const httpReducer = (currhttpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case "RESPONSE":
      return {
        ...currhttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case "CLEAR":
      return initialState;
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    default:
      throw new Error("Should not get reached!");
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => {
    dispatchHttp({ type: "CLEAR" });
  }, []);

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifier) => {
      dispatchHttp({
        type: "SEND",
        identifier: reqIdentifier,
      });
      fetch(url, {
        method: method,
        body: body,
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          dispatchHttp({ type: "RESPONSE", responseData, extra: reqExtra });
        })
        .catch((_) => {
          dispatchHttp({
            type: "ERROR",
            errorMessage: "Something Went Wrong",
          });
        });
    },
    []
  );

  return {
    isLoading: httpState.loading,
    error: httpState.error,
    data: httpState.data,
    sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clear,
  };
};

export default useHttp;
