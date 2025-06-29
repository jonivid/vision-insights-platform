import React from 'react';
import { useVideos } from '../hooks/useVideos';
import { Loader, ErrorMessage } from '../components/common';
import { Link } from 'react-router-dom';

export default function ListPage() {
  const { videos, loading, error, addVideo } = useVideos();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const url = (form.elements.namedItem('url') as HTMLInputElement).value;
    addVideo(url);
    form.reset();
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage msg={error} />;

  return (
    <main style={{ padding: 24 }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <input name="url" type="url" placeholder="Video URL" style={{ width: '80%', padding: 8 }} />
        <button type="submit" style={{ padding: '8px 16px', marginLeft: 8 }}>
          Upload
        </button>
      </form>
      <ul>
        {videos.map(v => (
          <li key={v.id} style={{ marginBottom: 8 }}>
            <Link to={`/videos/${v.id}`}>{v.url}</Link> — <strong>{v.status}</strong>
          </li>
        ))}
      </ul>
    </main>
  );
}