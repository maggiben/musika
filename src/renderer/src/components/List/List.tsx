/* eslint-disable prettier/prettier */
import { useState, useEffect, useMemo } from 'react';
import Stars from '@components/Stars/Stars';
import styled, { css, keyframes, DefaultTheme } from 'styled-components';
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

const ListFront = styled.div<{progress: number[] | undefined}>`
  ${ListBase}
  color: ${({ theme }) => theme.colors.lightGray};
  position: absolute;
  top: 0;
  left: 0;
  ${({ progress }) =>
    progress &&
    css`
      clip-path: inset(0 0 0 ${progress[1]}%);
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

// const progressAnimation = (progress: number | undefined, theme: DefaultTheme) => keyframes`
//   /* from {
//     background-position: ${progress}% 0;
//   }
//   to {
//     background-position: 0 0;
//   } */
//   from {
//     background: linear-gradient(
//       to right,
//       ${theme.colors.red} 0%,
//       ${theme.colors.red} 0,
//       ${theme.colors.darkGray} 0,
//       ${theme.colors.darkGray} 0%
//     );
//   }
//   to {
//     background: linear-gradient(
//       to right,
//       ${theme.colors.red} 0%,
//       ${theme.colors.red} ${progress}%,
//       ${theme.colors.darkGray} ${progress}%,
//       ${theme.colors.darkGray} 100%
//     );
//   }
// `;

// const gradientAnimation = (theme: DefaultTheme) => keyframes`
//   0% {
//     background: linear-gradient(
//       to right,
//       ${({ theme }) => theme.color.red}: 0%,
//       ${({ theme }) => theme.color.red} 0%,
//       ${({ theme }) => theme.color.darkGray} 0%,
//       ${({ theme }) => theme.color.darkGray} 100%,
//     );
//   }
//   100% {
//     background: linear-gradient(
//       to right,
//       ${({ theme }) => theme.color.red}: 0%,
//       ${({ theme }) => theme.color.red} 100%,
//       ${({ theme }) => theme.color.darkGray} 100%,
//       ${({ theme }) => theme.color.darkGray} 100%,
//     );
//   }
// /* 
//   0% {
//     background: -webkit-linear-gradient(-45deg, #ff670f 0%, #ff670f 21%, #ffffff 56%, #0eea57 88%);
//     background: linear-gradient(135deg, #ff670f 0%, #ff670f 21%, #ffffff 56%, #0eea57 88%);
//   }
//   50% {
//     background: -webkit-linear-gradient(-45deg, #ff670f 0%, #ff670f 10%, #ffffff 40%, #0eea57 60%);
//     background: linear-gradient(135deg, #ff670f 0%, #ff670f 10%, #ffffff 40%, #0eea57 60%);
//   }
//   100% {
//     background: -webkit-linear-gradient(-45deg, #ff670f 0%, #ff670f 5%, #ffffff 10%, #0eea57 40%);
//     background: linear-gradient(135deg, #ff670f 0%, #ff670f 5%, #ffffff 10%, #0eea57 40%);
//   } */
// `;

const progressBarAnimation = (progress: number[]): Keyframes => {
    console.log('progress', progress);
    const kf = keyframes`
      from {
        left: 0;
        width: ${progress[0]}%;
      }
      to {
        width: ${progress[1]}%;
      }
    `;
    return kf;
};


// const StateChanged = styled.div`
//   position: relative;
//   width: 400px;
//   height: 20px;
//   border: 1px solid silver;

//   &::after {
//     content: '';
//     position: absolute;
//     height: 2px;
//     background: red;
//     animation: ${progressBarAnimation} 1.5s linear forwards;
//   }
// `;

const ListItemWrapper = styled.li<{ progress: number[] | undefined; animation: (progress: number[]) => Keyframes; }>`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: ${({ theme }) => theme.spacing.xxl};
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    background: ${({ theme }) => theme.colors.red};;
    z-index: -1;
    ${({ theme, progress, animation }) =>
    progress &&
    css`
      animation: ${animation(progress)} ${theme.animation.duration} ${theme.animation.timingFunction} forwards;
    `}
  }
`;

// const ListItemWrapper2 = styled.li<{ progress: number[] | undefined }>`
//   position: relative;
//   display: flex;
//   flex-direction: row;
//   flex-wrap: wrap;
//   margin: ${({ theme }) => theme.spacing.xxl};
//   ${({ theme, progress }) =>
//     progress &&
//     css`
//       animation: ${progressAnimation(progress,  theme)} 2s linear forwards;
//     `}
// `;

/* ${({ theme, progress }) => {
    return progress &&
    css`
      animation: ${gradientAnimation} 5s linear forwards;
      /* background: linear-gradient(
        to right,
        ${theme.colors.red} 0%,
        ${theme.colors.red} ${progress}%,
        ${theme.colors.darkGray} ${progress}%,
        ${theme.colors.darkGray} 100%
      );
      /* animation: ${progressAnimation(progress)} 2s linear forwards; */
      /*animation-name: ${progressAnimation(progress)};
      animation-duration: ${theme.animation.duration};
      animation-timing-function: ${theme.animation.timingFunction};
      animation-direction: alternate;
      animation-fill-mode: forwards;
      background-size: 100% auto; 
    `;
    }
  };
*/

interface IListProps {
  items?: IPlaylist['items'];
}

const List = (props: IListProps): JSX.Element | null => {
  const [progress, setProgress] = useState<Record<string, number>>();
  const playlistItemsListener = (event: IpcMainInvokeEvent, message: IDownloadWorkerMessage): void => {
    const { length } = (message?.details?.playlistItems as ytpl.result['items']);
    console.log(`total items: ${length}`);
  };

  const contentLengthListener = (event: IpcMainInvokeEvent, message: IDownloadWorkerMessage): void => {
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
    setProgress(prevProgress => {
      return { ...prevProgress, [source?.id]: Math.floor(percentage) };
    });
  };

  useEffect(() => {
    if('on' in window.electron.ipcRenderer && typeof window.electron.ipcRenderer.on === 'function') {
      window.electron.ipcRenderer.once('playlistItems', playlistItemsListener);
      window.electron.ipcRenderer.on('contentLength', contentLengthListener);
      window.electron.ipcRenderer.on('end', endListener);
      window.electron.ipcRenderer.on('timeout', timeoutListener);
      window.electron.ipcRenderer.on('exit', exitListener);
      window.electron.ipcRenderer.on('progress', progressListener);
    }
    return () => {
      if('off' in window.electron.ipcRenderer && typeof window.electron.ipcRenderer.off === 'function') {
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
    };

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
            return {...prevHash};
          });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  const getItem = (items: IPlaylist['items']): JSX.Element[] => {
    return items.map((item, index) => {
      const songIndex = padZeroes(index + 1, items.length.toString().split('').length);
      return (
        <ListItemWrapper key={`${item.id}-${index}`} progress={pp[item.id]} animation={progressBarAnimation}>
          <ListBack data-testid="list-item-back">
            <SongIndex>{songIndex}</SongIndex>
            <span>·</span>
            <span>
              <SongName>{item.title}</SongName>
            </span>
            <Stars stars={3} />
            <SongDuration>{item.duration}</SongDuration>
          </ListBack>
          <ListFront progress={pp[item.id]} data-testid="list-item-front">
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
