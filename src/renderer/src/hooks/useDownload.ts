import { useEffect, useState } from 'react';
import type ytpl from '@distube/ytpl';
import type { Progress } from 'progress-stream';
import type { IDownloadWorkerMessage } from 'types/types';
import type { IpcRendererEvent } from 'electron';

export interface IProgress {
  [key: string]: number[];
}

const useDownload = (): IProgress => {
  const [progress, setProgress] = useState<IProgress>({});

  useEffect(() => {
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
      setProgress((prevProgress) => {
        return {
          ...prevProgress,
          [source?.id]: [prevProgress?.[source?.id]?.[1] ?? 0, Math.floor(percentage)],
        };
      });
    };

    const listeners = {
      playlistItems: window.electron.ipcRenderer.on('playlistItems', playlistItemsListener),
      contentLength: window.electron.ipcRenderer.on('contentLength', contentLengthListener),
      end: window.electron.ipcRenderer.on('end', endListener),
      timeout: window.electron.ipcRenderer.on('timeout', timeoutListener),
      exit: window.electron.ipcRenderer.on('exit', exitListener),
      progress: window.electron.ipcRenderer.on('progress', progressListener),
    };

    return () => {
      Object.values(listeners).forEach((listener) => listener());
    };
  }, []);

  return progress;
};

export default useDownload;
