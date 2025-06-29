import React, { forwardRef } from 'react';

type VideoPlayerProps = React.VideoHTMLAttributes<HTMLVideoElement>;

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  (props, ref) => (
    <video
      {...props}
      ref={ref}
      style={{ width: '100%', maxHeight: '480px', background: 'black' }}
    />
  )
);