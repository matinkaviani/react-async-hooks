import { useCallback, useEffect, useReducer, useRef } from "react";

export type AsyncState<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
};

type Action<T> =
  | { type: "INIT" }
  | { type: "SUCCESS"; payload: T }
  | { type: "FAILURE"; payload: Error }
  | { type: "RESET" };

function fetchReducer<T>(
  state: AsyncState<T>,
  action: Action<T>
): AsyncState<T> {
  switch (action.type) {
    case "INIT":
      return { ...state, loading: true, error: null };
    case "SUCCESS":
      return { data: action.payload, error: null, loading: false };
    case "FAILURE":
      return { data: null, error: action.payload, loading: false };
    case "RESET":
      return { data: null, error: null, loading: false };
    default:
      return state;
  }
}

const cache = new Map<string, any>();

export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  deps: any[] = [],
  cacheKeyGenerator?: (...args: any[]) => string
) {
  const [state, dispatch] = useReducer(fetchReducer<T>, {
    data: null,
    error: null,
    loading: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const refetch = useCallback(
    async (...args: any[]) => {
      const cacheKey = cacheKeyGenerator?.(...args) || JSON.stringify(args);

      if (cache.has(cacheKey)) {
        const cachedData = cache.get(cacheKey);
        dispatch({ type: "SUCCESS", payload: cachedData });
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      dispatch({ type: "INIT" });

      try {
        const data = await asyncFunction(...args);
        cache.set(cacheKey, data);
        dispatch({ type: "SUCCESS", payload: data });
      } catch (error: any) {
        if (error.name !== "AbortError") {
          dispatch({ type: "FAILURE", payload: error as Error });
        }
      }
    },
    [asyncFunction, cacheKeyGenerator]
  );

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  useEffect(() => {
    refetch();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, deps);

  return { ...state, refetch, reset };
}
