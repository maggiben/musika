import { useState, useEffect, RefObject } from 'react';
import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js';

// WaveSurfer hook
const useWaveSurfer = (
  containerRef: RefObject<HTMLElement | null>,
  options: WaveSurferOptions,
): WaveSurfer | undefined => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | undefined>(undefined);

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!containerRef?.current || !options.url) return;

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

export default useWaveSurfer;
