import { useState, useEffect } from 'react';
import Stars from '@components/Stars/Stars';
import styled, { css } from 'styled-components';
import { padZeroes } from '@utils/string';
import type ytpl from '@distube/ytpl';
import type { IpcRendererEvent } from 'electron';
import type { IDownloadWorkerMessage } from 'types/types';
import type { Progress } from 'progress-stream';
import type { IPlaylist } from '@renderer/states/atoms';

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

const ListItemWrapper = styled.li<{
  $progress?: number[];
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
    left: 0;
    ${({ $progress }) =>
      $progress &&
      css`
        width: ${$progress[1]}%;
        transition-property: width;
        transition-duration: ${({ theme }) => theme.transition.duration};
        transition-timing-function: ${({ theme }) => theme.transition.timingFunction};
      `}
  }
`;

interface IListProps {
  items?: IPlaylist['items'];
}

const List = (props: IListProps): JSX.Element | null => {
  const [progress, setProgress] = useState<Record<string, number[]>>();
  const playlistItemsListener = (
    _event: IpcRendererEvent,
    message: IDownloadWorkerMessage,
  ): void => {
    const { length } = message?.details?.playlistItems as ytpl.result['items'];
    console.log(`total items: ${length}`);
  };

  const contentLengthListener = (
    _event: IpcRendererEvent,
    message: IDownloadWorkerMessage,
  ): void => {
    const contentLength = message?.details?.contentLength as number;
    console.log(`contentLength: ${contentLength}`);
  };

  const endListener = (_event: IpcRendererEvent, message: IDownloadWorkerMessage): void => {
    setProgress((prevState) => {
      const newState = { ...prevState };
      delete newState[message?.source?.id];
      return newState;
    });
  };

  const timeoutListener = (_event: IpcRendererEvent, message: IDownloadWorkerMessage): void => {
    setProgress((prevState) => {
      const newState = { ...prevState };
      delete newState[message?.source?.id];
      return newState;
    });
  };

  const exitListener = (_event: IpcRendererEvent, message: IDownloadWorkerMessage): void => {
    setProgress((prevState) => {
      const newState = { ...prevState };
      delete newState[message?.source?.id];
      return newState;
    });
  };

  const progressListener = (_event: IpcRendererEvent, message: IDownloadWorkerMessage): void => {
    const { source } = message;
    const { percentage } = message?.details?.progress as Progress;
    // setProgress((prevProgress) => {
    //   return { ...prevProgress, [source?.id]: Math.floor(percentage) };
    // });
    setProgress((prevProgress) => {
      return {
        ...prevProgress,
        [source?.id]: [prevProgress?.[source?.id]?.[1] ?? 0, Math.floor(percentage)],
      };
    });
  };

  useEffect(() => {
    if (
      'on' in window.electron.ipcRenderer &&
      typeof window.electron.ipcRenderer.on === 'function'
    ) {
      window.electron.ipcRenderer.on('playlistItems', playlistItemsListener);
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

  // const [pp, setPp] = useState<Record<string, number[]>>({});

  // useEffect(() => {
  //   if (props?.items) {
  //     const hash = props.items
  //       .map((item) => {
  //         const start = Math.floor(Math.random() * 10);
  //         return {
  //           [item.id]: [start, start + 5], // Math.floor(Math.random() * 101),
  //         };
  //       })
  //       .reduce((acc, curr) => {
  //         const [id, value] = Object.entries(curr)[0];
  //         acc[id] = value;
  //         return acc;
  //       }, {});
  //     setPp(hash);
  //   }

  //   const interval = setInterval(() => {
  //     if (props?.items && !window['abortx']) {
  //       setPp((prevHash) => {
  //         for (const key in prevHash) {
  //           if (prevHash[key][1] < 100) {
  //             const end = Math.floor(Math.random() * 5);
  //             prevHash[key] = [prevHash[key][1], prevHash[key][1] + end];
  //           } else {
  //             prevHash[key][0] = 0;
  //             prevHash[key][1] = 0;
  //           }
  //         }
  //         return { ...prevHash };
  //       });
  //     }
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  const getItem = (items: IPlaylist['items']): JSX.Element[] => {
    return items.map((item, index) => {
      const songIndex = padZeroes(index + 1, items.length.toString().split('').length);
      return (
        <ListItemWrapper key={`${item.id}-${index}`} $progress={progress?.[item.id]}>
          <ListBack data-testid="list-item-back">
            <SongIndex>{songIndex}</SongIndex>
            <span>·</span>
            <span>
              <SongName>{item.title}</SongName>
            </span>
            <Stars stars={3} />
            <SongDuration>{item.duration}</SongDuration>
          </ListBack>
          <ListFront $progress={progress?.[item.id]} data-testid="list-item-front">
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
