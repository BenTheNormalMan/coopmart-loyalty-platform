import { useState, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApiState<T>(initialData: T | null = null) {
  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const startLoading = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
  }, []);

  const setSuccess = useCallback((data: T) => {
    setState({ data, loading: false, error: null });
  }, []);

  const setError = useCallback((error: string) => {
    setState((prev) => ({ ...prev, loading: false, error }));
  }, []);

  return { ...state, startLoading, setSuccess, setError };
}
