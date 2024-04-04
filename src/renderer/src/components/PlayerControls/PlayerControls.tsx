import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import {
  BsVolumeDownFill,
  BsVolumeMuteFill,
  BsVolumeOffFill,
  BsVolumeUpFill,
} from 'react-icons/bs';
import { MdSkipPrevious, MdSkipNext, MdPlayArrow, MdPause } from 'react-icons/md';
import { TiArrowLoop, TiArrowShuffle } from 'react-icons/ti';
import WaveSurfer, { IWaveSurferPlayerParams } from '@components/WaveSurfer/WaveSurfer';
import player from '@renderer/lib/player';
import { trackSelector } from '@states/selectors';
import { preferencesState } from '@states/atoms';
import InputRange from '@components/InputRange/InputRange';
import { SpaceRight } from '@components/Spacing/Spacing';
import { debounce } from '@shared/lib/utils';
import type { ITrack } from 'types/types';
import { PlayerStoryboardSpec } from 'youtubei.js/dist/src/parser/nodes';

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
  padding-right: ${({ theme }) => theme.spacing.xs};
  padding-left: ${({ theme }) => theme.spacing.xs};
  box-sizing: border-box;
`;

const PlayTime = styled.span`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  color: ${({ theme }) => theme.colors.lightGray};
  margin-right: ${({ theme }) => theme.spacing.xs};
`;

const VolumeSlider = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(90deg) translate(0%, 50%);
  top: calc(100% - 14px); /* choosen by chance */
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
  user-select: none;
  color: ${({ theme }) => theme.colors.lightGray};
  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.white};
  }
  &:disabled {
    color: ${({ theme }) => theme.colors.midGray};
    cursor: inherit;
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

const PlayerControls = (): JSX.Element => {
  const [preferences, setPreferences] = useRecoilState(preferencesState);
  const [track, setTrack] = useRecoilState(trackSelector);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [canplaythrough, setCanplaythrough] = useState(false);
  const waveSurferContainerRef = useRef<HTMLDivElement | null>(null);
  // const audioRef = useRef<HTMLAudioElement | null>(null);
  const song = useMemo(
    () => track?.filePath && window.library.parseUri(track.filePath, true),
    [track],
  );

  const playNextTrack = (): void => {
    console.log('asked to playNextTrack:', track, track?.next);
    if (!track?.next) return;
    const { next } = track;
    console.log('play next track', next);
    if (!next?.filePath && !preferences.behaviour.mediaPlayer.playExternal) {
      console.log('no file no external allowed');
      // setTrack(next);
    } else if (!next?.filePath && next?.url && preferences.behaviour.mediaPlayer.playExternal) {
      console.log('will play remote', next?.url);
      // const result = await window.commands.download(next?.url);
      // console.log('playNextTrack.remote: ', next?.url, result);
      // setTrack(next);
    } else if (next?.filePath) {
      console.log('playNextTrack local file', next.filePath);
      setTrack(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const onWsPlay = useCallback((): void => {
    console.log('onWsPlay');
  }, []);

  const onWsReady = useCallback(
    (params: IWaveSurferPlayerParams & { duration: number }): void => {
      console.log('onWsReady', params, 'duration', params.duration);
      if (isPlaying) {
        const event = new CustomEvent('playPause', {
          detail: { key: 'value' },
          bubbles: false,
          cancelable: true,
        });
        waveSurferContainerRef.current!.dispatchEvent(event);
      }
    },
    [isPlaying],
  );

  const onWsFinish = useCallback(async (): Promise<void> => {
    console.log('onWsFinish', waveSurferContainerRef.current);
    playNextTrack();
  }, [track]);

  const WaveSurferPlayer = useMemo(
    () => (
      <WaveSurfer
        ref={waveSurferContainerRef}
        onPlay={onWsPlay}
        onReady={onWsReady}
        onFinish={onWsFinish}
        onError={console.error}
        options={{
          height: 'auto',
          waveColor: 'gray',
          progressColor: 'white',
          url: song,
        }}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [track],
  );

  // const playNextTrack = useCallback(() => {
  //   console.log('asked to playNextTrack:', track?.next, isPlaying);
  //   if (!track || !isPlaying) return;
  //   const { next } = track;
  //   console.log('play next track', next);
  //   if (!next?.filePath && !preferences.behaviour.mediaPlayer.playExternal) {
  //     console.log('no file no external allowed');
  //     // setTrack(next);
  //   } else if (!next?.filePath && next?.url && preferences.behaviour.mediaPlayer.playExternal) {
  //     console.log('will play remote', next?.url);
  //     // const result = await window.commands.download(next?.url);
  //     // console.log('playNextTrack.remote: ', next?.url, result);
  //     // setTrack(next);
  //   } else if (next?.filePath) {
  //     console.log('playNextTrack local file', next.filePath);
  //     setTrack(next);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [track, isPlaying]);

  /* loading has started sync artwork */
  // const onLoadStart = useCallback(async (event: Event): Promise<void> => {
  //   console.log('audio onLoadStart', event);
  //   setCanplaythrough(false);
  // }, []);

  // const onCanPlayThrough = useCallback(async (): Promise<void> => {
  //   console.log('audio canplaythrough');
  //   setCanplaythrough(true);
  //   if (isPlaying) {
  //     const event = new CustomEvent('playPause', {
  //       detail: { key: 'value' },
  //       bubbles: false,
  //       cancelable: true,
  //     });
  //     waveSurferContainerRef.current!.dispatchEvent(event);
  //   }
  // }, [isPlaying]);

  /* Audio has ended */
  // const onEnded = useCallback(async (): Promise<void> => {
  //   console.log('audio ended');
  //   setCanplaythrough(false);
  //   playNextTrack();
  // }, []);

  // const onPlay = useCallback(async (event: Event): Promise<void> => {
  //   console.log('play or pause', event);
  // }, []);

  const playPause = useCallback((): void => {
    const event = new CustomEvent('playPause', {
      detail: { key: 'value' },
      bubbles: false,
      cancelable: true,
    });
    setIsPlaying(!isPlaying);
    waveSurferContainerRef.current!.dispatchEvent(event);
  }, [isPlaying]);

  const handleVolumeChange = debounce((volume: number): void => {
    const event = new CustomEvent('setVolume', {
      detail: { volume },
      bubbles: false,
      cancelable: true,
    });
    waveSurferContainerRef.current!.dispatchEvent(event);
    setPreferences((prev) => {
      return {
        ...prev,
        behaviour: {
          ...prev.behaviour,
          mediaPlayer: {
            ...prev.behaviour.mediaPlayer,
            volume,
          },
        },
      };
    });
  }, 500);

  useEffect(() => {
    console.info('init player controls!');
    // if (!song) return;
    // player.setSrc(song);

    /* Media event handlers */
    const mediaEvents = {
      // loadstart: onLoadStart,
      // canplaythrough: onCanPlayThrough,
      // ended: onEnded,
      // play: onPlay,
    };

    /* WS Events */
    // const wsEvents: { [key: string]: unknown } = {
    //   ready: () => {},
    // };

    /* Subscribe to Media events */
    // Object.entries(mediaEvents).forEach(
    //   ([event, listener]: [
    //     event: string,
    //     listener: ((event: Event) => Promise<void>) | (() => Promise<void>) | (() => Promise<void>),
    //   ]) => player.getAudio().addEventListener(event, listener),
    // );

    return () => {
      /* Unsubscribe from Media events */
      // Object.entries(mediaEvents).forEach(
      //   ([event, listener]: [
      //     event: string,
      //     listener:
      //       | ((event: Event) => Promise<void>)
      //       | (() => Promise<void>)
      //       | (() => Promise<void>),
      //   ]) => {
      //     player.getAudio().removeEventListener(event, listener);
      //   },
      // );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const volumeIcon = useMemo(() => {
    const { volume, muted } = preferences.behaviour.mediaPlayer;
    if (muted) return <BsVolumeMuteFill />;
    if (volume >= 0 && volume <= 30) {
      return <BsVolumeOffFill />;
    } else if (volume > 30 && volume <= 65) {
      return <BsVolumeDownFill />;
    } else if (volume > 65 && volume <= 100) {
      return <BsVolumeUpFill />;
    } else {
      return <BsVolumeOffFill />;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences.behaviour.mediaPlayer.volume, preferences.behaviour.mediaPlayer.muted]);

  return (
    <PlayerControlsContainer data-testid="playlist-controls">
      <StyledButtonGroup>
        <Volume>
          <StyledPlayerButton style={{ position: 'relative' }}>
            {volumeIcon}
            <VolumeSlider>
              <InputRange
                min="0"
                max="100"
                value={preferences.behaviour.mediaPlayer.volume}
                step="1"
                onChange={handleVolumeChange}
              />
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
        <span style={{ color: 'white' }}>isPlaying: {isPlaying ? 'true' : 'false'}</span>
        <StyledButtonGroup>
          <StyledPlayerButton disabled={!track?.prev} onClick={console.log}>
            <MdSkipPrevious />
          </StyledPlayerButton>
          <StyledPlayerButton
            disabled={!song}
            onClick={playPause}
            style={{ fontSize: '2.25em', lineHeight: '2.25em' }}
          >
            {!isPlaying ? <MdPlayArrow /> : <MdPause />}
          </StyledPlayerButton>
          <StyledPlayerButton disabled={!track?.next} onClick={console.log}>
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
      <SpaceRight size="xl" />
      <div style={{ display: 'flex', gap: '1em', height: 'calc(100% - 6px)', width: '100%' }}>
        {/* {WaveSurferPlayer} */}
        <WaveSurfer
          ref={waveSurferContainerRef}
          onPlay={onWsPlay}
          onReady={onWsReady}
          onFinish={onWsFinish}
          onError={console.error}
          options={{
            height: 'auto',
            waveColor: 'gray',
            progressColor: 'white',
            url: song,
          }}
        />
      </div>
      <SpaceRight size="xl" />
      <PlayTime>3:47</PlayTime>
    </PlayerControlsContainer>
  );
};

export default PlayerControls;
