import { useRef, useCallback, useMemo, useEffect } from 'react';
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
import { preferencesState, playerState as currentPlayerState } from '@states/atoms';
import InputRange from '@components/InputRange/InputRange';
import { SpaceRight } from '@components/Spacing/Spacing';
import { debounce, getCircularArrayItems } from '@shared/lib/utils';
import type ytdl from 'ytdl-core';
import { ITrack } from 'types/types';

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
  const [playerState, setPlayerState] = useRecoilState(currentPlayerState);
  const waveSurferContainerRef = useRef<HTMLDivElement | null>(null);
  const song = useMemo(() => {
    const filePath = playerState.queue[playerState.queueCursor]?.filePath;
    const format = playerState.queue[playerState.queueCursor]?.['format'];
    if (filePath) return window.library.parseUri(filePath, true);
    if (format) return format.url;
    return undefined;
  }, [playerState]);

  /* TODO: take prev and next from a queue not from the list */
  const { next, prev } = useMemo(() => {
    const defaultValues = {
      next: undefined,
      prev: undefined,
    };
    const currentTrackId = playerState.queue[playerState.queueCursor]?.id;
    if (!currentTrackId) return defaultValues;
    return getCircularArrayItems(playerState.queue, 'id', currentTrackId) ?? defaultValues;
  }, [playerState]);

  const playNextTrack = async (): Promise<void> => {
    console.log('asked to playNextTrack:', next);
    if (!next) return;
    const queueCursor = playerState.queue.findIndex((track) => track.id === next.id);
    console.log('play next track', next, next.format);
    if (!next.filePath && !preferences.behaviour.mediaPlayer.playExternal) {
      console.log('not a local file and no external allowed');
      return;
    } else if (!next.filePath && next.format) {
      setPlayerState((prev) => ({ ...prev, queueCursor }));
      return;
    } else if (
      !next.filePath &&
      !next.format &&
      next.url &&
      preferences.behaviour.mediaPlayer.playExternal &&
      !preferences.downloads.autoSave
    ) {
      console.log('will play remote but not download', next.url);
      // Get the video info
      const result = (await window.commands.getVideoInfo(next.id)) as {
        videoId: string;
        videoInfo: ytdl.videoInfo;
        format: ytdl.videoFormat;
      };
      const newQueue = structuredClone(playerState.queue);
      newQueue[queueCursor] = { ...newQueue[queueCursor], format: result.format } as ITrack;
      console.log('playNextTrack.remote: ', next.title, result.videoInfo, result.format, newQueue);
      setPlayerState((prev) => ({ ...prev, queue: newQueue, queueCursor }));
      return;
    } else if (
      !next.filePath &&
      next.url &&
      preferences.behaviour.mediaPlayer.playExternal &&
      preferences.downloads.autoSave
    ) {
      console.log('will play and save remote media', next.id);
      // Get the video info
      const result = (await window.commands.download(next.id)) as unknown;
      console.log('result', result);
      // const newQueue = structuredClone(playerState.queue);
      // newQueue[queueCursor] = { ...newQueue[queueCursor], filePath: result.format } as ITrack;
      // console.log('playNextTrack.remote: ', next.title, result.videoInfo, result.format, newQueue);
      // setPlayerState((prev) => ({ ...prev, queue: newQueue, queueCursor }));
      return;
    } else if (next.filePath) {
      console.log('playNextTrack local file', next.filePath);
      setPlayerState((prev) => ({ ...prev, queueCursor }));
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const playPrevTrack = async (): Promise<void> => {
    console.log('asked to playPrevTrack:', prev);
    if (!prev) return;
    const queueCursor = playerState.queue.findIndex((track) => track.id === prev.id);
    console.log('play prev track', prev);
    if (!prev.filePath && !preferences.behaviour.mediaPlayer.playExternal) {
      console.log('not a local file and no external allowed');
      return;
    } else if (!prev.filePath && prev.url && preferences.behaviour.mediaPlayer.playExternal) {
      console.log('will play remote', prev.url);
      // const result = await window.commands.download(prev?.url);
      // console.log('playprevTrack.remote: ', prev?.url, result);
      // setTrack(prev);
      return;
    } else if (prev.filePath) {
      console.log('playPrevTrack local file', prev.filePath);
      setPlayerState((prev) => ({ ...prev, queueCursor }));
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const onWsPlay = useCallback((): void => {
    console.log('onWsPlay');
  }, []);

  const onWsReady = useCallback(
    (params: IWaveSurferPlayerParams & { duration: number }): void => {
      console.log('onWsReady', params, 'duration', params.duration);
      if (playerState.status === 'play') {
        const event = new CustomEvent('playPause', {
          detail: { key: 'value' },
          bubbles: false,
          cancelable: true,
        });
        waveSurferContainerRef.current!.dispatchEvent(event);
      }
    },
    [playerState],
  );

  const onWsFinish = useCallback(async (): Promise<void> => {
    console.log('onWsFinish', waveSurferContainerRef.current);
    playNextTrack();
  }, [song]);

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
    [song],
  );

  const playPause = useCallback((): void => {
    const event = new CustomEvent('playPause', {
      detail: { key: 'value' },
      bubbles: false,
      cancelable: true,
    });
    setPlayerState((prev) => {
      return {
        ...prev,
        status: prev.status === 'play' ? 'pause' : 'play',
      };
    });
    waveSurferContainerRef.current!.dispatchEvent(event);
  }, [playerState]);

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
    if (!song && playerState.status === 'play') {
      console.log('Invalid song play next');
      playNextTrack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song]);

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
        <StyledButtonGroup>
          <StyledPlayerButton disabled={!prev} onClick={playPrevTrack}>
            <MdSkipPrevious />
          </StyledPlayerButton>
          <StyledPlayerButton
            disabled={!song}
            onClick={playPause}
            style={{ fontSize: '2.25em', lineHeight: '2.25em' }}
          >
            {['stop', 'pause'].includes(playerState.status) || !song ? (
              <MdPlayArrow />
            ) : (
              <MdPause />
            )}
          </StyledPlayerButton>
          <StyledPlayerButton disabled={!next} onClick={playNextTrack}>
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
        {WaveSurferPlayer}
        {/* <WaveSurfer
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
        /> */}
      </div>
      <SpaceRight size="xl" />
      <PlayTime>3:47</PlayTime>
    </PlayerControlsContainer>
  );
};

export default PlayerControls;
