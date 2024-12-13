export declare function useFetch<T>(url: string, options?: RequestInit, queryParams?: Record<string, string>): {
    refetch: (...args: any[]) => Promise<void>;
    reset: () => void;
    data: T | null;
    error: Error | null;
    loading: boolean;
};
