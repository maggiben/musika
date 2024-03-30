import { useRef, useState, useEffect, useCallback, memo } from 'react';
import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js';

// WaveSurfer hook
const useWavesurfer = (containerRef, options: WaveSurferOptions): WaveSurfer | undefined => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | undefined>(undefined);

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      ...options,
      container: containerRef.current,
    });

    setWavesurfer(ws);

    return () => {
      ws.destroy();
    };
  }, [options, containerRef]);

  return wavesurfer;
};

// Create a React component that will render wavesurfer.
interface IWaveSurferPlayerParams {
  media: HTMLMediaElement;
  peaks: number[][];
}

interface IWaveSurferPlayer {
  options: Omit<WaveSurferOptions, 'container'>;
  onPlay?: (params: IWaveSurferPlayerParams) => void;
  onReady?: (params: IWaveSurferPlayerParams & { duration: number }) => void;
}

const WaveSurferPlayer = memo((props: IWaveSurferPlayer) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const wavesurfer = useWavesurfer(containerRef, props.options as WaveSurferOptions);
  const { onPlay, onReady } = props;

  // On play button click
  const onPlayClick = useCallback(() => {
    wavesurfer?.playPause();
  }, [wavesurfer]);

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!wavesurfer) return;

    const getPlayerParams = (): IWaveSurferPlayerParams => ({
      media: wavesurfer.getMediaElement(),
      peaks: wavesurfer.exportPeaks(),
    });

    const subscriptions = [
      wavesurfer.on('ready', (duration: number) => {
        console.log('ready', wavesurfer.isPlaying());
        onReady && onReady({ ...getPlayerParams(), duration });

        setIsPlaying(wavesurfer.isPlaying());
      }),
      wavesurfer.on('play', () => {
        onPlay && onPlay(getPlayerParams());

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
