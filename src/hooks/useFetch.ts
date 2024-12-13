import { buildQueryParams } from "../utils/buildQueryParams";
import { useAsync } from "./useAsync";

export function useFetch<T>(
  url: string,
  options?: RequestInit,
  queryParams?: Record<string, string>
): {
  refetch: (...args: any[]) => Promise<void>;
  reset: () => void;
  data: T | null;
  error: Error | null;
  loading: boolean;
} {
  const stableSerialize = (obj: any) => (obj ? JSON.stringify(obj) : null);
  const fetcher = async () => {
    const query = buildQueryParams(queryParams);
    const fullUrl = `${url}${query}`;
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        ...(options?.headers || {}),
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return response.json() as Promise<T>;
  };

  return useAsync(
    fetcher,
    [url, stableSerialize(queryParams), stableSerialize(options)],
    () => `${url}${buildQueryParams(queryParams)}`
  );
}
