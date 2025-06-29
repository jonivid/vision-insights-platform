// src/components/Video/CanvasOverlay.tsx
import React, { useRef, useEffect } from "react";

export interface AITag {
  timestampSeconds: number;
  box: [number, number, number, number];
  label?: string;
}

interface CanvasOverlayProps {
  currentTime: number;
  aiTags: AITag[];
}

/**
 * Overlays AI annotation boxes on the video.
 */
export default function CanvasOverlay({
  currentTime,
  aiTags,
}: CanvasOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Only show tags near the current time (±0.15s)
    const active = aiTags.filter(
      (tag) => Math.abs(tag.timestampSeconds - currentTime) < 0.15
    );

    ctx.lineWidth = 2;
    ctx.font = "14px Arial";
    ctx.textBaseline = "top";

    active.forEach(({ box: [x, y, w, h], label }) => {
      // Draw rectangle
      ctx.strokeStyle = "lime";
      ctx.strokeRect(x, y, w, h);

      // Draw label background
      if (label) {
        const textW = ctx.measureText(label).width + 6;
        const textH = 18; // approximate
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(x, y - textH, textW, textH);

        // Draw label text
        ctx.fillStyle = "yellow";
        ctx.fillText(label, x + 3, y - textH + 2);
      }
    });
  }, [currentTime, aiTags]);

  return (
    <canvas
      ref={canvasRef}
      width={640}
      height={360}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    />
  );
}
