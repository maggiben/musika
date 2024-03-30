import {
  useRef,
  useEffect,
  useCallback,
  memo,
  forwardRef,
  RefObject,
  useImperativeHandle,
  Ref,
} from 'react';
import { WaveSurferOptions } from 'wavesurfer.js';
import useWaveSurfer from '@hooks/useWaveSurfer';

interface IWaveSurferPlayerParams {
  media: HTMLMediaElement;
  peaks: number[][];
  isPlaying: boolean;
}

interface IWaveSurferPlayer {
  options: Omit<WaveSurferOptions, 'container'>;
  onPlay?: (params: IWaveSurferPlayerParams) => void;
  onReady?: (params: IWaveSurferPlayerParams & { duration: number }) => void;
}

const WaveSurfer = memo(
  forwardRef<HTMLDivElement, IWaveSurferPlayer>(
    (props: IWaveSurferPlayer, containerRef: Ref<HTMLDivElement>) => {
      const waveSurferContainerRef = useRef<HTMLDivElement | null>(null);
      const wavesurfer = useWaveSurfer(
        containerRef as RefObject<HTMLElement>,
        props.options as WaveSurferOptions,
      );
      const { onPlay, onReady } = props;

      useImperativeHandle(
        containerRef,
        () => waveSurferContainerRef.current as unknown as HTMLDivElement,
      );

      // On play button click
      const onPlayPause = useCallback(() => {
        wavesurfer?.playPause();
      }, [wavesurfer]);

      // Initialize wavesurfer when the container mounts
      // or any of the props change
      useEffect(() => {
        if (!wavesurfer) return;
        if (!containerRef && !waveSurferContainerRef.current) return;

        const domNode = waveSurferContainerRef.current;

        const getPlayerParams = (): IWaveSurferPlayerParams => ({
          media: wavesurfer.getMediaElement(),
          peaks: wavesurfer.exportPeaks(),
          isPlaying: wavesurfer.isPlaying(),
        });

        const subscriptions = [
          wavesurfer.on('ready', (duration: number) => {
            onReady && onReady({ ...getPlayerParams(), duration });
          }),
          wavesurfer.on('play', () => {
            onPlay && onPlay(getPlayerParams());
          }),
        ];

        const listeners = {
          playPause: onPlayPause,
          url: onPlayPause,
          volume: onPlayPause,
        };

        Object.entries(listeners).forEach(([event, listener]) => {
          domNode?.addEventListener(event, listener);
        });

        return () => {
          subscriptions.forEach((unsub) => unsub());
          Object.entries(listeners).forEach(([event, listener]) => {
            domNode?.removeEventListener(event, listener);
          });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [wavesurfer]);

      return (
        <div
          id="wave-surfer-container"
          ref={waveSurferContainerRef}
          style={{ minWidth: '200px' }}
        />
      );
    },
  ),
);

export default WaveSurfer;
