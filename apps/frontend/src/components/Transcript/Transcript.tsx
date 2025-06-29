import React from 'react';
import type { TranscriptLine } from '../../api/videos';

interface Props {
  transcriptList: TranscriptLine[];
  currentTime: number;
}

export default function Transcript({ transcriptList, currentTime }: Props) {
  const line = transcriptList.find(
    t => currentTime >= t.startSeconds && currentTime <= t.endSeconds
  );
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 40,
        width: '90%',
        textAlign: 'center',
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        padding: '6px 12px',
        pointerEvents: 'none',
      }}
    >
      {line?.text || ''}
    </div>
  );
}