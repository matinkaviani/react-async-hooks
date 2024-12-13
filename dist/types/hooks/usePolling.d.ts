type PollingOptions = {
    enabled?: boolean;
};
type PollingState<T> = {
    data: T | null;
    error: Error | null;
    loading: boolean;
};
export declare function usePolling<T>(asyncFunction: () => Promise<T>, // Function to fetch data
interval: number, // Polling interval in milliseconds
options?: PollingOptions): PollingState<T> & {
    refetch: () => void;
};
export {};
