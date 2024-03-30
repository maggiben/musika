import { useRef, useState, useEffect, useCallback, memo } from 'react';
import WaveSurfer from 'wavesurfer.js';

// WaveSurfer hook
const useWavesurfer = (containerRef, options): WaveSurfer | undefined => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | undefined>(undefined);

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!containerRef.current) return;

    console.log('options', options);
    const ws = WaveSurfer.create({
      ...options,
      container: containerRef.current,
    });

    ws.setVolume(1);

    setWavesurfer(ws);

    return () => {
      ws.destroy();
    };
  }, [options, containerRef]);

  return wavesurfer;
};

// Create a React component that will render wavesurfer.
// Props are wavesurfer options.
const WaveSurferPlayer = memo((props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const wavesurfer = useWavesurfer(containerRef, props);
  const { onPlay, onReady } = props;

  // On play button click
  const onPlayClick = useCallback(() => {
    wavesurfer.playPause();
  }, [wavesurfer]);

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!wavesurfer) return;

    const getPlayerParams = () => ({
      media: wavesurfer.getMediaElement(),
      peaks: wavesurfer.exportPeaks(),
    });

    const subscriptions = [
      wavesurfer.on('ready', () => {
        console.log('ready', wavesurfer.isPlaying());
        onReady && onReady(getPlayerParams());

        setIsPlaying(wavesurfer.isPlaying());
      }),
      wavesurfer.on('play', () => {
        console.log('play');
        onPlay &&
          onPlay((prev) => {
            const newParams = getPlayerParams();
            if (!prev || prev.media !== newParams.media) {
              if (prev) {
                prev.media.pause();
                prev.media.currentTime = 0;
              }
              return newParams;
            }
            return prev;
          });

        setIsPlaying(true);
      }),
      wavesurfer.on('pause', () => setIsPlaying(false)),
    ];

    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [wavesurfer, onPlay, onReady]);

  return (
    <div style={{ display: 'flex', gap: '1em', marginBottom: '1em' }}>
      <button onClick={onPlayClick}>{isPlaying ? '⏸️' : '▶️'}</button>

      <div ref={containerRef} style={{ minWidth: '200px' }} />
    </div>
  );
});

export default WaveSurferPlayer;
