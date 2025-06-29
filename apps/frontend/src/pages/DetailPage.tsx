// src/pages/DetailPage.tsx
import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useVideo } from "../hooks/useVideo";
import { useAnnotationsWS } from "../hooks/useAnnotationsWS";
import { useWebsocket } from "../contexts/WebSocketContext";
import { Loader, ErrorMessage } from "../components/common";
import CanvasOverlay from "../components/Video/CanvasOverlay";
import Transcript from "../components/Transcript/Transcript";
import FileUpload from "../components/Video/FileUpload";
import { VideoPlayer } from "../components/Video/VideoPlayer";

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const { video, results, loading, error } = useVideo(id!);
  const { joinRoom, leaveRoom } = useWebsocket();
  const tags = useAnnotationsWS();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  // join on mount, leave on unmount
  useEffect(() => {
    if (!id) return;

    joinRoom(id);
    return () => {
      leaveRoom(id);
    };
  }, [id, joinRoom, leaveRoom]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage msg={error} />;
  if (!video || !results) return null;

  return (
    <div style={{ position: "relative", width: 640, margin: "auto" }}>
      <p>Status: {video.status}</p>
      <FileUpload videoId={id!} />
      <VideoPlayer
        ref={videoRef}
        src={video.url}
        controls
        onTimeUpdate={() => setCurrentTime(videoRef.current!.currentTime)}
      />
      <CanvasOverlay currentTime={currentTime} aiTags={tags} />
      <Transcript
        transcriptList={results.transcripts}
        currentTime={currentTime}
      />
    </div>
  );
}
