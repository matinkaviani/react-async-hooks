export type AsyncState<T> = {
    data: T | null;
    error: Error | null;
    loading: boolean;
};
export declare function useAsync<T>(asyncFunction: (...args: any[]) => Promise<T>, deps?: any[], cacheKeyGenerator?: (...args: any[]) => string): {
    refetch: (...args: any[]) => Promise<void>;
    reset: () => void;
    data: T | null;
    error: Error | null;
    loading: boolean;
};
