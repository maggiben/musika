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
import { WaveSurferOptions, WaveSurferEvents } from 'wavesurfer.js';
import type { GeneralEventTypes } from 'wavesurfer.js/dist/event-emitter';
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
  onFinish?: (params: IWaveSurferPlayerParams) => void;
  onError?: (error: unknown) => void;
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
      const { onPlay, onReady, onFinish, onError } = props;

      useImperativeHandle(
        containerRef,
        () => waveSurferContainerRef.current as unknown as HTMLDivElement,
      );

      // On play button click
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const onPlayPause = useCallback(() => wavesurfer?.playPause(), [wavesurfer]);

      const onSetVolume = useCallback(
        ({ detail: { volume } }: CustomEvent<{ volume: number }>) =>
          wavesurfer?.setVolume(Math.round(volume / 10) / 10),
        [wavesurfer],
      ) as TWaveSurferListener;

      const onSetMuted = useCallback(
        ({ muted }: { muted: boolean }) => wavesurfer?.setMuted(muted),
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

        /* WS Events */
        const subscriptions: { [key: string]: unknown } = {
          ready: (duration: number) => onReady && onReady({ ...getPlayerParams(), duration }),
          play: () => onPlay && onPlay(getPlayerParams()),
          finish: () => {
            wavesurfer.stop();
            onFinish && onFinish(getPlayerParams());
          },
          error: (error) => onError && onError(error),
        };

        /* WS Event Listeners */
        const wsSubscriptions = Object.entries(subscriptions).map(([event, listener]) => {
          /* this type was extracted from wavesurfer.js/dist/event-emitter.d.ts which is not exported */
          type EventListener<
            EventTypes extends GeneralEventTypes,
            EventName extends keyof EventTypes,
          > = (...args: EventTypes[EventName]) => () => void;
          const eventListener = [
            event,
            wavesurfer.on(
              event as keyof WaveSurferEvents,
              listener as EventListener<WaveSurferEvents, keyof WaveSurferEvents>,
            ),
          ] as [keyof WaveSurferEvents, EventListener<WaveSurferEvents, keyof WaveSurferEvents>];
          return eventListener;
        });

        /* Player Events sent though DOM Container */
        const listeners = {
          playPause: onPlayPause,
          setVolume: onSetVolume,
          setMuted: onSetMuted,
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
          /* Unsubscribe from WS events */
          wsSubscriptions.forEach(([, unsub]) => {
            unsub();
          });
          /* Unsubscribe from DOM events */
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
