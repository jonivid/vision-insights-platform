import { useState, useEffect } from "react";
import { getVideo, getResults, type Video, type Results } from "../api/videos";

export function useVideo(id: string) {
  const [video, setVideo] = useState<Video | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getVideo(id), getResults(id)])
      .then(([vid, res]) => {
        setVideo(vid);
        setResults(res);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { video, results, loading, error };
}
