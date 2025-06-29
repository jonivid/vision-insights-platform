import React, { useState } from "react";
import { useFileUpload } from "../../hooks/useFileUpload";

interface Props {
  videoId: string;
}

export default function FileUpload({ videoId }: Props) {
  const { upload, progress, error } = useFileUpload(videoId);
  const [file, setFile] = useState<File | null>(null);
  const [done, setDone] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setDone(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    try {
      await upload(file);
      setDone(true);
    } catch {}
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
      <input type="file" onChange={handleFile} />
      <button type="submit" disabled={!file}>
        Upload
      </button>
      {file && (
        <div style={{ marginTop: 8 }}>
          <div>Progress: {progress}%</div>
          {done && <div style={{ color: "green" }}>Upload complete!</div>}
          {error && <div style={{ color: "red" }}>Error: {error}</div>}
        </div>
      )}
    </form>
  );
}
