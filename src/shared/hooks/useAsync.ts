import { useState, useCallback, useEffect } from "react";
import { logger } from "../utils/logger";

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: <T>(data: T) => void;
  onError?: (error: Error) => void;
  retryCount?: number;
  retryDelay?: number;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const {
    immediate = true,
    onSuccess,
    onError,
    retryCount = 0,
    retryDelay = 1000,
  } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
    isSuccess: false,
    isError: false,
  });

  const [retries, setRetries] = useState(0);

  const execute = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      isSuccess: false,
      isError: false,
    }));

    try {
      const response = await asyncFunction();
      setState({
        data: response,
        error: null,
        isLoading: false,
        isSuccess: true,
        isError: false,
      });
      onSuccess?.(response);
      setRetries(0);
    } catch (error) {
      const isRetryable = retries < retryCount;
      logger.error("Async operation failed:", {
        error,
        retries,
        willRetry: isRetryable,
      });

      if (isRetryable) {
        setRetries((prev) => prev + 1);
        setTimeout(execute, retryDelay);
        return;
      }

      const errorObject =
        error instanceof Error ? error : new Error(String(error));
      setState({
        data: null,
        error: errorObject,
        isLoading: false,
        isSuccess: false,
        isError: true,
      });
      onError?.(errorObject);
    }
  }, [asyncFunction, onSuccess, onError, retries, retryCount, retryDelay]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
    setRetries(0);
  }, []);

  return {
    ...state,
    execute,
    reset,
    retry: execute,
  };
}
