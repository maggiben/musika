import {
  useRef,
  useState,
  useEffect,
  useCallback,
  memo,
  useMemo,
  forwardRef,
  RefObject,
  useImperativeHandle,
  Ref,
} from 'react';
import styled from 'styled-components';
import { BsVolumeDownFill } from 'react-icons/bs';
import { MdSkipPrevious, MdSkipNext, MdPlayArrow, MdPause } from 'react-icons/md';
import { TiArrowLoop, TiArrowShuffle } from 'react-icons/ti';
import { WaveSurferOptions } from 'wavesurfer.js';
import useWaveSurfer from '@hooks/useWaveSurfer';
import InputRange from '@components/InputRange/InputRange';
import { SpaceRight } from '../Spacing/Spacing';

const PlayerControlsContainer = styled.div`
  --player-controls-height: 42px;
  --background-color: ${({ theme }) =>
    theme.colors['window-background']}; /* any format you want here */
  --background-color-darker: color-mix(in srgb, var(--background-color), #000 25%);
  --background-color-darkest: color-mix(in srgb, var(--background-color), #000 50%);
  background-color: var(--background-color-darkest);
  min-height: var(--player-controls-height);
  width: 100%;
  flex: 1 1 auto;
  border-bottom: 1px solid #313133;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlayTime = styled.span`
  color: ${({ theme }) => theme.colors.lightGray};
  margin-right: ${({ theme }) => theme.spacing.xs};
`;

const VolumeSlider = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(90deg) translate(0%, 50%);
  top: 0.85em;
  left: 50%;
  transform-origin: 0% 100%;
  z-index: 1;
`;

const Volume = styled.div`
  display: flex;
  height: 100%;
  position: relative;
  & ${VolumeSlider} {
    display: none;
  }
  &:hover {
    & ${VolumeSlider} {
      display: flex;
    }
  }
`;

const StyledPlayerButton = styled.button`
  outline: none;
  border: none;
  line-height: 1.75em;
  font-size: 1.75em;
  background-color: transparent;
  text-align: center;
  padding: 0px;
  margin: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.lightGray};
  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const StyledPlayerLabel = styled(StyledPlayerButton).attrs({ as: 'label' })`
  line-height: 1em;
  font-size: 1em;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StyledInputCheck = styled.div`
  & [type='checkbox'] {
    display: none;
  }
  & [type='checkbox']:checked ~ label {
    color: ${({ theme }) => theme.colors.white};
  }
`;

// Create a React component that will render wavesurfer.
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

const WaveSurferPlayer = memo(
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

const PlayerControls = (): JSX.Element => {
  const [isPlaying, setIsPlaying] = useState(false);
  const waveSurferContainerRef = useRef<HTMLDivElement | null>(null);
  const song = useMemo(
    () => window.library.parseUri('/Users/bmaggi/Downloads/find-my-baby.mp3'),
    [],
  );

  const onWsPlay = useCallback((params: IWaveSurferPlayerParams): void => {
    setIsPlaying(params.isPlaying);
  }, []);

  const onWsReady = useCallback((params: IWaveSurferPlayerParams & { duration: number }): void => {
    console.log('ready', params, 'duration', params.duration);
  }, []);

  const WaveSurferPlayerComponent = useMemo(
    () => (
      <WaveSurferPlayer
        ref={waveSurferContainerRef}
        onPlay={onWsPlay}
        onReady={onWsReady}
        options={{
          height: 'auto',
          waveColor: 'gray',
          progressColor: 'white',
          url: song,
        }}
      />
    ),
    [],
  );

  const handlePlayButtonClick = useCallback((): void => {
    const event = new CustomEvent('playPause', {
      detail: { key: 'value' },
      bubbles: false,
      cancelable: true,
    });
    isPlaying && setIsPlaying(!isPlaying);
    waveSurferContainerRef.current!.dispatchEvent(event);
  }, [isPlaying]);

  return (
    <PlayerControlsContainer data-testid="playlist-controls">
      <StyledButtonGroup>
        <Volume>
          <StyledPlayerButton style={{ position: 'relative' }}>
            <BsVolumeDownFill />
            <VolumeSlider>
              <InputRange min="0" max="100" value="50" step="1" />
            </VolumeSlider>
          </StyledPlayerButton>
        </Volume>
        <SpaceRight size="m" />
        <StyledInputCheck>
          <input id="player-shuffle" type="checkbox" />
          <StyledPlayerLabel htmlFor="player-shuffle">
            <TiArrowShuffle />
          </StyledPlayerLabel>
        </StyledInputCheck>
        <SpaceRight size="xs" />
        <StyledButtonGroup>
          <StyledPlayerButton onClick={console.log}>
            <MdSkipPrevious />
          </StyledPlayerButton>
          <StyledPlayerButton onClick={handlePlayButtonClick}>
            {!isPlaying ? <MdPlayArrow /> : <MdPause />}
          </StyledPlayerButton>
          <StyledPlayerButton onClick={console.log}>
            <MdSkipNext />
          </StyledPlayerButton>
        </StyledButtonGroup>
        <SpaceRight size="xs" />
        <StyledInputCheck>
          <input id="player-loop" type="checkbox" />
          <StyledPlayerLabel htmlFor="player-loop">
            <TiArrowLoop />
          </StyledPlayerLabel>
        </StyledInputCheck>
      </StyledButtonGroup>
      <div style={{ display: 'flex', gap: '1em', height: 'calc(100% - 6px)' }}>
        {WaveSurferPlayerComponent}
      </div>
      <PlayTime>3:47</PlayTime>
    </PlayerControlsContainer>
  );
};

export default PlayerControls;
