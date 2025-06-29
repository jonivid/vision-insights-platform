import { useState, useCallback } from "react";
import { type AxiosProgressEvent } from "axios";
import { api } from "../api/axios";

export function useFileUpload(videoId: string) {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File) => {
      setProgress(0);
      setError(null);

      const fd = new FormData();
      fd.append("file", file);

      const res = await api.post<{ storageKey: string }>(
        `/videos/${videoId}/upload`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (evt: AxiosProgressEvent) => {
            const percent = Math.round((evt.loaded * 100) / (evt.total || 1));
            setProgress(percent);
          },
        }
      );
      return res.data.storageKey;
    },
    [videoId]
  );

  return { upload, progress, error };
}
