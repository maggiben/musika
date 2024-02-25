/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import Stars from '@components/Stars/Stars';
import styled, { css, keyframes } from 'styled-components';
import { padZeroes } from '@utils/string';
import type ytpl from '@distube/ytpl';
import type { IpcMainInvokeEvent } from 'electron';
import type { IDownloadWorkerMessage } from 'types/types';
import type { Progress } from 'progress-stream';
import type { IPlaylist } from '@renderer/states/atoms';
import { Keyframes } from 'styled-components/dist/types';

const SongIndex = styled.span`
  user-select: none;
  font-family: ${({ theme }) => theme.fontFamily.mono};
  margin-left: ${({ theme }) => theme.spacing.xxs};
`;

const SongName = styled.p`
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin: 0px;
`;

const SongDuration = styled.span`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  margin-right: ${({ theme }) => theme.spacing.xxs};
`;

const ListBase = css`
  flex-grow: 1;
  padding: 0px;
  margin: 0px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow-y: hidden;
  & > span {
    min-width: 0;
    &:nth-child(1) {
      text-align: right;
      font-weight: bold;
    }
    &:nth-child(2) {
      flex-basis: content;
      margin: 0px 6px;
      text-align: center;
      font-weight: bold;
    }
    &:nth-child(3) {
      flex-basis: 65%;
      flex-grow: 1;
    }
    &:nth-child(5) {
      flex-basis: 10%;
      text-align: right;
      align-self: flex-end;
    }
  }
`;

const ListBack = styled.div`
  ${ListBase}
  color: ${({ theme }) => theme.colors.white};
  & > span:nth-child(4) {
    & .full {
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;

const ListFront = styled.div<{ $progress: number[] | undefined }>`
  ${ListBase}
  color: ${({ theme }) => theme.colors.lightGray};
  position: absolute;
  top: 0;
  left: 0;
  ${({ $progress }) =>
    $progress &&
    css`
      clip-path: inset(0 0 0 ${$progress[1]}%);
      transition-property: clip-path;
      transition-duration: ${({ theme }) => theme.transition.duration};
      transition-timing-function: ${({ theme }) => theme.transition.timingFunction};
    `}
`;

const ListWrapper = styled.ul`
  flex-grow: 1;
  list-style: none;
  padding: 0px;
  margin: 0px;
  width: 100%;
  overflow-y: scroll;
  & > li {
    ${ListBase}
  }
`;

const progressBarAnimation = ($progress: number[]): Keyframes => {
  const animation = keyframes`
    from {
      left: 0;
      width: ${$progress[0]}%;
    }
    to {
      width: ${$progress[1]}%;
    }
  `;
  return animation;
};

// const ListItemWrapper2 = styled('li').withConfig({
//   shouldForwardProp: () => true,
// }).attrs({ className: 'foo' })`
//   position: relative;
//   display: flex;
//   flex-direction: row;
//   flex-wrap: wrap;
//   margin: ${({ theme }) => theme.spacing.xxl};
//   &::before {
//     content: '';
//     position: absolute;
//     height: 100%;
//     background: ${({ theme }) => theme.colors.red};
//     z-index: -1;
//     ${({ theme, progress, animation }) =>
//       progress &&
//       animation &&
//       css`
//         animation: ${animation(progress)} ${theme.animation.duration}
//           ${theme.animation.timingFunction} forwards;
//       `};
//   }
// `;

const ListItemWrapper = styled.li<{
  $progress?: number[];
  $animation?: (progress: number[]) => Keyframes;
}>`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: ${({ theme }) => theme.spacing.xxl};
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    background: ${({ theme }) => theme.colors.red};
    z-index: -1;
    ${({ theme, $progress, $animation }) =>
      $progress &&
      $animation &&
      css`
        animation: ${$animation($progress)} ${theme.animation.duration}
          ${theme.animation.timingFunction} forwards;
      `};
  }
`;

interface IListProps {
  items?: IPlaylist['items'];
}

const List = (props: IListProps): JSX.Element | null => {
  const [progress, setProgress] = useState<Record<string, number>>();
  const playlistItemsListener = (
    event: IpcMainInvokeEvent,
    message: IDownloadWorkerMessage,
  ): void => {
    const { length } = message?.details?.playlistItems as ytpl.result['items'];
    console.log(`total items: ${length}`);
  };

  const contentLengthListener = (
    event: IpcMainInvokeEvent,
    message: IDownloadWorkerMessage,
  ): void => {
    const contentLength = message?.details?.contentLength as number;
    console.log(`contentLength: ${contentLength}`);
  };

  const endListener = (event: IpcMainInvokeEvent, message: IDownloadWorkerMessage): void => {
    setProgress((prevState) => {
      const newState = { ...prevState };
      delete newState[message?.source?.id];
      return newState;
    });
  };

  const timeoutListener = (event: IpcMainInvokeEvent, message: IDownloadWorkerMessage): void => {
    setProgress((prevState) => {
      const newState = { ...prevState };
      delete newState[message?.source?.id];
      return newState;
    });
  };

  const exitListener = (event: IpcMainInvokeEvent, message: IDownloadWorkerMessage): void => {
    setProgress((prevState) => {
      const newState = { ...prevState };
      delete newState[message?.source?.id];
      return newState;
    });
  };

  const progressListener = (event: IpcMainInvokeEvent, message: IDownloadWorkerMessage): void => {
    const { source } = message;
    const { percentage } = message?.details?.progress as Progress;
    setProgress((prevProgress) => {
      return { ...prevProgress, [source?.id]: Math.floor(percentage) };
    });
  };

  useEffect(() => {
    if (
      'on' in window.electron.ipcRenderer &&
      typeof window.electron.ipcRenderer.on === 'function'
    ) {
      window.electron.ipcRenderer.once('playlistItems', playlistItemsListener);
      window.electron.ipcRenderer.on('contentLength', contentLengthListener);
      window.electron.ipcRenderer.on('end', endListener);
      window.electron.ipcRenderer.on('timeout', timeoutListener);
      window.electron.ipcRenderer.on('exit', exitListener);
      window.electron.ipcRenderer.on('progress', progressListener);
    }
    return () => {
      if (
        'off' in window.electron.ipcRenderer &&
        typeof window.electron.ipcRenderer.off === 'function'
      ) {
        window.electron.ipcRenderer.off('playlistItems', playlistItemsListener);
        window.electron.ipcRenderer.off('contentLength', contentLengthListener);
        window.electron.ipcRenderer.off('end', endListener);
        window.electron.ipcRenderer.off('timeout', timeoutListener);
        window.electron.ipcRenderer.off('exit', exitListener);
        window.electron.ipcRenderer.off('progress', progressListener);
      }
    };
  }, []);

  const [pp, setPp] = useState<Record<string, number[]>>({});

  useEffect(() => {
    if (props?.items) {
      const hash = props.items
        .map((item) => {
          const start = Math.floor(Math.random() * 10);
          return {
            [item.id]: [start, start + 5], // Math.floor(Math.random() * 101),
          };
        })
        .reduce((acc, curr) => {
          const [id, value] = Object.entries(curr)[0];
          acc[id] = value;
          return acc;
        }, {});
      setPp(hash);
    }

    const interval = setInterval(() => {
      if (props?.items && !window['abortx']) {
        setPp((prevHash) => {
          for (const key in prevHash) {
            if (prevHash[key][1] < 100) {
              const end = Math.floor(Math.random() * 5);
              prevHash[key] = [prevHash[key][1], prevHash[key][1] + end];
            } else {
              prevHash[key][0] = 0;
              prevHash[key][1] = 0;
            }
          }
          return { ...prevHash };
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getItem = (items: IPlaylist['items']): JSX.Element[] => {
    return items.map((item, index) => {
      const songIndex = padZeroes(index + 1, items.length.toString().split('').length);
      return (
        <ListItemWrapper
          key={`${item.id}-${index}`}
          $progress={pp[item.id]}
          $animation={progressBarAnimation}
        >
          <ListBack data-testid="list-item-back">
            <SongIndex>{songIndex}</SongIndex>
            <span>·</span>
            <span>
              <SongName>{item.title}</SongName>
            </span>
            <Stars stars={3} />
            <SongDuration>{item.duration}</SongDuration>
          </ListBack>
          <ListFront $progress={pp[item.id]} data-testid="list-item-front">
            <SongIndex>{songIndex}</SongIndex>
            <span>·</span>
            <span>
              <SongName>{item.title}</SongName>
            </span>
            <Stars stars={3} />
            <SongDuration>{item.duration}</SongDuration>
          </ListFront>
        </ListItemWrapper>
      );
    });
  };

  return props.items ? (
    <ListWrapper data-testid="list-wrapper">{getItem(props.items)}</ListWrapper>
  ) : null;
};

export default List;
