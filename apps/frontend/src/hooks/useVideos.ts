import { useState, useEffect } from 'react';
import { listVideos, createVideo, type Video,  } from '../api/videos';

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listVideos()
      .then(setVideos)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const addVideo = async (url: string) => {
    setLoading(true);
    try {
      const vid = await createVideo(url);
      setVideos(vs => [vid, ...vs]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { videos, loading, error, addVideo };
}