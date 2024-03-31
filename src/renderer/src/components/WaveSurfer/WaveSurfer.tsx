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

export interface IWaveSurferPlayerParams {
  media: HTMLMediaElement;
  peaks: number[][];
  isPlaying: boolean;
}

export interface IWaveSurferPlayer {
  options: Omit<WaveSurferOptions, 'container'>;
  onPlay?: (params: IWaveSurferPlayerParams) => void;
  onReady?: (params: IWaveSurferPlayerParams & { duration: number }) => void;
}

export type TWaveSurferListener =
  | (() => void)
  | (<T>(event: CustomEvent<T>) => void)
  | EventListener;

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
      const onPlayPause = useCallback((): void => {
        wavesurfer?.playPause();
      }, [wavesurfer]);

      const onSetVolume = useCallback(
        (event: CustomEvent<{ volume: number }>) => {
          console.log('volume', Math.round(event.detail.volume / 10) / 10);
          wavesurfer?.setVolume(Math.round(event.detail.volume / 10) / 10);
        },
        [wavesurfer],
      ) as TWaveSurferListener;

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
          setVolume: onSetVolume,
        };

        Object.entries(listeners).forEach(
          ([event, listener]: [event: unknown, listener: TWaveSurferListener]) => {
            domNode?.addEventListener(
              event as keyof HTMLElementEventMap,
              listener as EventListener,
            );
          },
        );

        return () => {
          subscriptions.forEach((unsub) => unsub());
          Object.entries(listeners).forEach(
            ([event, listener]: [event: unknown, listener: TWaveSurferListener]) => {
              domNode?.removeEventListener(
                event as keyof HTMLElementEventMap,
                listener as EventListener,
              );
            },
          );
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [wavesurfer]);

      return (
        <div id="wave-surfer-container" ref={waveSurferContainerRef} style={{ minWidth: '100%' }} />
      );
    },
  ),
);

export default WaveSurfer;
