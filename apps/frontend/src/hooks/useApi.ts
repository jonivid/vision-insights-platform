import { useState } from "react";

export function useApi<T>(promise: Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  promise
    .then((res) => setData(res))
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));

  return { data, error, loading };
}
