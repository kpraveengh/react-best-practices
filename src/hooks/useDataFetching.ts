import { useCallback, useEffect, useReducer } from 'react';

// Define the types for our state
interface RequestState<T> {
    data: T | null;
    error: Error | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
}

// Define actions for our reducer
type RequestAction<T> =
    | { type: 'REQUEST_INIT' }
    | { type: 'REQUEST_SUCCESS'; payload: T }
    | { type: 'REQUEST_FAILURE'; error: Error }
    | { type: 'REQUEST_RESET' };

// Initial state function with proper typing
function initialState<T>(): RequestState<T> {
    return {
        data: null,
        error: null,
        isLoading: false,
        isSuccess: false,
        isError: false,
    };
}

// Type-safe reducer function
function requestReducer<T>(
    state: RequestState<T>,
    action: RequestAction<T>
): RequestState<T> {
    switch (action.type) {
        case 'REQUEST_INIT':
            return {
                ...initialState<T>(),
                isLoading: true,
            };
        case 'REQUEST_SUCCESS':
            return {
                ...state,
                data: action.payload,
                error: null,
                isLoading: false,
                isSuccess: true,
                isError: false,
            };
        case 'REQUEST_FAILURE':
            return {
                ...state,
                data: null,
                error: action.error,
                isLoading: false,
                isSuccess: false,
                isError: true,
            };
        case 'REQUEST_RESET':
            return initialState<T>();
        default:
            return state;
    }
}

// Cache to store responses
const cache = new Map<string, any>();

/**
 * A custom hook for data fetching with TypeScript integration
 * Features:
 * - Type safety for request and response
 * - Loading, success, and error states
 * - Optional caching
 * - Manual refetching
 * 
 * @template T - The type of data expected from the API
 * @param url - The URL to fetch data from
 * @param options - Fetch options including caching configuration
 */
export function useDataFetching<T = any>(
    url: string,
    options: {
        fetchOptions?: RequestInit;
        skip?: boolean;
        cacheResponse?: boolean;
        dependencies?: any[];
        onSuccess?: (data: T) => void;
        onError?: (error: Error) => void;
    } = {}
) {
    const {
        fetchOptions,
        skip = false,
        cacheResponse = false,
        dependencies = [],
        onSuccess,
        onError,
    } = options;

    // Use reducer to manage complex state
    const [state, dispatch] = useReducer(
        (state: RequestState<T>, action: RequestAction<T>) =>
            requestReducer<T>(state, action),
        initialState<T>()
    );

    // Define fetch function with caching
    const fetchData = useCallback(async () => {
        const cacheKey = `${url}-${JSON.stringify(fetchOptions)}`;

        // Return cached data if available and caching is enabled
        if (cacheResponse && cache.has(cacheKey)) {
            dispatch({ type: 'REQUEST_SUCCESS', payload: cache.get(cacheKey) });
            onSuccess?.(cache.get(cacheKey));
            return;
        }

        dispatch({ type: 'REQUEST_INIT' });

        try {
            const response = await fetch(url, fetchOptions);

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const data = await response.json() as T;

            // Store in cache if caching is enabled
            if (cacheResponse) {
                cache.set(cacheKey, data);
            }

            dispatch({ type: 'REQUEST_SUCCESS', payload: data });
            onSuccess?.(data);
        } catch (error) {
            const errorObject = error instanceof Error ? error : new Error(String(error));
            dispatch({ type: 'REQUEST_FAILURE', error: errorObject });
            onError?.(errorObject);
        }
    }, [url, JSON.stringify(fetchOptions), cacheResponse, onSuccess, onError]);

    // Reset the state
    const reset = useCallback(() => {
        dispatch({ type: 'REQUEST_RESET' });
    }, []);

    // Execute fetch on mount and when dependencies change
    useEffect(() => {
        if (!skip) {
            fetchData();
        }

        return () => {
            // Cleanup if needed
        };
    }, [fetchData, skip, ...dependencies]);

    return {
        ...state,
        refetch: fetchData,
        reset,
    };
}