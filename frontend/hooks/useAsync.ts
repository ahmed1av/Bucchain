import { useState, useEffect, useCallback, useRef } from 'react';

interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

interface UseAsyncOptions {
    immediate?: boolean;
}

export function useAsync<T>(
    asyncFunction: () => Promise<T>,
    options: UseAsyncOptions = { immediate: true }
) {
    const [state, setState] = useState<AsyncState<T>>({
        data: null,
        loading: options.immediate || false,
        error: null,
    });

    const isMountedRef = useRef(true);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const execute = useCallback(async () => {
        setState({ data: null, loading: true, error: null });

        try {
            const result = await asyncFunction();

            if (isMountedRef.current) {
                setState({ data: result, loading: false, error: null });
            }

            return result;
        } catch (error) {
            if (isMountedRef.current) {
                setState({ data: null, loading: false, error: error as Error });
            }
            throw error;
        }
    }, [asyncFunction]);

    useEffect(() => {
        if (options.immediate) {
            execute();
        }
    }, [execute, options.immediate]);

    return {
        ...state,
        execute,
        reset: () => setState({ data: null, loading: false, error: null }),
    };
}
